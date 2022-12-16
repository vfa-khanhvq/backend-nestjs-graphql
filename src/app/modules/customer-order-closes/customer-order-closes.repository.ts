import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { CUSTOMER_SERVICE_TYPE_ACCEPTED } from '../../../configs/constants/constant';
import { Between, DataSource } from 'typeorm';
import { BaseRepository } from '../../../vendors/base/base.repository';
import { CustomerOrderCloses } from './entities/customer-order-closes.entity';

@Injectable()
export class CustomerOrderClosesRepository extends BaseRepository<CustomerOrderCloses> {
  constructor(dataSource: DataSource) {
    super(CustomerOrderCloses, dataSource.manager);
  }
  /**
   * get CustomerOrderCloses by handlingOn into current month
   * @returns CustomerOrderCloses[]
   * @author HuuTC
   */
  async getOrderClosesByCurrentMonth(): Promise<CustomerOrderCloses[]> {
    const startMonth = moment().startOf('month').toDate();
    const endMonth = moment().endOf('month').toDate();
    // get all record at curr month and serviceType = CUSTOMER_SERVICE_TYPE_ACCEPTED(30),
    return await this.find({
      where: {
        handlingOn: Between(startMonth, endMonth),
        serviceType: CUSTOMER_SERVICE_TYPE_ACCEPTED,
      },
    });
  }

  async findCustomerClosesByServiceTypeHandlingOn(
    serviceType: number,
    handlingOn: string,
  ) {
    return await this.createQueryBuilder()
      .where({
        serviceType,
        handlingOn,
      })
      .getOne();
  }
}
