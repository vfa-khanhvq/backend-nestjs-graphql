import { Module } from '@nestjs/common';
import { CreditProcessTransactionsService } from './credit-process-transactions.service';
import { CreditProcessTransactionsResolver } from './credit-process-transactions.resolver';

@Module({
  providers: [
    CreditProcessTransactionsResolver,
    CreditProcessTransactionsService,
  ],
})
export class CreditProcessTransactionsModule {}
