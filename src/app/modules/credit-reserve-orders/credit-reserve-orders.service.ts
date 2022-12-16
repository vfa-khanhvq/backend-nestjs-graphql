import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { BaseException } from '../../../vendors/exceptions/base.exception';
import { WB4NisaLimitDataRepository } from '../wb4-nina-limitdata/wb4-nisa-limitdata.repository';
import {
  CHAR_END_LENGTH,
  CUSTOMER_SERVICE_TYPE_ACCEPTED,
  DEPOSIT_SNR,
  REFRESH_TOKEN,
  STATUS,
} from '../../../configs/constants/constant';
import {
  BASE_REPOSITORY_ERROR,
  CHECK_RUN_FAIL,
  COMMON_ERROR,
  CUSTOMER_ORDER_INVALID,
  ORDER_DATE_INVALID,
} from '../../../configs/constants/error-code/base';
import {
  CHECK_RESULT,
  CREDIT_LIMIT,
  THIS_YEAR,
  LIST_STEPS,
  DEFAULT_VALUE,
  getKeySteps,
  SNR_DELETED_VALUE,
  DEFAULT_STEP,
  RESULT_STEP,
} from '../../../configs/constants/check-result';
import {
  InputCreditOrder,
  InputCheckResults,
  InputInsertData,
  InputResetOrder,
  IntputGetOrderByDate,
  Orders,
  OrdersRespone,
  ProcessStatus,
  InputChangeOrderDate,
  InputUpateStep,
  InputCheckResult,
  InputInsertDataReserver,
} from '../../graphql/graphql.schema';
import { CreditReservesService } from '../credit-reserves/credit-reserves.service';
import { CustomerOrderClosesRepository } from '../customer-order-closes/customer-order-closes.repository';
import { CustomerOrderCloses } from '../customer-order-closes/entities/customer-order-closes.entity';
import { Holidays } from '../holidays/entities/holidays.entity';
import { HolidaysRepository } from '../holidays/holidays.repository';
import { SnrfileDeposits } from '../snrfile-deposits/entities/snrfile-deposits.entity';
import { CreditReserveOrdersRepository } from './credit-reserve-orders.repository';
import { CreditReserveOrder } from './entities/credit-reserve-order.entity';
import { SnrCustomerMstBcp } from '../snr-customer-mst-bcp/entities/snr-customer-mst-bcp.entity';
import { SnrCustomerMstBcpRepository } from '../snr-customer-mst-bcp/snr-customer-mst-bcp.repository';
import { SnrGlobalHolidayCalendarBcpRepository } from '../snr-global-holiday-calendar-bcp/snr-global-holiday-calendar-bcp.repository';
import { SnrGlobalHolidayCalendarBcp } from '../snr-global-holiday-calendar-bcp/entities/snr-global-holiday-calendar-bcp.entity';
import { In, IsNull, Not, QueryRunner, Repository } from 'typeorm';
import { ACCOUNT_TYPE } from '../../../configs/constants/gmo';
import {
  SAVE_CHUNK_NUMBER,
  SAVE_CHUNK_NUMBER_BY_IDS,
  SAVE_CHUNK_NUMBER_KANA,
  WEEKEN_DAY,
} from '../../../configs/constants/common';
import { SnrFileFunds } from '../snrfile_funds/entities/snrfile_funds.entity';
import {
  startTransation,
  handleTransation,
} from '../../../vendors/base/base.transation';
import {
  COMMISSION_TYPE,
  DATA_CODE,
  HULFT_NUMBER,
  ID_DEFAULT,
  METHOD,
  ORDER_CH,
  RECEIVETIME,
  SPECIFIED_ACCOUNT_TYPE,
  UNIT_TYPE,
} from '../../../configs/constants/error-code/snr-file-fund';
import { InjectRepository } from '@nestjs/typeorm';
import { CreditKana } from '../credit/credit-kana.entity';
import { AccountMstBcp } from '../WB4/account-MST-BCP.entity';
import { AccessTokenInfo } from '../auth/entities/access-token.entity';
import {
  createMac,
  createNonce,
  decryptAES,
} from '../../../common/util/encypt-decrypt-hash';
import { callApi, callApiWithMAC } from '../../../common/util/axios.service';
import { CreditProcessTransactionRepository } from '../credit-process-transactions/credit-process-transactions.repository';
import { WB4NisaLimitData } from '../wb4-nina-limitdata/entities/wb4-nisa-limitdata.entity';
import {
  DATA_FLAG,
  INFO_KEY,
} from '../../../configs/constants/check_kana_name';
import {
  createCreditReservesOrders,
  createFundMsts,
  createSnrGlobalHolidays,
  createCreditCardInfo,
  createsnrCustomers,
  createSnrOrderLocks,
  createSnrCustomerAccountBalanceBcps,
  createWB4NisaLimitDatas,
  createWb4AccountMsts,
  setOrderDate,
} from '../../../../test/check-results/insert-date';
import { PROCESS_EXECUTION_DONE } from '../../../configs/constants/error-code/errors';
import { CreditProcessStepRepository } from '../credit-process-steps/credit-process-steps.repository';
import { CreditProcessStep } from '../credit-process-steps/entities/credit-process-steps.entity';

interface TotalPrice {
  total?: number;
  isUnknown: boolean;
}
interface WB4NisaLimitDataInterface {
  [key: string]: WB4NisaLimitData;
}

@Injectable()
export class CreditReserveOrdersService {
  constructor(
    private creditReserveOrdersRepository: CreditReserveOrdersRepository,
    private holidaysRepository: HolidaysRepository,
    private creditReservesService: CreditReservesService,
    private customerOrderClosesRepository: CustomerOrderClosesRepository,
    private wb4NisaLimitDataRepository: WB4NisaLimitDataRepository,
    private snrCustomerMstBcpRepository: SnrCustomerMstBcpRepository,
    private snrGlobalHolidayCalendarBcpRepository: SnrGlobalHolidayCalendarBcpRepository,
    @InjectRepository(AccessTokenInfo)
    private accessTokenRepository: Repository<AccessTokenInfo>,
    @InjectRepository(AccountMstBcp)
    private accountMstBcpRepository: Repository<AccountMstBcp>,
    private creditProcessTransactionRepository: CreditProcessTransactionRepository,
    private creditProcessStepRepository: CreditProcessStepRepository,
  ) {}
  /**
   * pagination and order list orderBy year and month and list detail orderBy order_date.
   * @param page
   * @param pageSize
   * @for (const item of items) { await getOrderListOrderByMonthly -> get list detail }
   * @returns Promise<OrdersRespone>
   * @author HuuTC
   */
  async getOrderList(page: number, pageSize: number): Promise<OrdersRespone> {
    if (!page || page < 0) {
      throw new BaseException(
        BASE_REPOSITORY_ERROR.PAGE_ERROR,
        BASE_REPOSITORY_ERROR.PAGE_ERROR_MSG,
      );
    }
    if (!pageSize || pageSize < 0) {
      throw new BaseException(
        BASE_REPOSITORY_ERROR.PAGE_SIZE_ERROR,
        BASE_REPOSITORY_ERROR.PAGE_SIZE_ERROR_MSG,
      );
    }
    const { items, pagination } =
      await this.creditReserveOrdersRepository.getOrderList(page, pageSize);
    const _items: Orders[] = new Array<Orders>();
    let index = 1;
    for (const item of items) {
      const order: Orders = new Object();
      // set orderNo = page * index++ -> current month always is 1;
      order.no = pageSize * (page - 1) + index++;
      order.month = item.orderMonth;
      order.year = item.orderYear;
      order.orderDetail =
        await this.creditReserveOrdersRepository.getOrderListOrderByMonthly(
          item.orderMonth,
          item.orderYear,
        );
      _items.push(order);
    }
    return { items: _items, pagination };
  }

