import { Injectable } from '@nestjs/common';
import {
  DataSource,
  FindOptionsOrder,
  FindOptionsSelect,
  FindOptionsWhere,
  In,
  IsNull,
  Not,
  QueryRunner,
} from 'typeorm';
import { DataAndPagination } from '../../../vendors/schema/base.schema';
import { BaseRepository } from '../../../vendors/base/base.repository';
import { CreditReserveOrder } from './entities/credit-reserve-order.entity';
import * as moment from 'moment';
import {
  IntputGetOrderByDate,
  OrderDetail,
} from '../../graphql/graphql.schema';
import { FundMst } from '../fund_mst/entities/fund_mst.entity';
import {
  CHECK_RESULT,
  CREDIT_LIMIT,
  THIS_YEAR,
} from '../../../configs/constants/check-result';
import { ACCOUNT_TYPE } from '../../../configs/constants/gmo';
import { SnrCustomerAccountBalanceBcp } from '../snr-customer-account-balance-bcp/entities/snr-customer-account-balance-bcp.entity';
import { SnrOrderLockInfoBcp } from '../snr_order_lock_info_bcp/entities/snr_order_lock_info_bcp.entity';
import { SnrCustomerMstBcp } from '../snr-customer-mst-bcp/entities/snr-customer-mst-bcp.entity';
import { DATE_ACCEPTED } from '../../../configs/constants/constant';
import { TIL_EXECUTE_DATE } from '../../../configs/constants/tilExeDate';
import { AccessTokenInfo } from '../auth/entities/access-token.entity';
import { WB4NisaLimitData } from '../wb4-nina-limitdata/entities/wb4-nisa-limitdata.entity';
import { SAVE_CHUNK_NUMBER_BY_IDS } from '../../../configs/constants/common';
import { CreditCardInfo } from '../inactive-card/entities/credit_card_info.entity';

interface YearAndMonth {
  orderYear: number;
  orderMonth: number;
}
interface MoneyShortage {
  id: string | number;
  tilExecutionDays: string | number;
  accountBalanceCurrentDate: string | number;
  accountBalanceNextDate: string | number;
  accountBalanceExecution: string | number;
}
@Injectable()
export class CreditReserveOrdersRepository extends BaseRepository<CreditReserveOrder> {
  constructor(private dataSource: DataSource) {
    super(CreditReserveOrder, dataSource.manager);
  }

  async getOrderByDateForNisaCheck(orderDate: Date) {
    // creditReserverOrder.brandCode * 1 as brandCode <=> CAST(creditReserverOrder.brandCode as INT) as brandCode
    // purpose of string to number conversion for order by
    return await this.createQueryBuilder('creditReserverOrder')
      .select([
        'creditReserverOrder.id as id',
        'creditReserverOrder.accountCode as accountCode',
        'creditReserverOrder.branchCode as branchCode',
        'creditReserverOrder.brandCode * 1 as brandCode',
        'creditReserverOrder.orderAmount * 1 as orderAmount',
      ])
      .where('creditReserverOrder.accountType = 2')
      .andWhere({
        invalidCardCheckResult: CHECK_RESULT.OK,
        branchlockResult: CHECK_RESULT.OK,
        ycustomerResult: CHECK_RESULT.OK,
        moneyShortageResult: CHECK_RESULT.OK,
        orderDate,
        nisaResult: IsNull(),
      })
      .orderBy('orderAmount', 'DESC')
      .addOrderBy('brandCode', 'ASC')
      .execute();
  }

  async groupByOrderPrice(orderDate: Date) {
    return await this.find({
      select: {
        creditReservesId: true,
        accountCode: true,
        orderDate: true,
        nisaResult: true,
        nameMatchingResult: true,
        authSalesResult: true,
        snrfileFundsId: true,
        snrfileDepositsId: true,
      },
      where: {
        accountType: ACCOUNT_TYPE.TSUMITATE_NISA,
        orderDate,
      },
    });
  }

  async updateNisaResult(nisaResult: string, ids: number[]) {
    return await this.createQueryBuilder()
      .update()
      .set({ nisaResult, updatedAt: new Date() })
      .where({ id: In(ids) })
      .execute();
  }

