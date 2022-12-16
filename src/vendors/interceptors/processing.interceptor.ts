import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  ORDER_DATE_KEY,
  PROCESS_TIMEOUT_MINUTE,
  TRANSACTION_STEPS,
} from '../../configs/constants/auth';
import { CreditProcessTransaction } from '../../app/modules/credit-process-transactions/entities/credit-process-transaction.entity';
import { MoreThan } from 'typeorm';
import { BaseException } from '../exceptions/base.exception';
import * as moment from 'moment';
import {
  ANOTHER_PROCESS_RUNING,
  INVALID_DATE,
} from '../../configs/constants/error-code/base';
import { findByKey } from '../../configs/constants/object';

@Injectable()
export class ProcessingInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    let process;
    const ctxStart = GqlExecutionContext.create(context);
    const info = ctxStart.getInfo();
    const step = TRANSACTION_STEPS[info?.fieldName];
    if (step) {
      const orderDate = findByKey(info.variableValues, ORDER_DATE_KEY);
      if (!moment(orderDate).isValid()) {
        throw new BaseException(INVALID_DATE.CODE, INVALID_DATE.MESSAGE);
      }
      if (orderDate) {
        const processCurrent = await CreditProcessTransaction.find({
          where: {
            expireTime: MoreThan(moment().toDate()),
          },
        });
        if (processCurrent.length) {
          throw new BaseException(
            ANOTHER_PROCESS_RUNING.CODE,
            ANOTHER_PROCESS_RUNING.MESSAGE,
          );
        } else {
          const ctx = GqlExecutionContext.create(context);
          const auth = ctx.getContext().req?.auth;
          process = new CreditProcessTransaction();
          process.userId = auth?.userId;
          process.orderDate = moment(orderDate).format('yyyy-MM-DD');
          process.currentStep = step;
          process.expireTime = moment()
            .add(PROCESS_TIMEOUT_MINUTE, 'minute')
            .toDate();
          await CreditProcessTransaction.save(process);
        }
      }
    }
    return next.handle().pipe(
      tap(
        async () => {
          if (process instanceof CreditProcessTransaction) {
            if (process.id) {
              await CreditProcessTransaction.remove(process);
            }
          }
        },
        async (error: Error) => {
          if (process instanceof CreditProcessTransaction) {
            if (process.id) {
              await CreditProcessTransaction.remove(process);
            }
          }
          console.log(error);
        },
      ),
    );
  }
}
