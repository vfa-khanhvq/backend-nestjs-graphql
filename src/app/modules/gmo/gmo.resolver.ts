import { UseGuards, UsePipes } from '@nestjs/common';
import { Resolver, Args, Query, Mutation } from '@nestjs/graphql';
import { AdminGuard } from '../../../vendors/guards/admin.guard';
import { BaseResolver } from '../../../vendors/base/base.resolver';
import { GmoService } from './gmo.service';
import { GmoData, InputCreditOrder } from '../../../app/graphql/graphql.schema';
import { JoiValidationPipe } from '../../../vendors/pipes/joiValidation.pipe';
import * as joi from 'joi';
import { CreditReserveOrdersService } from '../credit-reserve-orders/credit-reserve-orders.service';

@Resolver('Gmo')
export class GmoResolver extends BaseResolver {
  constructor(
    private readonly gmoService: GmoService,
    private readonly creditReserveOrdersService: CreditReserveOrdersService,
  ) {
    super();
  }

  /**
   * get data to generate GMO file by date
   * @param dateOrder
   * @returns
   */
  @UseGuards(AdminGuard)
  @Query('getGmoData')
  @UsePipes(
    new JoiValidationPipe<InputCreditOrder>({
      orderDate: joi.date(),
    }),
  )
  async getGmoData(@Args('input') input: InputCreditOrder) {
    const items = await this.gmoService.getGmoData(input.orderDate);
    return this.response(items);
  }

  /**
   * update status to database from gmo data and update error card info
   * @param items
   * @returns
   */
  @UseGuards(AdminGuard)
  @UsePipes(
    new JoiValidationPipe<GmoData>({
      orderDate: joi.date(),
      file: joi.any().required(),
    }),
  )
  @Mutation('updateGmoData')
  async updateGmoData(@Args('gmoData') gmoData: GmoData) {
    await this.gmoService.updateGmoData(gmoData);
    return this.response({});
  }
}
