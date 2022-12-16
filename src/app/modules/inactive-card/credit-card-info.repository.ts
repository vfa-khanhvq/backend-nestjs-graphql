import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../../vendors/base/base.repository';
import { CreditReserveOrdersRepository } from '../credit-reserve-orders/credit-reserve-orders.repository';
import { CreditCardInfo } from './entities/credit_card_info.entity';

@Injectable()
export class CreditCardInfoRepository extends BaseRepository<CreditCardInfo> {
  constructor(
    dataSource: DataSource,
    private creditReserveOrdersRepository: CreditReserveOrdersRepository,
  ) {
    super(CreditCardInfo, dataSource.manager);
  }
  /**
   * query checkInvalidCard
   * @param orderDate
   * @returns Promise<any>
   * @author KhanhLD
   */
  async getListOrder(orderDate: Date): Promise<any> {
    return await this.creditReserveOrdersRepository.getOrdersByDate(orderDate);
  }

  /**
   * query checkValidCard
   * @returns Promise<CreditCardInfo[]>
   * @author KhanhLD
   */
  async getListCard(accounts: any[]): Promise<CreditCardInfo[]> {
    return await this.find({
      where: accounts,
      withDeleted: true,
    });
  }
}
