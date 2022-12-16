import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../../vendors/base/base.repository';
import { WB4NisaLimitData } from './entities/wb4-nisa-limitdata.entity';

@Injectable()
export class WB4NisaLimitDataRepository extends BaseRepository<WB4NisaLimitData> {
  constructor(private dataSource: DataSource) {
    super(WB4NisaLimitData, dataSource.manager);
  }

  async getWB4NisaByAccountAndOffice(accountCode: string, officeCode: string) {
    return await this.findOne({
      where: {
        accountCode,
        officeCode,
      },
    });
  }
}
