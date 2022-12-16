import { Injectable } from '@nestjs/common';
import { CreditReserveOrdersRepository } from '../credit-reserve-orders/credit-reserve-orders.repository';
import {
  SHOP_ID,
  PROCESSING_DIVISION,
  PAYMENT_METHOD,
  ACCOUNT_TYPE,
  CARD_ERRORS,
  GMO_STATUS_CODE,
} from '../../../configs/constants/gmo';
import { BaseException } from '../../../vendors/exceptions/base.exception';
import { GmoData, GmoItemInput } from '../../../app/graphql/graphql.schema';
import { PaymentInfoRepository } from './payment-info.repository';
import {
  LIST_STEPS,
  CHECK_RESULT,
} from '../../../configs/constants/check-result';
import { In, QueryRunner } from 'typeorm';
import { PaymentInfo } from './entities/payment_info.entity';
import { CreditCardInfoRepository } from '../inactive-card/credit-card-info.repository';
import {
  handleTransation,
  saveMany,
  startTransation,
} from '../../../vendors/base/base.transation';
import {
  READ_FILE_FAILL,
  INCORRECT_FILE_FORMAT,
} from '../../../configs/constants/error-code/base';
import { LIMIT_COLUMN_CSV } from '../../../configs/constants/constant';
import { Upload } from 'graphql-upload';
import { parse } from 'csv-parse';
import { CreditReserveOrdersService } from '../credit-reserve-orders/credit-reserve-orders.service';
import { CreditProcessStepRepository } from '../credit-process-steps/credit-process-steps.repository';

@Injectable()
export class GmoService {
  constructor(
    private creditReserveOrdersRepository: CreditReserveOrdersRepository,
    private paymentInfoRepository: PaymentInfoRepository,
    private creditCardInfoRepository: CreditCardInfoRepository,
    private creditReserveOrdersService: CreditReserveOrdersService,
    private creditProcessStepRepository: CreditProcessStepRepository,
  ) {}
  /**
   * get data to generation GMO file
   * @param dateOrder
   * @returns
   */
  async getGmoData(dateOrder: Date) {
    let items = await this.creditReserveOrdersRepository.getOrderGmon(
      dateOrder,
    );
    items = items.map((item, index) => ({
      shopId: SHOP_ID,
      orderId: this.generateUniqueId(index),
      processingDivision: PROCESSING_DIVISION,
      amount: item.amount,
      paymentMethod: PAYMENT_METHOD,
      memberId: item.memberId,
    }));
    return items;
  }

  /**
   * generate Unique Id
   * @param index
   * @returns
   */
  generateUniqueId(index: number) {
    return (
      Math.floor(Date.now() / 1000).toString() +
      (100000000 + (index + 1)).toString().substring(1)
    );
  }

  /**
   * handle read file csv GMO
   * @param data
   * @returns Promise<GmoItemInput[]>
   */
  async handleReadFileGmo(data: GmoData): Promise<GmoItemInput[]> {
    await data?.file?.promise;
    const { file }: Upload = data.file;
    const { createReadStream } = await file;
    const items: GmoItemInput[] = [];
    try {
      const parser = createReadStream()?.pipe(parse());
      for await (const record of parser) {
        if (record.length !== LIMIT_COLUMN_CSV) {
          throw new BaseException(
            INCORRECT_FILE_FORMAT.CODE,
            INCORRECT_FILE_FORMAT.MESSAGE,
          );
        }
        items.push({
          orderId: record[1] || '',
          memberId: record[9] || '',
          errorCode: record[20] || '',
          errorCodeDetail: record[21] || '',
          statusCode: record[24] || '',
        });
      }
    } catch (error) {
      if (error instanceof BaseException) {
        throw error;
      }
      throw new BaseException(READ_FILE_FAILL.CODE, READ_FILE_FAILL.MESSAGE);
    }
    return items;
  }

  /**
   * update check gmo status and update error card info
   * @param data
   * @returns
   */
  async updateGmoData(data: GmoData) {
    await this.creditReserveOrdersService.handleValidExcuteByDate(
      data.orderDate,
      // step before
      LIST_STEPS.authSalesResult - 1,
    );
    const items = await this.handleReadFileGmo(data);
    const payments = await this.getPaymentByGmoItems(items);
    const orders = await this.getOrdersForGmo(data.orderDate);
    const orderIds = {
      OK: [],
      NG: [],
      UKN: [],
      ERR: [],
    };
    for (const order of orders) {
      order.authSalesResult = this.getStatusByAccount(
        items,
        payments,
        order.accountCode,
        order.branchCode,
      );
      if (order.authSalesResult === CHECK_RESULT.OK) {
        orderIds.OK.push(order.id);
      } else if (order.authSalesResult === CHECK_RESULT.NG) {
        orderIds.NG.push(order.id);
      } else if (order.authSalesResult === CHECK_RESULT.UKN) {
        orderIds.UKN.push(order.id);
      } else {
        orderIds.ERR.push(order.id);
      }
    }
    const errorCards = await this.getErrorsItems(items);
    for (const card of errorCards) {
      card.invalidFlg = Boolean(CHECK_RESULT.NG);
    }
    const transaction = await startTransation();
    await handleTransation(transaction, async () => {
      await this.handleAuthSalesResults(transaction, orderIds);
      await saveMany(errorCards, transaction);
    });
    await this.creditProcessStepRepository.updateStep(
      data.orderDate,
      LIST_STEPS.authSalesResult,
    );
  }

