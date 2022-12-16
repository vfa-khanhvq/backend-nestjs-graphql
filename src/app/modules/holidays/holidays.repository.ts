import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Between, DataSource } from 'typeorm';
import { BaseRepository } from '../../../vendors/base/base.repository';
import { Holidays } from './entities/holidays.entity';

@Injectable()
export class HolidaysRepository extends BaseRepository<Holidays> {
  constructor(dataSource: DataSource) {
    super(Holidays, dataSource.manager);
  }
  /**
   * Get Holidays by date into curr month
   * @returns Holidays[]
   * @author HuuTC
   */
  async getHolidaysByCurrentMonth(): Promise<Holidays[]> {
    const startMonth = moment().startOf('month').toDate();
    const endMonth = moment().endOf('month').toDate();
    return await this.find({
      where: {
        date: Between(startMonth, endMonth),
      },
    });
  }
}