  /**
   * create payments to snr by orders
   * @param orderDate date
   * @for (const item of orders) { handle update orders and create snrfile_deposit }
   * @author HuuTC
   */
  async createPaymentsToSnr(orderDate: Date): Promise<CreditReserveOrder[]> {
    if (!orderDate || !moment(orderDate).isValid()) {
      throw new BaseException(
        ORDER_DATE_INVALID.CODE,
        ORDER_DATE_INVALID.MESSAGE,
      );
    }
    await this.handleValidExcuteByDate(
      orderDate,
      // step before
      LIST_STEPS.snrfileDepositsId - 1,
    );
    try {
      let orders =
        await this.creditReserveOrdersRepository.getOrdersJoinFundMst(
          orderDate,
        );
      if (orders.length === 0) {
        return;
      }
      // get holidays of curr month
      const holidaysByCurrMonth: Holidays[] =
        await this.holidaysRepository.getHolidaysByCurrentMonth();
      // get customer order closes of curr month
      const orderClosesByCurrentMonth: CustomerOrderCloses[] =
        await this.customerOrderClosesRepository.getOrderClosesByCurrentMonth();

      const brandCodes: string[] = [
        ...new Set(orders.map((item) => item.brand_code)),
      ];
      const branchsAccounts = [
        ...new Map(
          orders.map((item) => {
            const valueReturn = {
              officeCode: item.branch_code,
              customerCode: item.account_code,
            };
            return [JSON.stringify(valueReturn), valueReturn];
          }),
        ).values(),
      ];
      const snrCustomerMstBcps = await this.snrCustomerMstBcpRepository.find({
        where: branchsAccounts,
      });
      const snrGlobalHolidays: SnrGlobalHolidayCalendarBcp[] =
        await this.snrGlobalHolidayCalendarBcpRepository.getHolidayBySecurityCodes(
          brandCodes,
        );
      const weekend = this.getDaysWeekendInMonth();
      const holidays = [
        ...holidaysByCurrMonth.map((item) => new Date(item.date).getDate()),
        ...weekend,
      ];
      const snrfileDepositsList = new Array<SnrfileDeposits>();
      const creditReserveOrders = new Array<CreditReserveOrder>();
      for (const item of orders) {
        const { tilExecutionDays, ..._item } = item;
        // Map from native table column to Entity
        const creditReserveOrder: CreditReserveOrder =
          this.creditReserveOrdersRepository.mapColumnToEntity(_item);
        const orderDay: number = creditReserveOrder.orderDate.getDate();
        // check special case ( order_date = Holiday )
        // getDateWithoutSNRHolidays return == orderDay -> order_date != Holiday
        const checkedOrderDay: number =
          this.creditReservesService.getDateWithoutSNRHolidays(
            snrGlobalHolidays,
            creditReserveOrder.branchCode,
            orderDay,
          );
        if (orderDay !== checkedOrderDay) {
          continue;
        }
        // get day woking without holiday
        const tilWorkingDay = this.getTradeDayByTilExecutionAndOrderDate(
          holidays,
          Number(tilExecutionDays),
          orderDay,
        );
        // get tradeDate by tilWorkingDay and tilExecutionDays
        const tradeDate: Date =
          this.creditReservesService.getDateByDay(tilWorkingDay);
        const customerOrderClosesId: number = this.getCustomerOrderClosesId(
          orderClosesByCurrentMonth,
          tradeDate,
        );
        if (!customerOrderClosesId) {
          continue;
        }
        const tradeDateYYYYMMDD = moment(tradeDate).format('YYYYMMDD');
        const snrfileDeposits = new SnrfileDeposits();
        snrfileDeposits.customerOrderCloseId = customerOrderClosesId;
        snrfileDeposits.workingDay = tradeDateYYYYMMDD;
        snrfileDeposits.transferDate = tradeDateYYYYMMDD;
        // Map snrfileDeposits by creditReserveOrder
        await this.setSnrfileDeposits(
          creditReserveOrder,
          snrfileDeposits,
          snrCustomerMstBcps,
        );
        snrfileDepositsList.push(snrfileDeposits);
        creditReserveOrders.push(creditReserveOrder);
      }
      orders = [];
      const queryRunner = await startTransation();
      await handleTransation(queryRunner, async () => {
        // snrfileDepositsList and creditReserveOrders same length
        await this.handleInsertAndUpdateSnrDepositsAndOrders(
          queryRunner,
          snrfileDepositsList,
          creditReserveOrders,
        );
      });
      await this.creditProcessStepRepository.updateStep(
        orderDate,
        LIST_STEPS.snrfileDepositsId,
      );
    } catch (error) {
      throw new BaseException(
        COMMON_ERROR.ERROR,
        error.message || COMMON_ERROR.ERROR_MSG,
      );
    }
  }

  /**
   * Slice list and update SnrfileDeposits and orders
   * @param queryRunner
   * @param snrfileDepositsList
   * @param orders
   * @author HuuTC
   */
  async handleInsertAndUpdateSnrDepositsAndOrders(
    queryRunner: QueryRunner,
    snrfileDepositsList: SnrfileDeposits[],
    orders: CreditReserveOrder[],
  ) {
    const loop = Math.ceil(snrfileDepositsList.length / SAVE_CHUNK_NUMBER);
    for (let index = 0; index < loop; index++) {
      const snrfileDepositsListSlice = snrfileDepositsList.slice(
        SAVE_CHUNK_NUMBER * index,
        SAVE_CHUNK_NUMBER * (index + 1),
      );
      const ordersSlice = orders.slice(
        SAVE_CHUNK_NUMBER * index,
        SAVE_CHUNK_NUMBER * (index + 1),
      );
      await queryRunner.manager.insert(
        SnrfileDeposits,
        snrfileDepositsListSlice,
      );
      // update sequenceNo by id list snrfileDepositsListSlice
      await queryRunner.manager
        .createQueryBuilder()
        .update(SnrfileDeposits)
        .set({
          sequenceNo: () =>
            this.getMultipleCaseUpdateSQL(
              snrfileDepositsListSlice,
              'id',
              (item) => this.getCharAtEndId(item.id),
              'string',
            ),
          updatedAt: new Date(),
        })
        .where({
          id: In(snrfileDepositsListSlice.map((item) => item.id)),
        })
        .execute();
      // update snrfileDepositsId by id list snrfileDepositsListSlice
      await queryRunner.manager
        .createQueryBuilder()
        .update(CreditReserveOrder)
        .set({
          snrfileDepositsId: () =>
            this.getMultipleCaseUpdateSQL(
              ordersSlice,
              'id',
              (_, i) => snrfileDepositsListSlice[i].id,
            ),
          updatedAt: new Date(),
        })
        .where({
          id: In(ordersSlice.map((item) => item.id)),
        })
        .execute();
    }
  }

