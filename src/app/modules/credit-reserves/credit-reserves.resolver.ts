import { Resolver, Query } from '@nestjs/graphql';
import { CreditReservesService } from './credit-reserves.service';

@Resolver('CreditReserve')
export class CreditReservesResolver {
  constructor(private readonly creditReservesService: CreditReservesService) {}

  /**
   * funtion for lamda call batch
   */
  @Query('createCreditReserve')
  async createCreditReserve() {
    await this.creditReservesService.handleCron();
  }
}