  /**
   * get orders list and pagination OrderBy year and month of order_date.
   * @param page
   * @param pageSize
   * @returns Promise<DataAndPagination<YearAndMonth>>
   * @author HuuTC
   */
  async getOrderList(
    page: number,
    pageSize: number,
  ): Promise<DataAndPagination<YearAndMonth>> {
    // NO use this.paginationQueryBuilder CAUSE GroupBy can't select entity.
    const skip: number = (page - 1) * pageSize;
    const queryBuilder = this.createQueryBuilder('credit_reserve_orders')
      .select(
        'YEAR(credit_reserve_orders.order_date) as orderYear, MONTH(credit_reserve_orders.order_date) as orderMonth',
      )
      .where(this.getOrderListWhereCondition())
      .groupBy(
        'YEAR(credit_reserve_orders.order_date), MONTH(credit_reserve_orders.order_date)',
      )
      .orderBy('orderYear', 'DESC')
      .addOrderBy('orderMonth', 'DESC');

    const totalCount: number = (await queryBuilder.getRawMany()).length;
    const data: YearAndMonth[] = await queryBuilder
      .skip(skip)
      .take(pageSize)
      .getRawMany();
    return this.dataAndPagination(data, totalCount, pageSize, page);
  }

  /**
   * order list order by year and month and date of order_date
   * @param month
   * @param year
   * @returns Promise<OrderDetail[]>
   * @author HuuTC
   */
  async getOrderListOrderByMonthly(
    month: number,
    year: number,
  ): Promise<OrderDetail[]> {
    const startDateMonthly = moment([year, --month]).toDate();
    const endDateMonthly = moment(startDateMonthly).endOf('month').toDate();
    const currYear = moment().year();
    const currMonth = moment().month() + 1; // jan=0, dec=11
    // isActiveQuery: get and group by SQL
    const isActiveQuery = `CASE
      WHEN YEAR(credit_reserve_orders.order_date) = ${currYear}
      AND MONTH(credit_reserve_orders.order_date) = ${currMonth}
      THEN 1
      ELSE 0
    END`;
    // Select fields map with OrderDetail
    const select: string =
      'DAY(credit_reserve_orders.order_date) as day, ' +
      'MONTH(credit_reserve_orders.order_date) as month, ' +
      `${isActiveQuery} AS isActive`;
    // OrderBy YEAR, MONTH, DAY And snrfile_deposits_id ( get active status )
    const groupBy: string =
      'YEAR(credit_reserve_orders.order_date), ' +
      'MONTH(credit_reserve_orders.order_date), ' +
      'DAY(credit_reserve_orders.order_date), ' +
      isActiveQuery;
    const orderDetail: OrderDetail[] = await this.createQueryBuilder(
      'credit_reserve_orders',
    )
      .select(select)
      .groupBy(groupBy)
      .where(
        'credit_reserve_orders.order_date BETWEEN :startDateMonthly AND :endDateMonthly',
        { startDateMonthly, endDateMonthly },
      )
      .andWhere(this.getOrderListWhereCondition())
      .orderBy('day', 'ASC')
      .getRawMany();
    return orderDetail;
  }

  /**
   * @returns getOrderList: where condition sql String
   * @author HuuTC
   */
  getOrderListWhereCondition() {
    return `credit_reserve_orders.account_type IN ('${ACCOUNT_TYPE.DEFAULT}', '${ACCOUNT_TYPE.TSUMITATE_NISA}')
      AND DAY(credit_reserve_orders.order_date) BETWEEN ${DATE_ACCEPTED.START} AND ${DATE_ACCEPTED.END}`;
  }