  /**
   * Get trade day by tilExecutionDays and orderDay
   * @expamle order_date = 8, holidays = [] => tilExecutionDays = 1 then return tilWorkingDay is 8
   * @expamle order_date = 8, holidays = [] => tilExecutionDays = 2 then return tilWorkingDay is 9
   * @expamle order_date = 8, holidays = [9] => tilExecutionDays = 3 then return tilWorkingDay is 11
   * @param holidays holidays + weekend array number
   * @param tilExecutionDays until to trade date number
   * @param orderDay day num
   * @returns trade day number
   * @author HuuTC
   */
  getTradeDayByTilExecutionAndOrderDate(
    holidays: number[],
    tilExecutionDays: number,
    orderDay: number,
  ) {
    const dates = [];
    const endIndex = tilExecutionDays - 1;
    for (let index = 0; index < tilExecutionDays; index++) {
      let tilWorkingDay = index === 0 ? orderDay : dates[index - 1] + 1;
      // getDateWithoutHolidays -> return date working
      tilWorkingDay = this.getDateWithoutHolidays(holidays, tilWorkingDay);
      dates.push(tilWorkingDay);
    }
    return dates[endIndex];
  }

  /**
   * get all day weekend of current month
   * @return List with date objects for weekend day of the month
   * @author HuuTC
   */
  getDaysWeekendInMonth(): number[] {
    const weekend: number[] = [];
    Array.from(Array(moment().daysInMonth()), (_, i) => {
      const day = i + 1;
      const d = new Date();
      d.setDate(day);
      d.setHours(0, 0, 0);
      // check is WEEKEN
      if (~WEEKEN_DAY.indexOf(d.getDay())) {
        weekend.push(day);
      }
    });
    return weekend;
  }

  /**
   * get CharAtEnd by id, padStart if id < CHAR_END_LENGTH
   * @param id destination to get
   * @returns CharAtEnd
   * @author HuuTC
   */
  getCharAtEndId(_id: number | string) {
    if (_id === null || _id === undefined) {
      return '';
    }
    const id = String(_id);
    // Get 8 char at end
    let sequenceNo = id.substring(id.length, id.length - CHAR_END_LENGTH);
    // padStart if sequenceNo not enough 8 char
    sequenceNo = sequenceNo.padStart(CHAR_END_LENGTH, '0');
    return sequenceNo;
  }

  /**
   * Set snrfileDeposits
   * @param creditReserveOrder CreditReserveOrder entity
   * @param snrfileDeposits SnrfileDeposits entity
   * @author HuuTC
   */
  async setSnrfileDeposits(
    creditReserveOrder: CreditReserveOrder,
    snrfileDeposits: SnrfileDeposits,
    snrCustomerMstBcps: SnrCustomerMstBcp[],
  ): Promise<void> {
    const branchCode = creditReserveOrder.branchCode;
    const accountCode = creditReserveOrder.accountCode;
    // Get salesCode
    const snrCustomerMstBcp: SnrCustomerMstBcp = snrCustomerMstBcps.find(
      (item) =>
        item.officeCode === branchCode && item.customerCode === accountCode,
    );
    const salesCode = snrCustomerMstBcp?.salescode;
    // Set snrfileDeposits
    snrfileDeposits.serviceType = CUSTOMER_SERVICE_TYPE_ACCEPTED;
    snrfileDeposits.closeHistoryId = creditReserveOrder.id;
    snrfileDeposits.depositAmount = String(
      creditReserveOrder.orderAmount,
    ).padStart(12);
    snrfileDeposits.branchCode = branchCode;
    snrfileDeposits.accountCode = accountCode.padEnd(7);
    snrfileDeposits.salesCode = salesCode || String().padEnd(5);
    snrfileDeposits.disbursementAmount = String(0).padStart(12);
    // only set 1 time base on spec ( It is not necessary to set const )
    snrfileDeposits.hulftNumber = DEPOSIT_SNR.hulftNumber;
    snrfileDeposits.errorcode = null;
    snrfileDeposits.dataType = DEPOSIT_SNR.dataType;
    snrfileDeposits.dataCode = DEPOSIT_SNR.dataCode;
    snrfileDeposits.companyCode = DEPOSIT_SNR.companyCode;
    snrfileDeposits.descriptionCode = DEPOSIT_SNR.descriptionCode;
    snrfileDeposits.description = DEPOSIT_SNR.description.padEnd(25);
    snrfileDeposits.transferType = ' ';
    snrfileDeposits.informationType = DEPOSIT_SNR.informationType;
    snrfileDeposits.sequenceNo = ''; // set sequenceNo = '' then set by id after
    snrfileDeposits.reserve = String().padEnd(30);
    snrfileDeposits.createdAt = new Date();
    snrfileDeposits.updatedAt = new Date();
  }

  /**
   * Recursive get date Holidays of current month
   * @param date date working
   * @returns date number
   * @author HuuTC
   */
  getDateWithoutHolidays(holidays: number[], date: number): number {
    const existed: boolean = holidays.some((item) => item === date);
    if (!existed) {
      return date;
    } else {
      // plus date and re-check
      return this.getDateWithoutHolidays(holidays, date + 1);
    }
  }

  /**
   * get customerOrderClosesId of customerOrderCloses list by tradeDate
   * @param customerOrderCloses CustomerOrderCloses[]
   * @param tradeDate tradeDate
   * @returns customerOrderClosesId
   * @author HuuTC
   */
  getCustomerOrderClosesId(
    customerOrderCloses: CustomerOrderCloses[],
    tradeDate: Date,
  ) {
    const existed = customerOrderCloses.find(
      (item) =>
        this.creditReservesService.formatToYYYYMMDD(item.handlingOn) ===
        this.creditReservesService.formatToYYYYMMDD(tradeDate),
    );
    if (existed) {
      return existed.id;
    }
    return null;
  }

  /**
   * get order list with account = 2 by date
   * @param dateOrder
   * @returns Promise<CreditReserveOrder>
   * @author TuyenBQ
   */
  async getOrdersByDate(intputGetOrderByDate: IntputGetOrderByDate) {
    const { orderDate, getAll } = intputGetOrderByDate;
    const processRuning =
      await this.creditProcessTransactionRepository.getProcessRunning();
    const status = processRuning
      ? ProcessStatus.IN_PROCESS
      : ProcessStatus.HEALTHY;

    const allNull = await this.creditReserveOrdersRepository.checkAllNull(
      orderDate,
    );
    const optionWhere = {
      accountType: In([ACCOUNT_TYPE.DEFAULT, ACCOUNT_TYPE.TSUMITATE_NISA]),
    };

    let step = 0;
    const getCurrentStep =
      await this.creditProcessStepRepository.getCurrentStep(orderDate);

    if (getCurrentStep?.currentStep === RESULT_STEP) {
      const { items, pagination } =
        await this.creditReserveOrdersRepository.getOrdersByDatePaganition(
          intputGetOrderByDate,
          optionWhere,
        );
      return {
        statusStep: getCurrentStep.status,
        step: getCurrentStep.currentStep,
        status,
        items,
        allNull,
        pagination,
      };
    }

    if (getCurrentStep) {
      // if step is waiting => get previous step data
      step =
        getCurrentStep.status === STATUS.DONE
          ? getCurrentStep.currentStep
          : getCurrentStep.currentStep - 1;
      if (
        getCurrentStep.currentStep === LIST_STEPS.authSalesResult &&
        getCurrentStep.status === STATUS.DONE
      ) {
        step = getCurrentStep.currentStep - 1;
      }
    }

    const dataCreditReserveOrders = await this.getOrdersByStep(
      intputGetOrderByDate,
      step,
      getAll,
    );

    return {
      status,
      items: dataCreditReserveOrders.items,
      pagination: dataCreditReserveOrders.pagination,
      step: getCurrentStep?.currentStep || DEFAULT_STEP,
      allNull,
      statusStep: getCurrentStep?.status || STATUS.DONE,
    };
  }

