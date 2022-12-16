import { Resolver } from '@nestjs/graphql';
import { CreditProcessTransactionsService } from './credit-process-transactions.service';

@Resolver('CreditProcessTransaction')
export class CreditProcessTransactionsResolver {
  constructor(
    private readonly creditProcessTransactionsService: CreditProcessTransactionsService,
  ) {}
}
