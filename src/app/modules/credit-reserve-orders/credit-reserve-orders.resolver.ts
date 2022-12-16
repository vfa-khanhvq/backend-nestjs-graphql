import { SetMetadata, UseGuards, UsePipes } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import {
  GetOrderListRespone,
  InputCreditOrder,
  InputCheckResults,
  InputInsertData,
  InputResetOrder,
  IntputGetOrderByDate,
  OrdersRespone,
  InputChangeOrderDate,
  InputUpateStep,
  InputCheckResult,
  InputInsertDataReserver,
} from '../../graphql/graphql.schema';
import * as joi from 'joi';
import { BaseResolver } from '../../../vendors/base/base.resolver';
import { CreditReserveOrdersService } from './credit-reserve-orders.service';
import { JoiValidationPipe } from '../../../vendors/pipes/joiValidation.pipe';
import { AdminGuard } from '../../../vendors/guards/admin.guard';
import { ROLE, ROLES } from '../../../configs/constants/auth';

@Resolver('CreditReserveOrder')
export class CreditReserveOrdersResolver extends BaseResolver {
  constructor(
    private readonly creditReserveOrdersService: CreditReserveOrdersService,
  ) {
    super();
  }
  /**
   * Get order list orderBy year and month by order_date
   * @guard AdminGuard
   * @query getOrderList
   * @param page
   * @param pageSize
   * @returns GetOrderListRespone.
   * @author HuuTC
   */
  @UseGuards(AdminGuard)
  @Query('getOrderList')
  async getOrderList(
    @Args('page') page: number,
    @Args('pageSize') pageSize: number,
  ): Promise<GetOrderListRespone> {
    const respone: OrdersRespone =
      await this.creditReserveOrdersService.getOrderList(page, pageSize);
    return this.response(respone);
  }

  /**
   * create payment list to SNR by order_date
   * @guard AdminGuard
   * @query getOrderList
   * @param orderDate
   * @returns CreatePaymentsToSnrRespone
   * @author HuuTC
   */
  @UseGuards(AdminGuard)
  @Mutation('createPaymentsToSnr')
  async createPaymentsToSnr(@Args('orderDate') orderDate: Date) {
    await this.creditReserveOrdersService.createPaymentsToSnr(orderDate);
    return this.response({});
  }

  /**
   * get order list with account = 2 by date
   * @guard
   * @query getOrdersByDate
   * @returns GetOrdersByDateRespone.
   * @author TuyenBQ
   */
  @UseGuards(AdminGuard)
  @UsePipes(
    new JoiValidationPipe<IntputGetOrderByDate>({
      orderDate: joi.date(),
      page: joi.number().min(1),
      pageSize: joi.number().min(1),
      getAll: joi.boolean(),
    }),
  )
  @Query('getOrdersByDate')
  async getOrdersByDate(@Args('input') input: IntputGetOrderByDate) {
    const response = await this.creditReserveOrdersService.getOrdersByDate(
      input,
    );
    return this.response(response);
  }

  /**
   * Get order list orderBy year and month by order_date
   * @guard
   * @query createOrderListToSNR
   * @returns GetOrderListRespone.
   * @author TuyenBQ
   */
  @UseGuards(AdminGuard)
  @UsePipes(
    new JoiValidationPipe<InputCreditOrder>({
      orderDate: joi.date(),
    }),
  )
  @Mutation('createOrderListToSNR')
  async createOrderListToSNR(@Args('input') input: InputCreditOrder) {
    await this.creditReserveOrdersService.createOrderListToSNR(input);
    return this.response({});
  }

  /**
   * reset order status from step
   * @param input
   * @returns
   */
  @UseGuards(AdminGuard)
  @UsePipes(
    new JoiValidationPipe<InputResetOrder>({
      orderDate: joi.date(),
    }),
  )
  @Mutation('resetOrder')
  async resetOrder(@Args('input') input: InputResetOrder) {
    await this.creditReserveOrdersService.resetOrder(input);
    return this.response({});
  }