  async getWB4Nisa(branchs): Promise<WB4NisaLimitDataInterface> {
    if (!branchs?.length) {
      return {};
    }
    const WB4NisaList: WB4NisaLimitData[] =
      await this.wb4NisaLimitDataRepository.find({
        where: {
          officeCode: In(branchs),
        },
      });
    const result: WB4NisaLimitDataInterface = WB4NisaList.reduce(
      (obj: WB4NisaLimitDataInterface, cur: WB4NisaLimitData) => {
        // SUBSTRING(snr.accountCode, 1, 6) = od.accountCode AND snr.officeCode = od.branchCode
        const accountCode = String(cur.accountCode).substring(0, 6);
        return {
          ...obj,
          [this.getMatchKeys(accountCode, cur.officeCode)]: cur,
        };
      },
      {},
    );
    return result;
  }

  async calculatorPrice(
    WB4NisaObj: WB4NisaLimitDataInterface,
    accountCode: string,
    branchCode: string,
  ): Promise<TotalPrice> {
    const totalPrice: TotalPrice = {
      isUnknown: false,
    };
    const nisaLimitData: WB4NisaLimitData =
      WB4NisaObj[this.getMatchKeys(accountCode, branchCode)];
    if (
      Number(nisaLimitData?.creditLimit) !== CREDIT_LIMIT ||
      Number(nisaLimitData?.accountingYear) !== THIS_YEAR
    ) {
      totalPrice.isUnknown = true;
    }
    totalPrice.total =
      Number(nisaLimitData?.creditLimit) -
      Number(nisaLimitData?.usageAmount) -
      Number(nisaLimitData?.scheduledFixedAmount) -
      Number(nisaLimitData?.unExecutedAmount);

    return totalPrice;
  }

  /**
   *  Group by list object by field
   * @param list array input
   * @param keyGetter field to group by
   * @returns list grouped
   * @author TuyenBQ
   */
  groupBy(list, keyGetter) {
    const groups = {};
    list.forEach((item) => {
      const group = JSON.stringify(keyGetter(item));
      groups[group] = groups[group] || [];
      groups[group].push(item);
    });
    return Object.keys(groups).map((group) => {
      return groups[group];
    });
  }

  /**
   * check createOrderListToSNR
   * @param input InputCreditOrder
   * @returns Promise<CreditReserveOrder[]>
   * @author TuyenBQ
   */
  async createOrderListToSNR(inputCreditOrder: InputCreditOrder) {
    const timestampCheck = moment()
      .set({ hour: 11, minute: 45, second: 0, millisecond: 0 })
      .valueOf();
    const timestampCurrent = moment().valueOf();

    const orderDate = inputCreditOrder.orderDate;
    await this.handleValidExcuteByDate(
      orderDate,
      // step before
      LIST_STEPS.snrfileFundsId - 1,
    );
    const customerOrderClose =
      await this.customerOrderClosesRepository.findCustomerClosesByServiceTypeHandlingOn(
        CUSTOMER_SERVICE_TYPE_ACCEPTED,
        moment().format('YYYY-MM-DD'),
      );
    if (!customerOrderClose) {
      throw new BaseException(
        CUSTOMER_ORDER_INVALID.CODE,
        CUSTOMER_ORDER_INVALID.MESSAGE,
      );
    }

    const creditReserveOrder =
      await this.creditReserveOrdersRepository.getOrdersByDate(orderDate, {
        accountType: In([ACCOUNT_TYPE.DEFAULT, ACCOUNT_TYPE.TSUMITATE_NISA]),
        invalidCardCheckResult: CHECK_RESULT.OK,
        branchlockResult: CHECK_RESULT.OK,
        ycustomerResult: CHECK_RESULT.OK,
        moneyShortageResult: CHECK_RESULT.OK,
        nisaResult: CHECK_RESULT.OK,
        nameMatchingResult: CHECK_RESULT.OK,
        authSalesResult: CHECK_RESULT.OK,
        notTarget: CHECK_RESULT.OK,
      });

    const snrFileFundsList = new Array<SnrFileFunds>();
    for (const item of creditReserveOrder) {
      const recordSnrFileFund = new SnrFileFunds();
      recordSnrFileFund.serviceType = 30;
      recordSnrFileFund.creditReserveOrdersId = item.id;
      recordSnrFileFund.customerOrderCloseId = customerOrderClose.id;
      recordSnrFileFund.hulftNumber =
        timestampCurrent < timestampCheck
          ? HULFT_NUMBER.BEFORE
          : HULFT_NUMBER.AFTER;
      recordSnrFileFund.errorcode = null;
      recordSnrFileFund.branchCode = item.branchCode;
      recordSnrFileFund.accountCode = item.accountCode.padEnd(7);
      recordSnrFileFund.salesCode = String().padEnd(5);
      recordSnrFileFund.brandCode = item.brandCode;
      recordSnrFileFund.dataCode = DATA_CODE;
      recordSnrFileFund.unitType = UNIT_TYPE;
      recordSnrFileFund.contractedNumberBuy = String().padStart(10);
      recordSnrFileFund.contractedNumberSell = String(
        item.orderAmount,
      ).padStart(10);
      recordSnrFileFund.settlementMethod = METHOD;
      recordSnrFileFund.slipNo = String().padEnd(4);
      recordSnrFileFund.specifiedAccountType =
        item.accountType === ACCOUNT_TYPE.DEFAULT
          ? SPECIFIED_ACCOUNT_TYPE.DEFAULT
          : SPECIFIED_ACCOUNT_TYPE.TSUMITATE_NISA;
      recordSnrFileFund.commissionType =
        item.accountType === ACCOUNT_TYPE.DEFAULT
          ? COMMISSION_TYPE.DEFAULT
          : COMMISSION_TYPE.TSUMITATE_NISA;
      recordSnrFileFund.purchaseClaimType = String().padEnd(1);
      recordSnrFileFund.orderCh = ORDER_CH;
      recordSnrFileFund.checkBalance = String().padEnd(1);
      recordSnrFileFund.nisaUsageAmount = String().padEnd(10);
      recordSnrFileFund.identifyingCode = '';
      recordSnrFileFund.orderReceiveDate = moment(item.orderDate).format(
        'YYYYMMDD',
      );
      recordSnrFileFund.orderReceiveTime =
        timestampCurrent < timestampCheck
          ? RECEIVETIME.BEFORE
          : RECEIVETIME.AFTER;

      snrFileFundsList.push(recordSnrFileFund);
    }

    const queryRunner = await startTransation();
    await handleTransation(queryRunner, async () => {
      // snrFileFundsList.length == creditReserveOrder.length
      await this.handleInsertAndUpdateSnrFundsAndOrders(
        queryRunner,
        snrFileFundsList,
        creditReserveOrder,
      );
    });
    await this.creditProcessStepRepository.updateStep(
      orderDate,
      LIST_STEPS.snrfileFundsId,
    );
  }

