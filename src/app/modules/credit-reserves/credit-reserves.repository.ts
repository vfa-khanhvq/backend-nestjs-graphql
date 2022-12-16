import { Injectable } from '@nestjs/common';
import { ACCOUNT_TYPE } from '../../../configs/constants/gmo';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../../vendors/base/base.repository';
import { CreditReserves } from './entities/credit-reserve.entity';

@Injectable()
export class CreditReservesRepository extends BaseRepository<CreditReserves> {
  constructor(dataSource: DataSource) {
    super(CreditReserves, dataSource.manager);
  }
  /**
   * get list CreditReserves
   * @returns Promise<CreditReserves[]>
   * @author HuuTC
   */
  async getLastMonthCreditReserves(): Promise<CreditReserves[]> {
    const creditReserves: CreditReserves[] = await this.createQueryBuilder(
      'credit_reserves',
    )
      .andWhere(this.createOrdersWhereCondition())
      .getMany();
    return creditReserves;
  }

  /**
   * create orders where condition sql
   * @returns string
   * @author HuuTC
   */
  createOrdersWhereCondition() {
    // account_type type string
    return `credit_reserves.account_type IN (${ACCOUNT_TYPE.DEFAULT}, ${ACCOUNT_TYPE.TSUMITATE_NISA})`;
  }
}