  /**
   * reset order status from all step
   * @param input
   * @returns
   */
  @SetMetadata(ROLE, ROLES.SUPER_ADMIN)
  @UseGuards(AdminGuard)
  @UsePipes(
    new JoiValidationPipe<InputResetOrder>({
      orderDate: joi.date(),
    }),
  )
  @Mutation('resetOrderAll')
  async resetOrderAll(@Args('input') input: InputResetOrder) {
    await this.creditReserveOrdersService.resetOrder(input, true);
    return this.response({});
  }

  /**
   * remove all SnrFileFunds and SnrFileDeposits of orders by date
   * @param input
   * @returns
   */
  @SetMetadata(ROLE, ROLES.SUPER_ADMIN)
  @UseGuards(AdminGuard)
  @UsePipes(
    new JoiValidationPipe<InputResetOrder>({
      orderDate: joi.date(),
    }),
  )
  @Mutation('removeSnrRecord')
  async removeSnrRecord(@Args('input') input: InputResetOrder) {
    await this.creditReserveOrdersService.removeSnrRecord(input);
    return this.response({});
  }

  /**
   * remove all SnrFileFunds and SnrFileDeposits of orders by date
   * @param input
   * @returns
   */
  @Mutation('insertData')
  @UsePipes(
    new JoiValidationPipe<InputInsertData>({
      orderDate: joi.date(),
      amount: joi.number().integer().default(1).min(1),
      setupData: joi.boolean().default(false),
    }),
  )
  async insertData(@Args('input') input: InputInsertData) {
    await this.creditReserveOrdersService.insertData(input);
    return this.response({});
  }

  /**
   * handle check results invalidCard, invalidCardCheck, ycustomer, branchlock, moneyShortage, nisa, kanaName
   * @guard
   * @mutate handleCheckResults
   * @param input InputCheckResults
   * @returns list of credit reserve order with result
   * @author HuuTC
   */
  @UseGuards(AdminGuard)
  @UsePipes(
    new JoiValidationPipe<InputCreditOrder>({
      orderDate: joi.date(),
    }),
  )
  @Mutation('handleCheckResults')
  async handleCheckResults(@Args('input') input: InputCheckResults) {
    await this.creditReserveOrdersService.handleCheckResults(input);
    return this.response({});
  }

  /**
   * Change all order of a date to new date
   * @param input
   * @returns
   */
  @SetMetadata(ROLE, ROLES.SUPER_ADMIN)
  @UseGuards(AdminGuard)
  @UsePipes(
    new JoiValidationPipe<InputChangeOrderDate>({
      orderDate: joi.date(),
      newOrderDate: joi.date().not(joi.ref('orderDate')),
    }),
  )
  @Mutation('changeOrderDate')
  async changeOrderDate(@Args('input') input: InputChangeOrderDate) {
    await this.creditReserveOrdersService.changeOrderDate(input);
    return this.response({});
  }

  /**
   * update step
   * @param input
   * @returns
   */
  @UseGuards(AdminGuard)
  @UsePipes(
    new JoiValidationPipe<InputUpateStep>({
      orderDate: joi.date(),
      step: joi.number().min(1),
    }),
  )
  @Mutation('updateStep')
  async updateStep(@Args('input') input: InputUpateStep) {
    const result = await this.creditReserveOrdersService.updateStep(input);
    return this.response(result);
  }

  /**
   * update result step
   * @param input
   * @returns
   */
  @UseGuards(AdminGuard)
  @UsePipes(
    new JoiValidationPipe<InputCheckResult>({
      orderDate: joi.date(),
    }),
  )
  @Mutation('updateResultStep')
  async updateResultStep(@Args('input') input: InputCheckResult) {
    const result = await this.creditReserveOrdersService.updateResultStep(
      input,
    );
    return this.response(result);
  }

  /**
   * insert reserver orders
   * @param input
   * @returns
   */
  @Mutation('insertReserver')
  @UsePipes(
    new JoiValidationPipe<InputInsertDataReserver>({
      amount: joi.number().integer().default(78).min(78),
    }),
  )
  async insertReserver(@Args('input') input: InputInsertDataReserver) {
    await this.creditReserveOrdersService.insertReserver(input);
    return this.response({});
  }
}