  /**
   * Slice list and update snrFileFunds and orders
   * @param queryRunner
   * @param snrFileFundsList
   * @param orders
   * @author HuuTC
   */
  async handleInsertAndUpdateSnrFundsAndOrders(
    queryRunner: QueryRunner,
    snrFileFundsList: SnrFileFunds[],
    orders: CreditReserveOrder[],
  ) {
    const loop = Math.ceil(snrFileFundsList.length / SAVE_CHUNK_NUMBER);
    for (let index = 0; index < loop; index++) {
      const snrFileFundsListSlice = snrFileFundsList.slice(
        SAVE_CHUNK_NUMBER * index,
        SAVE_CHUNK_NUMBER * (index + 1),
      );
      const ordersSlice = orders.slice(
        SAVE_CHUNK_NUMBER * index,
        SAVE_CHUNK_NUMBER * (index + 1),
      );
      await queryRunner.manager.insert(SnrFileFunds, snrFileFundsListSlice);
      await queryRunner.manager
        .createQueryBuilder()
        .update(SnrFileFunds)
        .set({
          identifyingCode: () =>
            this.getMultipleCaseUpdateSQL(
              snrFileFundsListSlice,
              'id',
              (item) => Number(String(item.id).slice(-8)) + ID_DEFAULT,
            ),
          updatedAt: new Date(),
        })
        .where({
          id: In(snrFileFundsListSlice.map((item) => item.id)),
        })
        .execute();
      // update snrfileFundsId by id list snrFileFundsListSlice
      await queryRunner.manager
        .createQueryBuilder()
        .update(CreditReserveOrder)
        .set({
          snrfileFundsId: () =>
            this.getMultipleCaseUpdateSQL(
              ordersSlice,
              'id',
              (_, i) => snrFileFundsListSlice[i].id,
            ),
          updatedAt: new Date(),
        })
        .where({
          id: In(ordersSlice.map((item) => item.id)),
        })
        .execute();
    }
  }

  /**
   * get multiple cases for sql update
   * @param list list get data mapper
   * @param key key for map
   * @param destination callback and set destination value
   * @param typeSet type set destination value
   * @returns sql string
   * ex: CASE WHEN id = 1 then 100 END
   * ex: CASE WHEN id = 1 then '100' WHEN id = 3 then '300' END
   */
  getMultipleCaseUpdateSQL(
    list: any[],
    key: string,
    destination: (item: any, index?: number) => string | number,
    typeSet?: string,
  ) {
    if (!list.length) {
      return '';
    }
    const result = list.reduce((accumulator, item, index) => {
      const whenSQL = `WHEN ${key} = ${item[key]} then`;
      if (typeSet === 'string') {
        accumulator += `${whenSQL} '${destination(item, index)}' `;
      } else {
        accumulator += `${whenSQL} ${destination(item, index)} `;
      }
      return accumulator;
    }, '');
    return `(CASE ${result} END)`;
  }

  /**
   * reset item in step 1
   * @param input
   */
  async resetOrder(input: InputResetOrder, resetAll = false) {
    if (!resetAll) {
      await this.handleValidExcuteByDate(
        input.orderDate,
        // step before
        LIST_STEPS.nameMatchingResult,
      );
      const queryRunner = await startTransation();
      await handleTransation(queryRunner, async () => {
        await queryRunner.manager
          .createQueryBuilder()
          .update(CreditReserveOrder)
          .set({
            notTarget: CHECK_RESULT.OK,
            invalidCardCheckResult: DEFAULT_VALUE,
            ycustomerResult: DEFAULT_VALUE,
            branchlockResult: DEFAULT_VALUE,
            moneyShortageResult: DEFAULT_VALUE,
            nisaResult: DEFAULT_VALUE,
            nameMatchingResult: DEFAULT_VALUE,
            updatedAt: new Date(),
          })
          .where({
            orderDate: input.orderDate,
          })
          .execute();
        await this.creditProcessStepRepository.updateStep(
          input.orderDate,
          DEFAULT_STEP,
          STATUS.DONE,
          queryRunner,
        );
      });
    } else {
      const queryRunner = await startTransation();
      await handleTransation(queryRunner, async () => {
        await this.removeSnrFileFundsId(queryRunner, input.orderDate);
        await this.removeSnrFileDepositsId(queryRunner, input.orderDate);
        await queryRunner.manager
          .createQueryBuilder()
          .update(CreditReserveOrder)
          .set({
            notTarget: CHECK_RESULT.OK,
            invalidCardCheckResult: DEFAULT_VALUE,
            ycustomerResult: DEFAULT_VALUE,
            branchlockResult: DEFAULT_VALUE,
            moneyShortageResult: DEFAULT_VALUE,
            nisaResult: DEFAULT_VALUE,
            nameMatchingResult: DEFAULT_VALUE,
            authSalesResult: DEFAULT_VALUE,
            snrfileFundsId: DEFAULT_VALUE,
            snrfileDepositsId: DEFAULT_VALUE,
            updatedAt: new Date(),
          })
          .where({
            orderDate: input.orderDate,
          })
          .execute();
        await this.creditProcessStepRepository.updateStep(
          input.orderDate,
          DEFAULT_STEP,
          STATUS.DONE,
          queryRunner,
        );
      });
    }
  }

  /**
   * remove all SnrFileFunds and SnrFileDeposits of orders by date
   * @param input
   */
  async removeSnrRecord(input: InputResetOrder) {
    const queryRunner = await startTransation();
    await handleTransation(queryRunner, async () => {
      await this.removeSnrFileFundsId(queryRunner, input.orderDate);
      await this.removeSnrFileDepositsId(queryRunner, input.orderDate);
    });
  }

  /**
   * remove snr file funds ids
   * @param queryRunner
   * @param snrfileFundsId
   */
  async removeSnrFileFundsId(queryRunner, orderDate: Date) {
    await queryRunner.manager
      .createQueryBuilder()
      .update(SnrFileFunds)
      .set({ hulftNumber: SNR_DELETED_VALUE, updatedAt: new Date() })
      .where(
        'id IN (SELECT snrfile_funds_id FROM credit_reserve_orders WHERE order_date = :date AND snrfile_funds_id IS NOT NULL)',
        { date: orderDate },
      )
      .execute();
  }

  /**
   * remove snr file deposits ids
   * @param queryRunner
   * @param removeSnrFileDepositsIds
   */
  async removeSnrFileDepositsId(queryRunner, orderDate: Date) {
    await queryRunner.manager
      .createQueryBuilder()
      .update(SnrfileDeposits)
      .set({ hulftNumber: SNR_DELETED_VALUE, updatedAt: new Date() })
      .where(
        'id IN (SELECT snrfile_deposits_id FROM credit_reserve_orders WHERE order_date = :date AND snrfile_deposits_id IS NOT NULL)',
        { date: orderDate },
      )
      .execute();
  }

  /**
   * get list order by date and step
   * @param orderDate
   * @param currentStep
   * @returns Promise<CreditReserveOrder[]>
   */
  async getOrdersByStep(
    intputGetOrderByDate: IntputGetOrderByDate,
    currentStep: number,
    getAll?: boolean,
  ) {
    const getSteps = getKeySteps(currentStep);
    const condition = {
      notTarget: CHECK_RESULT.OK,
    };
    const notNullColumns = getKeySteps(4, true);
    if (currentStep > 1) {
      for (const step of getSteps) {
        condition[step] = notNullColumns.includes(step)
          ? Not(IsNull())
          : CHECK_RESULT.OK;
      }
    }
    if (currentStep === 0) {
      delete condition.notTarget;
    }

    if (getAll) {
      delete condition.notTarget;
      return {
        items: await this.creditReserveOrdersRepository.getOrdersByDate(
          intputGetOrderByDate?.orderDate,
          condition,
        ),
        pagination: null,
      };
    }
    return await this.creditReserveOrdersRepository.getOrdersByDatePaganition(
      intputGetOrderByDate,
      condition,
    );
  }