  /**
   * get credit_reserve_orders and tilExecutionDays by leftJoin fmst
   * @param orderDate Date
   * @returns List<credit_reserve_orders.* ( column db name ) and tilExecutionDays>
   * @author HuuTC
   */
  async getOrdersJoinFundMst(orderDate: Date) {
    const queryResults = await this.createQueryBuilder('credit_reserve_orders')
      .select(
        'credit_reserve_orders.*, fmst.til_execution_days as tilExecutionDays',
      )
      .innerJoin(
        FundMst,
        'fmst',
        'fmst.brand_code = credit_reserve_orders.brand_code',
      )
      .distinct(true)
      .where(this.getOrderListWhereCondition())
      .andWhere({
        orderDate,
        invalidCardCheckResult: CHECK_RESULT.OK,
        branchlockResult: CHECK_RESULT.OK,
        ycustomerResult: CHECK_RESULT.OK,
        moneyShortageResult: CHECK_RESULT.OK,
        nisaResult: CHECK_RESULT.OK,
        nameMatchingResult: CHECK_RESULT.OK,
        authSalesResult: CHECK_RESULT.OK,
        notTarget: CHECK_RESULT.OK,
        snrfileFundsId: Not(IsNull()),
        snrfileDepositsId: IsNull(),
      })
      .getRawMany();
    return queryResults;
  }

  /**
   * get order list with by date
   * @param orderDate
   * @param option option where entity column
   * @returns Promise<CreditReserveOrder[]>
   * @author TuyenBQ
   */
  async getOrdersByDate(orderDate: Date, option?: any) {
    return await this.find({ where: { orderDate, ...option } });
  }

  /**
   * get order list with by date
   * @param orderDate
   * @param option option where entity column
   * @returns Promise<CreditReserveOrder[]>
   * @author TuyenBQ
   */
  async getOrdersByDatePaganition(
    intputGetOrderByDate: IntputGetOrderByDate,
    option,
  ) {
    const { orderDate, page, pageSize, sortOption, sortType } =
      intputGetOrderByDate;
    const orderBy: FindOptionsOrder<CreditReserveOrder> = {};
    orderBy[sortOption] = {
      direction: sortType,
    };
    return await this.pagination(
      { orderDate, ...option },
      page,
      pageSize,
      orderBy,
    );
  }

  async updateNisawakuError(orderDate: Date, option?: any) {
    await this.createQueryBuilder()
      .update()
      .set({ nisaResult: CHECK_RESULT.ERR, updatedAt: new Date() })
      .where({
        orderDate,
        ...option,
      })
      .execute();
  }

