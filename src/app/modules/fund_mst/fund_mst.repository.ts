import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../../vendors/base/base.repository';
import { FundMst } from './entities/fund_mst.entity';

@Injectable()
export class FundMstRepository extends BaseRepository<FundMst> {
  constructor(dataSource: DataSource) {
    super(FundMst, dataSource.manager);
  }
}
