import { Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { BaseRepository } from '../../../vendors/base/base.repository';
import { SnrFileFunds } from './entities/snrfile_funds.entity';

@Injectable()
export class SnrFileFundsRepository extends BaseRepository<SnrFileFunds> {
  constructor(dataSource: DataSource) {
    super(SnrFileFunds, dataSource.manager);
  }
}