  /**
   * getOrderGmon: count orders by member id by date
   * @param orderDate
   * @returns
   */
  async getOrderGmon(orderDate: Date) {
    return await this.createQueryBuilder('credit_reserve_orders')
      .where(`order_date = '${orderDate}'`)
      .andWhere(this.getOrderListWhereCondition())
      .andWhere(`invalid_card_check_result = '${CHECK_RESULT.OK}'`)
      .andWhere(`ycustomer_result = '${CHECK_RESULT.OK}'`)
      .andWhere(`branchlock_result = '${CHECK_RESULT.OK}'`)
      .andWhere(`money_shortage_result = '${CHECK_RESULT.OK}'`)
      .andWhere(`nisa_result = '${CHECK_RESULT.OK}'`)
      .andWhere(`name_matching_result = '${CHECK_RESULT.OK}'`)
      .andWhere(`not_target = '${CHECK_RESULT.OK}'`)
      .innerJoin(
        'gmo_payment_info',
        'p',
        'credit_reserve_orders.account_code = p.account_code AND credit_reserve_orders.branch_code = p.branch_code',
      )
      .groupBy(
        'credit_reserve_orders.account_code, credit_reserve_orders.branch_code, p.member_id',
      )
      .select('SUM(order_amount) as amount, p.member_id as memberId')
      .getRawMany();
  }
  /**
   * Get credit reserver order by date
   * @param orderDate
   * @param selectColumn object of selected column -- Ex: { creditReservesId: true }
   * @param accountType list of account type
   * @param whereConditions (option) other where condition except orderDate and accountType
   * @param orderByConditions (option) order condition
   * @returns list of credit reserver order
   * @author BaoPG
   */
  async getCreditReserveOrderByDate(
    orderDate: Date,
    selectColumn: FindOptionsSelect<CreditReserveOrder>,
    accountType: number[],
    whereConditions?: FindOptionsWhere<CreditReserveOrder>,
    orderByConditions?: FindOptionsOrder<CreditReserveOrder>,
  ) {
    return await this.find({
      select: {
        ...selectColumn,
      },
      where: {
        accountType: In([...accountType]),
        orderDate,
        ...whereConditions,
      },
      order: { ...orderByConditions },
    });
  }
  /**
   * Get credit_reserve_orders and tilExecutionDays, AccountBalanceCurrentDate,
   * AccountBalanceNextDate, AccountBalanceExecution by leftJoin fmst
   * @param orderDate Date
   * @returns List<credit_reserve_orders.* ( column db name ), tilExecutionDays,
   * AccountBalanceCurrentDate, AccountBalanceNextDate, AccountBalanceExecution>
   * @author HuuTC
   */
  async checkMoneyShortage(orderDate: Date): Promise<MoneyShortage[]> {
    const select =
      'credit_reserve_orders.id as id, fmst.til_execution_days as tilExecutionDays, ' +
      'snrAcc.AccountBalanceCurrentDate as accountBalanceCurrentDate, ' +
      'snrAcc.AccountBalanceNextDate as accountBalanceNextDate, ' +
      'snrAcc.AccountBalanceExecution as accountBalanceExecution';
    const queryResults = await this.createQueryBuilder('credit_reserve_orders')
      .select(select)
      .leftJoin(
        FundMst,
        'fmst',
        'fmst.brand_code = credit_reserve_orders.brand_code AND fmst.deleted_at = NULL',
      )
      .leftJoin(
        SnrCustomerAccountBalanceBcp,
        'snrAcc',
        'snrAcc.CustomerCode = credit_reserve_orders.account_code' +
          ' AND snrAcc.OfficeCode = credit_reserve_orders.branch_code',
      )
      .where(this.getOrderListWhereCondition())
      .andWhere({
        orderDate,
        invalidCardCheckResult: CHECK_RESULT.OK,
        branchlockResult: CHECK_RESULT.OK,
        ycustomerResult: CHECK_RESULT.OK,
        notTarget: CHECK_RESULT.OK,
      })
      .getRawMany();
    return queryResults;
  }

  /**
   * update records has moneyShortageResult isNull and match condition
   * @param orderDate Date
   * @author HuuTC
   */
  async updateMoneyShortageErr(orderDate: Date) {
    await this.createQueryBuilder()
      .update()
      .set({ moneyShortageResult: CHECK_RESULT.ERR, updatedAt: new Date() })
      .where({
        orderDate,
        invalidCardCheckResult: CHECK_RESULT.OK,
        branchlockResult: CHECK_RESULT.OK,
        ycustomerResult: CHECK_RESULT.OK,
        notTarget: CHECK_RESULT.OK,
        moneyShortageResult: IsNull(),
      })
      .andWhere(this.getOrderListWhereCondition())
      .execute();
  }

  /**
   * Join table credit_reserve_orders and SNR_CUSTOMER_MST_BCP
   * @param orderDate condition dateOrder
   * @author TuyenBQ
   */
  async getCreditOrderYcustomerType(orderDate: Date) {
    const creditReserve = await this.createQueryBuilder('od')
      .select('od.*, snr.yCustomerType')
      .innerJoin(
        SnrCustomerMstBcp,
        'snr',
        'snr.customerCode = od.accountCode AND snr.officeCode = od.branchCode',
      )
      .distinct(true)
      .where({
        accountType: In([ACCOUNT_TYPE.DEFAULT, ACCOUNT_TYPE.TSUMITATE_NISA]),
        orderDate,
        invalidCardCheckResult: CHECK_RESULT.OK,
        notTarget: CHECK_RESULT.OK,
      })
      .execute();
    return creditReserve;
  }

