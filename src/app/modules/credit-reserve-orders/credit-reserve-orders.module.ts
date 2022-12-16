import { Module } from '@nestjs/common';
import { CreditReserveOrdersService } from './credit-reserve-orders.service';
import { CreditReserveOrdersResolver } from './credit-reserve-orders.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditReserveOrdersRepository } from './credit-reserve-orders.repository';
import { CreditReserveOrder } from './entities/credit-reserve-order.entity';
import { CreditReservesRepository } from '../credit-reserves/credit-reserves.repository';
import { WB4NisaLimitDataRepository } from '../wb4-nina-limitdata/wb4-nisa-limitdata.repository';
import { SnrCustomerMstBcpRepository } from '../snr-customer-mst-bcp/snr-customer-mst-bcp.repository';
import { SnrOrderLockInfoBcpRepository } from '../snr_order_lock_info_bcp/snr_order_lock_info_bcp.repository';
import { JwtModule } from '@nestjs/jwt';
import { HolidaysRepository } from '../holidays/holidays.repository';
import { CreditReservesModule } from '../credit-reserves/credit-reserves.module';
import { CustomerOrderClosesRepository } from '../customer-order-closes/customer-order-closes.repository';
import { SnrGlobalHolidayCalendarBcpRepository } from '../snr-global-holiday-calendar-bcp/snr-global-holiday-calendar-bcp.repository';
import { SnrFileFundsRepository } from '../snrfile_funds/snrfile_funds.repository';
import { CreditCardInfoRepository } from '../inactive-card/credit-card-info.repository';
import { AccessTokenInfo } from '../auth/entities/access-token.entity';
import { CreditKana } from '../credit/credit-kana.entity';
import { AccountMstBcp } from '../WB4/account-MST-BCP.entity';
import { CreditProcessTransactionRepository } from '../credit-process-transactions/credit-process-transactions.repository';
import { CreditProcessStepRepository } from '../credit-process-steps/credit-process-steps.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CreditReserveOrder,
      AccessTokenInfo,
      CreditKana,
      AccountMstBcp,
    ]),
    JwtModule.register({}),
    CreditReservesModule,
  ],
  providers: [
    CreditReserveOrdersResolver,
    CreditReserveOrdersService,
    CreditReserveOrdersRepository,
    HolidaysRepository,
    CustomerOrderClosesRepository,
    CreditReservesRepository,
    WB4NisaLimitDataRepository,
    CustomerOrderClosesRepository,
    SnrFileFundsRepository,
    SnrCustomerMstBcpRepository,
    SnrGlobalHolidayCalendarBcpRepository,
    SnrOrderLockInfoBcpRepository,
    CreditCardInfoRepository,
    CreditProcessTransactionRepository,
    CreditProcessStepRepository,
  ],
  exports: [CreditReserveOrdersService],
})
export class CreditReserveOrdersModule {}