  async handleAuthSalesResults(queryRunner: QueryRunner, orderIds) {
    if (orderIds.OK?.length) {
      await this.creditReserveOrdersRepository.updateAuthSalesResults(
        queryRunner,
        orderIds.OK,
        CHECK_RESULT.OK,
      );
    }
    if (orderIds.NG?.length) {
      await this.creditReserveOrdersRepository.updateAuthSalesResults(
        queryRunner,
        orderIds.NG,
        CHECK_RESULT.NG,
      );
    }
    if (orderIds.UKN?.length) {
      await this.creditReserveOrdersRepository.updateAuthSalesResults(
        queryRunner,
        orderIds.UKN,
        CHECK_RESULT.UKN,
      );
    }
    if (orderIds.ERR?.length) {
      await this.creditReserveOrdersRepository.updateAuthSalesResults(
        queryRunner,
        orderIds.ERR,
        CHECK_RESULT.ERR,
      );
    }
  }

  /**
   * get list orders for before/after update gmo data
   * @param orderDate
   * @param authSalesResult
   * @returns
   */
  async getOrdersForGmo(orderDate) {
    return await this.creditReserveOrdersRepository.getOrdersByDate(orderDate, {
      accountType: In([ACCOUNT_TYPE.DEFAULT, ACCOUNT_TYPE.TSUMITATE_NISA]),
      invalidCardCheckResult: CHECK_RESULT.OK,
      branchlockResult: CHECK_RESULT.OK,
      ycustomerResult: CHECK_RESULT.OK,
      moneyShortageResult: CHECK_RESULT.OK,
      nisaResult: CHECK_RESULT.OK,
      nameMatchingResult: CHECK_RESULT.OK,
    });
  }

  /**
   * get list payment info from gmo item
   * @param items
   * @returns
   */
  async getPaymentByGmoItems(items: GmoItemInput[]) {
    const members = items.map((item) => item.memberId);
    return await this.paymentInfoRepository.getPaymentByMemberIds(members);
  }

  /**
   * get status of account
   * @param items
   * @param payments
   * @param accountCode
   * @param branchCode
   * @returns
   */
  getStatusByAccount(
    items: GmoItemInput[],
    payments: PaymentInfo[],
    accountCode,
    branchCode,
  ) {
    const payment = payments.find(
      (item) =>
        item.accountCode?.trim() === accountCode?.trim() &&
        item.branchCode?.trim() === branchCode?.trim(),
    );
    if (payment) {
      const gmoItem = items.find((gmo) => {
        return gmo.memberId === payment.memberId;
      });
      if (gmoItem) {
        if (
          gmoItem.statusCode.toUpperCase().trim() ===
            GMO_STATUS_CODE.COMPLETE.toUpperCase() &&
          !gmoItem.errorCode &&
          !gmoItem.errorCodeDetail
        ) {
          return CHECK_RESULT.OK;
        } else {
          return CHECK_RESULT.NG;
        }
      } else {
        return CHECK_RESULT.UKN;
      }
    } else {
      return CHECK_RESULT.ERR;
    }
  }

  /**
   * get list errors from cards
   * @param items
   * @returns
   */
  async getErrorsItems(items: GmoItemInput[]) {
    const errors = items.filter((item) => {
      if (
        !item.errorCode &&
        !item.errorCodeDetail &&
        item.statusCode === GMO_STATUS_CODE.COMPLETE
      ) {
        return false;
      } else {
        const error = CARD_ERRORS.get(item.errorCodeDetail);
        return (
          item.statusCode.trim() === GMO_STATUS_CODE.FAIL ||
          item.statusCode.trim() === GMO_STATUS_CODE.INVALID ||
          item.statusCode.trim() === GMO_STATUS_CODE.REGISTER ||
          (error && error === item.errorCode)
        );
      }
    });
    const errorPayments = await this.getPaymentByGmoItems(errors);
    const errorAccounts = errorPayments.map((item) => ({
      accountCode: item.accountCode,
      branchCode: item.branchCode,
    }));
    if (errorAccounts.length) {
      return await this.creditCardInfoRepository.find({ where: errorAccounts });
    }
    return [];
  }
}