  /**
   * Join table credit_reserve_orders and SNR_ORDER_LOCK_INFO_BCP
   * @param orderDate condition dateOrder
   * @author TuyenBQ
   */
  async getCreditOrderBranchLock(orderDate: Date) {
    const creditReserve = await this.createQueryBuilder('od')
      .select('od.*, snr.branchLock')
      .innerJoin(
        SnrOrderLockInfoBcp,
        'snr',
        // Get digit 1 to digit 6 of snr.customerCode
        // e.g 1234567 => 123456
        'SUBSTRING(snr.customerCode, 1, 6) = od.accountCode AND snr.officeCode = od.branchCode',
      )
      .distinct(true)
      .where({
        accountType: In([ACCOUNT_TYPE.DEFAULT, ACCOUNT_TYPE.TSUMITATE_NISA]),
        orderDate,
        invalidCardCheckResult: CHECK_RESULT.OK,
        ycustomerResult: CHECK_RESULT.OK,
        notTarget: CHECK_RESULT.OK,
      })
      .execute();
    return creditReserve;
  }

  /**
   * set notTarget = NG if rejects not empty
   * @param input InputCheckResults
   * @returns
   * @author HuuTC
   */
  async executeSetNotTarget(orderDate: Date, rejects: number[]) {
    if (!rejects?.length) {
      return;
    }
    const loop = Math.ceil(rejects.length / SAVE_CHUNK_NUMBER_BY_IDS);
    for (let index = 0; index < loop; index++) {
      await this.update(
        {
          id: In(
            rejects.slice(
              SAVE_CHUNK_NUMBER_BY_IDS * index,
              SAVE_CHUNK_NUMBER_BY_IDS * (index + 1),
            ),
          ),
          orderDate,
        },
        { notTarget: CHECK_RESULT.NG },
      );
    }
  }

  /**
   * Execute set invalid_card_check_result
   * SQL Example: https://redmine.vitalify.asia/issues/22000
   * @param orderDate
   * @author HuuTC
   */
  async executeSetCardResults(orderDate: Date) {
    const where = {
      accountType: In([ACCOUNT_TYPE.DEFAULT, ACCOUNT_TYPE.TSUMITATE_NISA]),
      orderDate,
      notTarget: CHECK_RESULT.OK,
    };
    const selectAndGr =
      'credit_reserve_orders.account_code, credit_reserve_orders.branch_code, card.invalid_flg, card.deleted_at ';
    const groupByQuery = this.createQueryBuilder('credit_reserve_orders')
      .select(selectAndGr)
      .innerJoin(
        CreditCardInfo,
        'card',
        `credit_reserve_orders.branch_code = card.branch_code
          AND credit_reserve_orders.account_code = card.account_code`,
      )
      .where(where)
      .groupBy(selectAndGr);
    // deleted_at == null && invalid_flg == 1 →  set invalid_card_check_result == 1
    // deleted_at != null → set invalid_card_check_result == 1
    // deleted_at == null && invalid_flg != 1 → set invalid_card_check_result == 0
    const getResultSelect = `CASE
      WHEN grCard.deleted_at IS NULL AND ( grCard.invalid_flg <> 1 OR grCard.invalid_flg IS NULL )
        THEN ${CHECK_RESULT.OK}
      WHEN ( grCard.deleted_at IS NOT NULL OR ( grCard.deleted_at IS NULL AND grCard.invalid_flg = 1 ) )
        THEN ${CHECK_RESULT.NG}
    END`;

    await this.createQueryBuilder()
      .addCommonTableExpression(groupByQuery, 'grCard')
      .update(CreditReserveOrder)
      .set({
        invalidCardCheckResult: () => `COALESCE ((
          SELECT ${getResultSelect}
          FROM grCard
          WHERE
            credit_reserve_orders.branch_code = grCard.branch_code
            AND credit_reserve_orders.account_code = grCard.account_code
        ), ${CHECK_RESULT.UKN} ) `,
        updatedAt: new Date(),
      })
      .where(where)
      .execute();
  }

