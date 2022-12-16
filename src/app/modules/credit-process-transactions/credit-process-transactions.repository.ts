import { Injectable } from '@nestjs/common';
import { DataSource, MoreThan } from 'typeorm';
import { BaseRepository } from '../../../vendors/base/base.repository';
import { CreditProcessTransaction } from './entities/credit-process-transaction.entity';
import * as moment from 'moment';
@Injectable()
export class CreditProcessTransactionRepository extends BaseRepository<CreditProcessTransaction> {
  constructor(dataSource: DataSource) {
    super(CreditProcessTransaction, dataSource.manager);
  }

  async getProcessRunning() {
    return await this.findOne({
      where: {
        expireTime: MoreThan(moment().toDate()),
      },
    });
  }
}
