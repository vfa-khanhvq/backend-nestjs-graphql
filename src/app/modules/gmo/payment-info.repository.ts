import { Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { BaseRepository } from '../../../vendors/base/base.repository';
import { CreditReserveOrder } from '../credit-reserve-orders/entities/credit-reserve-order.entity';
import { PaymentInfo } from './entities/payment_info.entity';

@Injectable()
export class PaymentInfoRepository extends BaseRepository<PaymentInfo> {
  constructor(dataSource: DataSource) {
    super(PaymentInfo, dataSource.manager);
  }

  /**
   * get list payment info by account and branh code
   * @param items
   * @returns
   */
  async getByOders(items: CreditReserveOrder[]) {
    const condition = [];
    for (const item of items) {
      const { accountCode, branchCode } = item;
      condition.push({ accountCode, branchCode });
    }
    const payments = await this.find({ where: condition });
    return payments;
  }

  /**
   * get list payment from list member id
   * @param members
   * @returns
   */
  async getPaymentByMemberIds(members: string[]) {
    const result: PaymentInfo[] = [];
    const chunkSize = 2000;
    for (let i = 0; i < members.length; i += chunkSize) {
      const chunkNember = members.slice(i, i + chunkSize);
      const dataChunk = await this.find({
        where: {
          memberId: In(chunkNember),
        },
      });
      result.push(...dataChunk);
    }
    return result;
  }
}