  /**
   * Execute set ycustomer_result
   * SQL Example: https://redmine.vitalify.asia/issues/21951#note-11
   * @param orderDate
   * @author HuuTC
   */
  async executeSetYcustomerResult(orderDate: Date) {
    const where = {
      accountType: In([ACCOUNT_TYPE.DEFAULT, ACCOUNT_TYPE.TSUMITATE_NISA]),
      orderDate,
      notTarget: CHECK_RESULT.OK,
      invalidCardCheckResult: CHECK_RESULT.OK,
    };
    const selectAndGr =
      'credit_reserve_orders.account_code, credit_reserve_orders.branch_code, snr.yCustomerType';
    const groupByQuery = this.createQueryBuilder('credit_reserve_orders')
      .select(selectAndGr)
      .innerJoin(
        SnrCustomerMstBcp,
        'snr',
        `snr.CustomerCode = credit_reserve_orders.account_code
      AND snr.OfficeCode = credit_reserve_orders.branch_code`,
      )
      .where(where)
      .groupBy(selectAndGr);
    // Update ycustomerResult by condition yCustomerType
    // if not match set UKN
    const getResultQuery = `COALESCE ((
        SELECT CASE
            WHEN grWithSnr.yCustomerType = 0 THEN ${CHECK_RESULT.OK}
            WHEN grWithSnr.yCustomerType = 1 THEN ${CHECK_RESULT.NG}
          END
        FROM grWithSnr
        WHERE
          grWithSnr.account_code = credit_reserve_orders.account_code
          AND grWithSnr.branch_code = credit_reserve_orders.branch_code
      ), ${CHECK_RESULT.UKN} ) `;

    await this.createQueryBuilder()
      .addCommonTableExpression(groupByQuery, 'grWithSnr')
      .update(CreditReserveOrder)
      .set({
        ycustomerResult: () => getResultQuery,
        updatedAt: new Date(),
      })
      .where(where)
      .execute();
  }

  /**
   * Execute set branchlock_result
   * SQL Example: https://redmine.vitalify.asia/issues/21951#note-12
   * @param orderDate
   * @author HuuTC
   */
  async executeSetBranchlockResult(orderDate: Date) {
    const where = {
      accountType: In([ACCOUNT_TYPE.DEFAULT, ACCOUNT_TYPE.TSUMITATE_NISA]),
      orderDate,
      invalidCardCheckResult: CHECK_RESULT.OK,
      notTarget: CHECK_RESULT.OK,
      ycustomerResult: CHECK_RESULT.OK,
    };
    const selectAndGr =
      'credit_reserve_orders.account_code, credit_reserve_orders.branch_code, snr.BranchLock';
    const groupByQuery = this.createQueryBuilder('credit_reserve_orders')
      .select(selectAndGr)
      .innerJoin(
        SnrOrderLockInfoBcp,
        'snr',
        `SUBSTRING(snr.CustomerCode, 1, 6) = credit_reserve_orders.account_code
          AND snr.OfficeCode = credit_reserve_orders.branch_code`,
      )
      .where(where)
      .groupBy(selectAndGr);
    // Update branchlockResult by condition BranchLock
    // if not match set OK (update 2022-12-07)
    const getResultQuery = `COALESCE ((
        SELECT CASE
            WHEN grSnr.BranchLock = 0 THEN ${CHECK_RESULT.OK}
            WHEN grSnr.BranchLock = 1 THEN ${CHECK_RESULT.NG}
          END
        FROM grSnr
        WHERE
        grSnr.account_code = credit_reserve_orders.account_code
          AND grSnr.branch_code = credit_reserve_orders.branch_code
      ), ${CHECK_RESULT.OK} ) `;

    await this.createQueryBuilder()
      .addCommonTableExpression(groupByQuery, 'grSnr')
      .update(CreditReserveOrder)
      .set({
        branchlockResult: () => getResultQuery,
        updatedAt: new Date(),
      })
      .where(where)
      .execute();
  }

