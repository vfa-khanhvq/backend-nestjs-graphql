import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import {
  BRAND_CODE_INDEX_CHANGE,
  BRAND_CODE_INDEX_CHANGE_TO_VALUE,
  ORDER_DATE_START,
  SAVE_CHUNK_NUMBER,
  WEEKEN_DAY,
} from '../../../configs/constants/common';
import { CreditReserveOrdersRepository } from '../credit-reserve-orders/credit-reserve-orders.repository';
import { CreditReserveOrder } from '../credit-reserve-orders/entities/credit-reserve-order.entity';
import { SnrGlobalHolidayCalendarBcp } from '../snr-global-holiday-calendar-bcp/entities/snr-global-holiday-calendar-bcp.entity';
import { SnrGlobalHolidayCalendarBcpRepository } from '../snr-global-holiday-calendar-bcp/snr-global-holiday-calendar-bcp.repository';
import { CreditReservesRepository } from './credit-reserves.repository';
import { CreditReserves } from './entities/credit-reserve.entity';
import { CREATE_ORDERS } from '../../../configs/constants/error-code/base';
import { CHECK_RESULT } from '../../../configs/constants/check-result';
import { DATE_ACCEPTED } from '../../../configs/constants/constant';

@Injectable()
export class CreditReservesService {
  constructor(
    private creditReservesRepository: CreditReservesRepository,
    private creditReserveOrdersRepository: CreditReserveOrdersRepository,
    private snrGlobalHolidayCalendarBcpRepository: SnrGlobalHolidayCalendarBcpRepository,
  ) {}
  /**
   * Run cron job create orders at EVERY_1ST_DAY_OF_MONTH_AT_1S_MIDNIGHT
   * @returns
   * @author HuuTC
   */
  async handleCron(): Promise<void> {
    try {
      const creditReserves: CreditReserves[] =
        await this.creditReservesRepository.getLastMonthCreditReserves();
      if (creditReserves.length === 0) {
        return;
      }

      const brandCodes: string[] = [
        ...new Set(
          creditReserves.map((item) => {
            return this.getBrandCode(item.brandCode);
          }),
        ),
      ];
      const snrGlobalHolidays: SnrGlobalHolidayCalendarBcp[] =
        await this.snrGlobalHolidayCalendarBcpRepository.getHolidayBySecurityCodes(
          brandCodes,
        );
      const creditReserveOrders: CreditReserveOrder[] = [];
      creditReserves.forEach((item) => {
        // handle check and set order date
        // let orderDay = this.getDateWithoutWeekend(ORDER_DATE_START);
        const orderDay = this.getDateWithoutSNRHolidays(
          snrGlobalHolidays,
          this.getBrandCode(item.brandCode),
          ORDER_DATE_START,
        );
        // only get item got orderDay in range 5 -> 10
        if (orderDay < DATE_ACCEPTED.START && orderDay > DATE_ACCEPTED.END) {
          return;
        }
        const orderDate: Date = this.getDateByDay(orderDay);
        const creditReserveOrder: CreditReserveOrder = new CreditReserveOrder();
        this.setCreditReservesOrder(creditReserveOrder, item);
        creditReserveOrder.orderDate = orderDate;
        creditReserveOrders.push(creditReserveOrder);
      });
      await this.creditReserveOrdersRepository.save(creditReserveOrders, {
        reload: false,
        chunk: SAVE_CHUNK_NUMBER,
      });
    } catch (error) {
      console.error(error.message || CREATE_ORDERS.BATCH_ERROR_MSG);
    }
  }

  /**
   * Change Request: https://redmine.vitalify.asia/issues/22785
   * @param brandCode
   * @returns brandCode
   * @author HuuTC
   */
  getBrandCode(brandCode: string) {
    if (!brandCode) {
      return '';
    }
    const _brandCode = brandCode.split('');
    _brandCode[BRAND_CODE_INDEX_CHANGE - 1] = BRAND_CODE_INDEX_CHANGE_TO_VALUE;
    return _brandCode.join('');
  }

  /**
   * Get date want to be set by day
   * @param day: number
   * @returns date utc
   * @author HuuTC
   */
  getDateByDay(day: number): Date {
    const date = new Date();
    date.setDate(day);
    date.setHours(0, 0, 0);
    return moment(date).toDate();
  }

  /**
   * Recursive get date Without SNR Holidays of current month
   * @param date date working
   * @returns date number
   * @author HuuTC
   */
  getDateWithoutSNRHolidays(
    snrGlobalHolidays: SnrGlobalHolidayCalendarBcp[],
    brandCode: string,
    date: number,
  ): number {
    const dateFormatToYYYYMMDD: string = this.formatToYYYYMMDD(
      this.getDateByDay(date),
    );
    const existed: boolean = snrGlobalHolidays.some(
      (item) =>
        item.securityCode?.trim() === brandCode?.trim() &&
        dateFormatToYYYYMMDD ===
          this.formatToYYYYMMDD(moment(item.holiday, 'YYYYMMDD').toDate()),
    );
    if (!existed) {
      return date;
    } else {
      // plus date and re-check
      return this.getDateWithoutSNRHolidays(
        snrGlobalHolidays,
        brandCode,
        date + 1,
      );
    }
  }

  /**
   * Recursive get date Without weekend of current month
   * @param date date working
   * @returns date
   * @author HuuTC
   */
  getDateWithoutWeekend(date: number): number {
    const _date = this.getDateByDay(date);
    // get day of week
    const dayOfWeek = _date.getDay();
    if (!~WEEKEN_DAY.indexOf(dayOfWeek)) {
      return date;
    } else {
      // plus date and re-check
      return this.getDateWithoutWeekend(date + 1);
    }
  }

  /**
   * Mapping creditReserveOrder by creditReserve
   * @param creditReserveOrder CreditReserveOrder entity
   * @param creditReserve creditReserve entity
   * @author HuuTC
   */
  setCreditReservesOrder(
    creditReserveOrder: CreditReserveOrder,
    creditReserve: CreditReserves,
  ): void {
    creditReserveOrder.creditReservesId = creditReserve.id;
    creditReserveOrder.branchCode = creditReserve.branchCode;
    creditReserveOrder.accountCode = creditReserve.accountCode;
    creditReserveOrder.brandCode = creditReserve.brandCode;
    creditReserveOrder.orderAmount = creditReserve.orderAmount;
    creditReserveOrder.accountType = creditReserve.accountType;
    // default notTarget = CHECK_RESULT.OK
    creditReserveOrder.notTarget = CHECK_RESULT.OK;
  }

  /**
   * get Date format YYYY-MM-DD by day
   * @param date Date
   * @returns string YYYY-MM-DD
   * @author HuuTC
   */
  formatToYYYYMMDD(date: Date): string {
    return moment(date).format('YYYY-MM-DD');
  }
}
