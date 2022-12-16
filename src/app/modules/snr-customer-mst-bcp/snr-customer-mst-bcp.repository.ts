import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../../vendors/base/base.repository';
import { SnrCustomerMstBcp } from './entities/snr-customer-mst-bcp.entity';

@Injectable()
export class SnrCustomerMstBcpRepository extends BaseRepository<SnrCustomerMstBcp> {
  constructor(dataSource: DataSource) {
    super(SnrCustomerMstBcp, dataSource.manager);
  }
  /**
   * Get List SnrCustomerMstBcp by branchCode and accountCode
   * @returns Promise<SnrGlobalHolidayCalendarBcp[]>
   * @author HuuTC
   */
  async getOneByBranchCodeAndAccountCode(
    branchCode: string,
    accountCode: string,
  ): Promise<SnrCustomerMstBcp> {
    const result: SnrCustomerMstBcp = await this.findOne({
      where: {
        officeCode: branchCode,
        customerCode: accountCode,
      },
    });
    return result;
  }
}