  async handleValidExcuteByDate(
    orderDate: Date,
    stepAccept: number,
  ): Promise<void> {
    const currStep = await this.creditProcessStepRepository.getCurrentStep(
      orderDate,
    );

    if (
      currStep?.currentStep !== stepAccept &&
      currStep?.status === STATUS.DONE
    ) {
      throw new BaseException(
        PROCESS_EXECUTION_DONE.PROCESS_EXECUTION_DONE.code,
        PROCESS_EXECUTION_DONE.PROCESS_EXECUTION_DONE.message,
      );
    }
  }

  /**
   * excute set nisa by order date
   * @param orderDate
   */
  async executeSetNisaResult(orderDate: Date) {
    // Step 1: execute case OK first
    await this.creditReserveOrdersRepository.excuteNisaCaseOK(orderDate);
    // Step 2: get reserveOrders has nisa_result has case not yet checked
    const reserveOrders =
      await this.creditReserveOrdersRepository.getOrderByDateForNisaCheck(
        orderDate,
      );
    // Step 3: Group by accountCode, branchCode
    const reserveOrdersGroupBy = this.groupBy(
      reserveOrders,
      (item: CreditReserveOrder) => [item.accountCode, item.branchCode],
    );
    // Step 4: Handle check nisa then get id list
    const results: {
      OK: number[];
      NG: number[];
      UKN: number[];
    } = await this.processNisaWaku(reserveOrdersGroupBy);
    // Step 5: Update nisaResult
    if (results.OK?.length) {
      await this.updateChunksNisa(results.OK, orderDate, CHECK_RESULT.OK);
    }
    if (results.NG?.length) {
      await this.updateChunksNisa(results.NG, orderDate, CHECK_RESULT.NG);
    }
    if (results.UKN?.length) {
      await this.updateChunksNisa(results.UKN, orderDate, CHECK_RESULT.UKN);
    }
  }

  /**
   * update chunk nisa ( handle case over 2100 paramerters )
   * @param ids list id order
   * @param orderDate
   * @author HuuTC
   */
  async updateChunksNisa(ids: number[], orderDate: Date, nisaResult: string) {
    if (!ids.length) {
      return;
    }
    const loop = Math.ceil(ids.length / SAVE_CHUNK_NUMBER_BY_IDS);
    for (let index = 0; index < loop; index++) {
      await this.creditReserveOrdersRepository.update(
        {
          id: In(
            ids.slice(
              SAVE_CHUNK_NUMBER_BY_IDS * index,
              SAVE_CHUNK_NUMBER_BY_IDS * (index + 1),
            ),
          ),
          orderDate,
        },
        { nisaResult },
      );
    }
  }

  /**
   * handle check results invalidCard, invalidCardCheck, ycustomer, branchlock, moneyShortage, nisa, kanaName
   * @param input InputCheckResults
   * @returns
   * @author HuuTC
   */
  async handleCheckResults(input: InputCheckResults) {
    const { orderDate, rejects } = input;
    // prevent processing executed
    await this.handleValidExcuteByDate(
      orderDate,
      // step before
      LIST_STEPS.invalidCardCheckResult - 1,
    );
    try {
      await this.creditReserveOrdersRepository.executeSetNotTarget(
        orderDate,
        rejects,
      );
      await this.creditReserveOrdersRepository.executeSetCardResults(orderDate);
      await this.creditReserveOrdersRepository.executeSetYcustomerResult(
        orderDate,
      );
      await this.creditReserveOrdersRepository.executeSetBranchlockResult(
        orderDate,
      );
      await this.creditReserveOrdersRepository.executeSetMoneyResult(orderDate);
      await this.executeSetNisaResult(orderDate);
      await this.executeSetKana(orderDate);
      // update step
      await this.creditProcessStepRepository.updateStep(
        orderDate,
        LIST_STEPS.invalidCardCheckResult,
      );
    } catch (error) {
      // rollback
      await this.creditReserveOrdersRepository.update(
        {
          orderDate,
        },
        {
          invalidCardCheckResult: null,
          ycustomerResult: null,
          branchlockResult: null,
          moneyShortageResult: null,
          nisaResult: null,
          nameMatchingResult: null,
        },
      );
      throw new BaseException(
        CHECK_RUN_FAIL.CODE,
        error?.message || CHECK_RUN_FAIL.MESSAGE,
      );
    }
  }

  /**
   * get key object groupby
   * @param args
   * @returns key for groupby
   */
  getMatchKeys(...args: string[] | number[]): string {
    let result = '';
    const centerKey = '_center_';
    let i = 0;
    // ensure object key correctly
    for (const arg of args) {
      if (i === 0) {
        result += String(arg).trim();
      }
      result += centerKey + String(arg).trim();
      i++;
    }
    return result;
  }

  /**
   * process check nisawaku
   * @param reserveOrders
   * @returns CheckId
   * @author HuuTC
   */
  async processNisaWaku(
    reserveOrders,
  ): Promise<{ OK: number[]; NG: number[]; UKN: number[] }> {
    const results: { OK: number[]; NG: number[]; UKN: number[] } = {
      OK: [],
      NG: [],
      UKN: [],
    };
    const branchs = [
      ...new Set(reserveOrders.map((item) => item[0].branchCode)),
    ];
    const WB4NisaObj: WB4NisaLimitDataInterface = await this.getWB4Nisa(
      branchs,
    );
    for (const key in reserveOrders) {
      if (reserveOrders.hasOwnProperty(key)) {
        const currentUserGroup = reserveOrders[key];
        const price = await this.calculatorPrice(
          WB4NisaObj,
          currentUserGroup[0].accountCode,
          currentUserGroup[0].branchCode,
        );

        for (const branchIndex in currentUserGroup) {
          if (currentUserGroup.hasOwnProperty(branchIndex)) {
            const currentPrice = currentUserGroup[branchIndex];
            if (price.isUnknown) {
              results.UKN.push(currentPrice.id);
            } else if (price.total - currentPrice.orderAmount >= 0) {
              price.total = price.total - currentPrice.orderAmount;
              results.OK.push(currentPrice.id);
            } else {
              results.NG.push(currentPrice.id);
            }
          }
        }
      }
    }
    return results;
  }

  /**
   * get sql condition by accountCode and branchCode list
   * @param listBranchAndAccount
   * @returns SQL string
   * @author HuuTC
   */
  getMutipleConditionSql(
    listBranchAndAccount: { accountCode: string; branchCode: string }[],
  ) {
    if (!listBranchAndAccount?.length) {
      return '';
    } else if (listBranchAndAccount?.length === 1) {
      const item = listBranchAndAccount[0];
      return `AND (account_code = '${item.accountCode}' AND branch_code = '${item.branchCode}')`;
    }
    // Example:
    // AND ((account_code = '100022' AND branch_code = '322') OR (account_code = '100023' AND branch_code = '323'))
    const result = listBranchAndAccount.reduce((accumulator, item, index) => {
      if (index === 0) {
        accumulator += ` AND (`;
      } else {
        accumulator += ` OR `;
      }
      accumulator += `(account_code = '${item.accountCode}' AND branch_code = '${item.branchCode}')`;
      if (index === listBranchAndAccount.length - 1) {
        accumulator += `)`;
      }
      return accumulator;
    }, '');
    return result;
  }

