import { Module } from '@nestjs/common';
import { GmoService } from './gmo.service';
import { GmoResolver } from './gmo.resolver';
import { PaymentInfoRepository } from './payment-info.repository';
import { CreditReserveOrdersRepository } from '../credit-reserve-orders/credit-reserve-orders.repository';
import { JwtModule } from '@nestjs/jwt';
import { CreditCardInfoRepository } from '../inactive-card/credit-card-info.repository';
import { CreditReserveOrdersModule } from '../credit-reserve-orders/credit-reserve-orders.module';
import { CreditProcessStepRepository } from '../credit-process-steps/credit-process-steps.repository';

@Module({
  imports: [JwtModule.register({}), CreditReserveOrdersModule],
  providers: [
    GmoService,
    GmoResolver,
    PaymentInfoRepository,
    CreditReserveOrdersRepository,
    CreditCardInfoRepository,
    JwtModule,
    CreditProcessStepRepository,
  ],
})
export class GmoModule {}
