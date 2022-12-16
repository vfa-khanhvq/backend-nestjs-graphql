import { Module } from '@nestjs/common';
import { CreditReservesService } from './credit-reserves.service';
import { CreditReservesResolver } from './credit-reserves.resolver';
import { CreditReservesRepository } from './credit-reserves.repository';
import { CreditReserveOrdersRepository } from '../credit-reserve-orders/credit-reserve-orders.repository';
import { SnrGlobalHolidayCalendarBcpRepository } from '../snr-global-holiday-calendar-bcp/snr-global-holiday-calendar-bcp.repository';

@Module({
  providers: [
    CreditReservesResolver,
    CreditReservesService,
    CreditReservesRepository,
    CreditReserveOrdersRepository,
    SnrGlobalHolidayCalendarBcpRepository,
  ],
  exports: [CreditReservesService],
})
export class CreditReservesModule {}