  /**
   * execute Set Kana by call API
   * example SQL: https://redmine.vitalify.asia/issues/21484
   * @param orderDate
   * @author HuuTC
   */
  async executeSetKana(orderDate: Date) {
    // call api first
    // then get list OK, NG, ERR
    const result = await this.getInfoCheckKana(orderDate);
    const update = 'UPDATE credit_reserve_orders ';
    const where = ` WHERE order_date = @0 AND account_type IN(${ACCOUNT_TYPE.DEFAULT}, ${ACCOUNT_TYPE.TSUMITATE_NISA}) AND
      invalid_card_check_result = ${CHECK_RESULT.OK}
      AND ycustomer_result = ${CHECK_RESULT.OK} AND branchlock_result = ${CHECK_RESULT.OK}
      AND money_shortage_result = ${CHECK_RESULT.OK} AND not_target = ${CHECK_RESULT.OK}
      AND nisa_result =  ${CHECK_RESULT.OK} `;

    // update result by list OK, NG, ERR
    if (result?.OK.length) {
      const set = 'SET name_matching_result = ' + CHECK_RESULT.OK;
      const query =
        update + set + where + this.getMutipleConditionSql(result.OK);
      await this.creditReserveOrdersRepository.query(query, [orderDate]);
    }
    if (result?.NG.length) {
      const set = 'SET name_matching_result = ' + CHECK_RESULT.NG;
      const query =
        update + set + where + this.getMutipleConditionSql(result.NG);
      await this.creditReserveOrdersRepository.query(query, [orderDate]);
    }
    if (result?.ERR.length) {
      const set = 'SET name_matching_result = ' + CHECK_RESULT.ERR;
      const query =
        update + set + where + this.getMutipleConditionSql(result.ERR);
      await this.creditReserveOrdersRepository.query(query, [orderDate]);
    }
    if (!result?.ERR.length && !result?.NG.length && !result?.OK.length) {
      await this.creditReserveOrdersRepository.update(
        {
          invalidCardCheckResult: CHECK_RESULT.OK,
          branchlockResult: CHECK_RESULT.OK,
          ycustomerResult: CHECK_RESULT.OK,
          moneyShortageResult: CHECK_RESULT.OK,
          orderDate,
          nisaResult: CHECK_RESULT.OK,
          accountType: In([ACCOUNT_TYPE.DEFAULT, ACCOUNT_TYPE.TSUMITATE_NISA]),
        },
        { nameMatchingResult: CHECK_RESULT.UKN },
      );
    }
  }

  /**
   * Call API get saison access token
   * @param refreshToken
   * @author HuuTC
   */
  async getTokenByRefreshToken(refreshToken: string) {
    return await callApi(process.env.URL_GET_SAISON_ACCESS, {
      grant_type: REFRESH_TOKEN,
      refresh_token: refreshToken,
      client_secret: process.env.CLIENT_KEY,
    });
  }

  /**
   * Call API get user information
   * @param accessToken
   * @returns
   * @author HuuTC
   */
  async getUserInfoByAccessToken(accessToken: string) {
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = createNonce();
    const urlSaison = process.env.URL_GET_SAISON_DATA;
    const mac = createMac(
      timestamp.toString(),
      nonce,
      'POST',
      process.env.SAISON_URI,
      process.env.SAISON_DOMAIN,
      process.env.SAISON_PORT,
    );
    return await callApiWithMAC(
      urlSaison,
      {
        data_flg: DATA_FLAG,
        info_key: INFO_KEY,
      },
      {
        accessToken,
        timestamp,
        nonce,
        mac,
      },
    );
  }

  /**
   * get InfoCheckKana and check kanaNameResult
   * @param accountAndBranchList
   * @returns KanaInfoInterface
   * @author HuuTC
   */
  async getInfoCheckKana(orderDate: Date) {
    const result = {
      OK: [],
      NG: [],
      ERR: [],
    };

    const items =
      await this.creditReserveOrdersRepository.getRefreshTokenByAccountAndBranch(
        orderDate,
      );
    if (!items.length) {
      return result;
    }
    const accountMstBcps = await this.accountMstBcpRepository.find({
      where: items.map((item) => ({
        accountCode: item.accountCode,
        officeCode: item.branchCode,
      })),
    });
    const accountMstBcpMapper = accountMstBcps.reduce(
      (obj: { [key: string]: AccountMstBcp }, cur: AccountMstBcp) => {
        return {
          ...obj,
          [this.getMatchKeys(cur.accountCode, cur.officeCode)]: cur,
        };
      },
      {},
    );
    const accessTokens = [];
    const kanaRespones = [];
    for (const item of items) {
      const { accountCode, branchCode } = item;
      const objResult = { accountCode, branchCode };
      try {
        const refreshToken = item?.refreshToken ? item.refreshToken.trim() : '';
        if (!refreshToken) {
          continue;
        }
        const responseSaisonAccess = await this.getTokenByRefreshToken(
          refreshToken,
        );
        const { access_token, refresh_token } = responseSaisonAccess.data;

        // log responseSaisonAccess ( can trace case unknow err )
        console.log(responseSaisonAccess.data);
        // 2. Update access token
        if (!access_token || !refresh_token) {
          continue;
        }
        const accessToken = new AccessTokenInfo();
        accessToken.id = item.tokenId;
        accessToken.refreshToken = refresh_token;
        accessTokens.push(accessToken);
        // 3. Get user information
        const responseSaisonInfo = await this.getUserInfoByAccessToken(
          access_token,
        );
        const { kana_name, account_name } = responseSaisonInfo?.data?.info_data;
        const accountNameDecrypt = decryptAES(account_name);
        const kanaNameDecrypt = decryptAES(kana_name);
        // tslint:disable-next-line
        if (!accountNameDecrypt || !kanaNameDecrypt) {
          continue;
        }
        // get customerNameKana
        const accountMstBcp =
          accountMstBcpMapper[this.getMatchKeys(accountCode, branchCode)];
        const customerNameKana = accountMstBcp?.customerNameKana || '';

        // save CreditKanaRespone
        const kanaRespone = new CreditKana();
        kanaRespone.creditReserveOrderId = item.orderId;
        kanaRespone.kanaName = kanaNameDecrypt;
        kanaRespone.accountName = accountNameDecrypt;
        kanaRespone.customerNameKana = customerNameKana;
        kanaRespone.branchCode = branchCode;
        kanaRespone.accountCode = accountCode;
        kanaRespones.push(kanaRespone);

        const customerName = this.cleanName(accountNameDecrypt);
        const kanaName = this.cleanName(kanaNameDecrypt);
        // Check kana name WB4 vs kana name saison
        const kanaNameWB4 = this.cleanName(customerNameKana);
        // Check customer name saison vs kana name saison
        if (customerName !== kanaName || kanaNameWB4 !== kanaName) {
          result.NG.push(objResult);
          continue;
        }
        result.OK.push(objResult);
      } catch (error) {
        console.error(error);
        result.ERR.push(objResult);
      }
    }
    // { id, refreshToken }[] => 2 params in lists
    await this.accessTokenRepository.save(accessTokens, {
      reload: false,
      chunk: SAVE_CHUNK_NUMBER_BY_IDS / 2,
    });

    for (
      let index = 0;
      index < Math.ceil(kanaRespones.length / SAVE_CHUNK_NUMBER_KANA);
      index++
    ) {
      await CreditKana.insert(
        kanaRespones.slice(
          SAVE_CHUNK_NUMBER_KANA * index,
          SAVE_CHUNK_NUMBER_KANA * (index + 1),
        ),
      );
    }
    return result;
  }

