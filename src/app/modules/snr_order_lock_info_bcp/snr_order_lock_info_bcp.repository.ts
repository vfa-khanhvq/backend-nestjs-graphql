import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../../vendors/base/base.repository';
import { SnrOrderLockInfoBcp } from './entities/snr_order_lock_info_bcp.entity';

@Injectable()
export class SnrOrderLockInfoBcpRepository extends BaseRepository<SnrOrderLockInfoBcp> {
  constructor(dataSource: DataSource) {
    super(SnrOrderLockInfoBcp, dataSource.manager);
  }
}
