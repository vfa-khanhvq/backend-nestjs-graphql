import { Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { BaseRepository } from '../../../vendors/base/base.repository';
import { SnrGlobalHolidayCalendarBcp } from './entities/snr-global-holiday-calendar-bcp.entity';

@Injectable()
export class SnrGlobalHolidayCalendarBcpRepository extends BaseRepository<SnrGlobalHolidayCalendarBcp> {
  constructor(dataSource: DataSource) {
    super(SnrGlobalHolidayCalendarBcp, dataSource.manager);
  }
  /**
   * Get List SnrGlobalHolidayCalendarBcp by SecurityCode
   * @returns Promise<SnrGlobalHolidayCalendarBcp[]>
   * @author HuuTC
   */
  async getHolidayBySecurityCodes(
    securityCodes: string[],
  ): Promise<SnrGlobalHolidayCalendarBcp[]> {
    const Holidays: SnrGlobalHolidayCalendarBcp[] = await this.find({
      where: {
        securityCode: In(securityCodes),
      },
    });
    return Holidays;
  }
}