  /**
   * Set money_shortage_result multiple row
   * SQL Example: https://redmine.vitalify.asia/issues/22043#note-7
   * execute set money_shortage_result
   * @param orderDate
   * @author HuuTC
   */
  async executeSetMoneyResult(orderDate: Date) {
    const selectAndGr = `credit_reserve_orders.brand_code,
      credit_reserve_orders.account_code, credit_reserve_orders.branch_code,
      fmst.til_execution_days, snrAcc.AccountBalanceCurrentDate,
      snrAcc.AccountBalanceNextDate, snrAcc.AccountBalanceExecution`;
    const where = {
      accountType: In([ACCOUNT_TYPE.DEFAULT, ACCOUNT_TYPE.TSUMITATE_NISA]),
      orderDate,
      invalidCardCheckResult: CHECK_RESULT.OK,
      notTarget: CHECK_RESULT.OK,
      ycustomerResult: CHECK_RESULT.OK,
      branchlockResult: CHECK_RESULT.OK,
    };
    const groupByQuery = this.createQueryBuilder('credit_reserve_orders')
      .select(selectAndGr)
      .innerJoin(
        SnrCustomerAccountBalanceBcp,
        'snrAcc',
        `snrAcc.GuarantyMoneyType = 1 AND
        snrAcc.CustomerCode = credit_reserve_orders.account_code
        AND snrAcc.OfficeCode = credit_reserve_orders.branch_code`,
      )
      .innerJoin(
        FundMst,
        'fmst',
        'fmst.brand_code = credit_reserve_orders.brand_code',
      )
      .where(where)
      .groupBy(selectAndGr);
    const getResultQuery = `COALESCE ((
        SELECT CASE
            WHEN ( groupbyTable.til_execution_days = ${TIL_EXECUTE_DATE.CURR_DATE} AND groupbyTable.AccountBalanceCurrentDate < 0 )
              OR ( groupbyTable.til_execution_days = ${TIL_EXECUTE_DATE.NEXT_DATE} AND groupbyTable.AccountBalanceNextDate < 0 )
              OR ( groupbyTable.til_execution_days = ${TIL_EXECUTE_DATE.EXECUTE_DATE} AND groupbyTable.AccountBalanceExecution < 0 )
            THEN ${CHECK_RESULT.NG}
            ELSE ${CHECK_RESULT.OK}
          END
        FROM groupbyTable
        WHERE groupbyTable.account_code = credit_reserve_orders.account_code
          AND groupbyTable.branch_code = credit_reserve_orders.branch_code
          AND groupbyTable.brand_code = credit_reserve_orders.brand_code), ${CHECK_RESULT.UKN} ) `;

    await this.createQueryBuilder('credit_reserve_orders')
      .addCommonTableExpression(groupByQuery, 'groupbyTable')
      .update(CreditReserveOrder)
      .set({
        moneyShortageResult: () => getResultQuery,
        updatedAt: new Date(),
      })
      .where(where)
      .execute();
  }

  /**
   * Execute update nisa_result case OK
   * SQL Example: https://redmine.vitalify.asia/issues/21475#note-24
   * @param orderDate
   */
  async excuteNisaCaseOK(orderDate: Date) {
    // update nisaResult = 0 case accountType = 0
    await this.update(
      {
        accountType: ACCOUNT_TYPE.DEFAULT,
        orderDate,
        invalidCardCheckResult: CHECK_RESULT.OK,
        notTarget: CHECK_RESULT.OK,
        ycustomerResult: CHECK_RESULT.OK,
        branchlockResult: CHECK_RESULT.OK,
        moneyShortageResult: CHECK_RESULT.OK,
      },
      {
        nisaResult: CHECK_RESULT.OK,
      },
    );
    const groupBy = `credit_reserve_orders.branch_code,
      credit_reserve_orders.account_code,
      wb4.CreditLimit,
      wb4.UsageAmount,
      wb4.ScheduledFixedAmount,
      wb4.UnExecutedAmount,
      wb4.AccountingYear`;
    const select =
      groupBy + ', SUM(credit_reserve_orders.order_amount) as totalAmount';

    const where = {
      accountType: ACCOUNT_TYPE.TSUMITATE_NISA,
      orderDate,
      invalidCardCheckResult: CHECK_RESULT.OK,
      notTarget: CHECK_RESULT.OK,
      ycustomerResult: CHECK_RESULT.OK,
      branchlockResult: CHECK_RESULT.OK,
      moneyShortageResult: CHECK_RESULT.OK,
    };

    // sql create table temp groupby branch_code and account_code
    // And conditions are satisfied (CreditLimit - UsageAmount - ScheduledFixedAmount  - UnExecutedAmount) > order_amount
    const orderbyNisa = this.createQueryBuilder('credit_reserve_orders')
      .select(select)
      .innerJoin(
        WB4NisaLimitData,
        'wb4',
        `wb4.OfficeCode = credit_reserve_orders.branch_code
          AND SUBSTRING ( wb4.AccountCode, 1, 6 ) = credit_reserve_orders.account_code `,
      )
      .where(where)
      .groupBy(groupBy)
      .having(
        '( wb4.CreditLimit - wb4.UsageAmount - wb4.ScheduledFixedAmount  - wb4.UnExecutedAmount ) > SUM(credit_reserve_orders.order_amount)',
      );

    const getResultQuery = `(
      SELECT CASE
        WHEN orderbyNisa.AccountingYear <> ${THIS_YEAR} OR orderbyNisa.CreditLimit <> ${CREDIT_LIMIT}
          THEN ${CHECK_RESULT.UKN}
        ELSE ${CHECK_RESULT.OK}
        END
      FROM orderbyNisa
      WHERE credit_reserve_orders.account_code = orderbyNisa.account_code
          AND orderbyNisa.branch_code = credit_reserve_orders.branch_code
    ) `;

    await this.createQueryBuilder()
      .update(CreditReserveOrder)
      .addCommonTableExpression(orderbyNisa, 'orderbyNisa')
      .set({
        nisaResult: () => getResultQuery,
        updatedAt: new Date(),
      })
      .where(where)
      .execute();
  }