  /**
   * TODO: insert fake data
   * @param input
   */
  async insertData(input: InputInsertData) {
    setOrderDate(input.orderDate);
    for (let index = 0; index < input.amount / 60; index++) {
      await createCreditReservesOrders();
    }
    if (input.setupData) {
      await createFundMsts();
      await createSnrGlobalHolidays();
      await createCreditCardInfo();
      await createsnrCustomers();
      await createSnrOrderLocks();
      await createSnrCustomerAccountBalanceBcps();
      await createWB4NisaLimitDatas();
      await createWb4AccountMsts();
    }
  }

  /*
   * Remove space and convert hyphens in string name
   * @param name
   * @returns string which remove space and convert all hyphens
   * @author BaoPG
   */
  cleanName(name: string): string {
    // Remove whitespace
    name = name.replaceAll(/\s+/g, '');
    // Convert hypen to one kind
    name = name.replaceAll(
      /[\u{30FC}\u{2010}-\u{2015}\u{2212}\u{FF70}-]/gu,
      '-',
    );
    return name;
  }

  /**
   * Change all order of a date to new date
   * @param input
   */
  async changeOrderDate(input: InputChangeOrderDate) {
    const queryRunner = await startTransation();
    await handleTransation(queryRunner, async () => {
      await queryRunner.manager
        .createQueryBuilder()
        .update(CreditReserveOrder)
        .set({ orderDate: input.newOrderDate, updatedAt: new Date() })
        .where({ orderDate: input.orderDate, snrfileDepositsId: IsNull() })
        .execute();
      let newProcessStep = await queryRunner.manager.findOne(
        CreditProcessStep,
        {
          where: { orderDate: input.newOrderDate },
        },
      );
      if (!newProcessStep) {
        const oldProcessStep = await queryRunner.manager.findOne(
          CreditProcessStep,
          {
            where: { orderDate: input.orderDate },
          },
        );
        newProcessStep = new CreditProcessStep();
        newProcessStep.currentStep =
          oldProcessStep?.currentStep || DEFAULT_STEP;
        newProcessStep.orderDate = input.newOrderDate;
        await queryRunner.manager.save(newProcessStep);
      }
    });
  }

  /**
   * Update step
   * @param input
   */
  async updateStep(input: InputUpateStep) {
    const { step, orderDate } = input;
    const result = await this.creditProcessStepRepository.updateStep(
      orderDate,
      step,
      STATUS.WAITING,
    );
    return result;
  }

  /**
   * Update step
   * @param input
   */
  async updateResultStep(input: InputCheckResult) {
    const { orderDate } = input;
    const checkDone = await this.creditProcessStepRepository.findOne({
      where: {
        orderDate,
        status: STATUS.DONE,
        currentStep: 5,
      },
    });
    let result: CreditProcessStep = null;
    if (checkDone) {
      result = await this.creditProcessStepRepository.updateStep(
        orderDate,
        RESULT_STEP,
        STATUS.DONE,
      );
    }
    return result;
  }

  /**
   * TODO: insert fake data
   * @param input
   */
  async insertReserver(input: InputInsertDataReserver) {
    const queryRunner = await startTransation();
    await handleTransation(queryRunner, async () => {
      for (let index = 0; index < input.amount / 78; index++) {
        await queryRunner.manager.query(
          `INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'301', N'100001', N'5613801', N'10000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'301', N'100001', N'5613802', N'2000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'301', N'100001', N'5613803', N'2000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'302', N'100002', N'5613802', N'1000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'302', N'100002', N'5613803', N'20000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'302', N'100002', N'5613804', N'10000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'303', N'100003', N'5613806', N'1000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'303', N'100003', N'5613805', N'8000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'303', N'100003', N'5613807', N'9000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'304', N'100004', N'5613802', N'1000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'305', N'100005', N'5613803', N'10000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'305', N'100005', N'5613806', N'70000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'305', N'100005', N'5613802', N'20000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'305', N'100005', N'5613805', N'10000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'305', N'100005', N'5613804', N'20000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'305', N'100005', N'5613811', N'30000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'306', N'100006', N'5613805', N'90000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'306', N'100006', N'5613806', N'120000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'306', N'100006', N'5613802', N'110000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'307', N'100007', N'5613807', N'100000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'307', N'100007', N'5613803', N'100000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'307', N'100007', N'5613804', N'200000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'307', N'100007', N'5613808', N'50000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'307', N'100007', N'5613811', N'100000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'308', N'100008', N'5613808', N'10000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'308', N'100008', N'5613809', N'70000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'308', N'100008', N'5613801', N'90000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'309', N'100009', N'5613801', N'120000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'310', N'100010', N'5613809', N'110000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'310', N'100010', N'5613801', N'70000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'311', N'100011', N'5613801', N'90000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'311', N'100011', N'5613807', N'120000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'311', N'100011', N'5613802', N'100000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'312', N'100012', N'5613802', N'10000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'313', N'100013', N'5613801', N'60000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'313', N'100013', N'5613803', N'50000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'313', N'100013', N'5613811', N'90000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'313', N'100013', N'5613808', N'20000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'314', N'100014', N'5613801', N'100000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'314', N'100014', N'5613803', N'20000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'314', N'100014', N'5613811', N'20000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'314', N'100014', N'5613808', N'200000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'315', N'100015', N'5613801', N'60000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'315', N'100015', N'5613803', N'50000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'315', N'100015', N'5613811', N'90000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'315', N'100015', N'5613808', N'20000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'316', N'100016', N'5613801', N'100000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'316', N'100016', N'5613803', N'20000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'316', N'100016', N'5613811', N'20000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'316', N'100016', N'5613808', N'200000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'317', N'100017', N'5613801', N'10000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'317', N'100017', N'5613803', N'20000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'317', N'100017', N'5613811', N'100000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'317', N'100017', N'5613808', N'20000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'318', N'100018', N'5613801', N'60000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'318', N'100018', N'5613803', N'90000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'318', N'100018', N'5613811', N'200000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'318', N'100018', N'5613808', N'200000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'319', N'100019', N'5613801', N'50000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'319', N'100019', N'5613803', N'100000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'319', N'100019', N'5613811', N'200000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'319', N'100019', N'5613808', N'20000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'320', N'100020', N'5613801', N'60000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'320', N'100020', N'5613803', N'90000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'320', N'100020', N'5613811', N'5000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'320', N'100020', N'5613808', N'200000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'321', N'100021', N'5613803', N'100000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'321', N'100021', N'5613811', N'200000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'321', N'100021', N'5613808', N'20000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'321', N'100021', N'5613801', N'60000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'322', N'100022', N'5613801', N'100000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'322', N'100022', N'5613803', N'100000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'322', N'100022', N'5613811', N'100000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'322', N'100022', N'5613808', N'100000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'323', N'100023', N'5613801', N'60000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'323', N'100023', N'5613803', N'10000', N'2', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'323', N'100023', N'5613811', N'10000', N'0', N'');
  INSERT INTO [dbo].[credit_reserves] ([branch_code], [account_code], [brand_code], [order_amount], [account_type], [created_at]) VALUES (N'323', N'100023', N'5613808', N'200000', N'2', N'');`,
        );
      }
    });
  }
}