  /**
   * get list branchCode, accountCode and refreshToken group
   * @param orderDate
   * @returns List branchCode, accountCode
   */
  async getRefreshTokenByAccountAndBranch(orderDate: Date) {
    const select =
      'token.refresh_token AS refreshToken, ' +
      'MIN(token.id) AS tokenId, ' +
      'credit_reserve_orders.branch_code AS branchCode, ' +
      'credit_reserve_orders.account_code AS accountCode, ' +
      // get first order_id for save kanaRespone
      'MIN(credit_reserve_orders.id) as orderId';

    return await this.createQueryBuilder('credit_reserve_orders')
      .select(select)
      .innerJoin(
        AccessTokenInfo,
        'token',
        'token.branch_code = credit_reserve_orders.branch_code AND token.account_code = credit_reserve_orders.account_code',
      )
      .where({
        invalidCardCheckResult: CHECK_RESULT.OK,
        branchlockResult: CHECK_RESULT.OK,
        ycustomerResult: CHECK_RESULT.OK,
        moneyShortageResult: CHECK_RESULT.OK,
        orderDate,
        nisaResult: CHECK_RESULT.OK,
      })
      .groupBy(
        'credit_reserve_orders.branch_code, credit_reserve_orders.account_code, token.refresh_token',
      )
      .getRawMany();
  }

  /**
   * update authSalesResult by ids was handled
   * @param queryRunner
   * @param ids
   * @param authSalesResult
   * @returns
   */
  async updateAuthSalesResults(
    queryRunner: QueryRunner,
    ids: number[],
    authSalesResult: string,
  ) {
    if (!ids.length) {
      return;
    }
    const loop = Math.ceil(ids.length / SAVE_CHUNK_NUMBER_BY_IDS);
    for (let index = 0; index < loop; index++) {
      await queryRunner.manager.update(
        CreditReserveOrder,
        {
          id: In(
            ids.slice(
              SAVE_CHUNK_NUMBER_BY_IDS * index,
              SAVE_CHUNK_NUMBER_BY_IDS * (index + 1),
            ),
          ),
        },
        { authSalesResult },
      );
    }
  }

  /**
   * check all column null
   * @param orderDate
   * @returns
   */
  async checkAllNull(orderDate: Date) {
    let allNull = false;
    const selectColumn = [
      'invalid_card_check_result',
      'ycustomer_result',
      'branchlock_result',
      'money_shortage_result',
      'nisa_result',
      'name_matching_result',
    ];

    const orders = await this.createQueryBuilder()
      .select(selectColumn)
      .distinct(true)
      .where({
        orderDate,
      })
      .execute();

    for (const element of selectColumn) {
      const isNull = orders.every((item) => item[element] === null);
      if (isNull) {
        allNull = true;
        break;
      }
    }
    return allNull;
  }
}
