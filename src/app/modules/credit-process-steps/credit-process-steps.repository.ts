import { Injectable } from '@nestjs/common';
import { STATUS } from '../../../configs/constants/constant';
import { DataSource, QueryRunner } from 'typeorm';
import { BaseRepository } from '../../../vendors/base/base.repository';
import { CreditProcessStep } from './entities/credit-process-steps.entity';

@Injectable()
export class CreditProcessStepRepository extends BaseRepository<CreditProcessStep> {
  constructor(dataSource: DataSource) {
    super(CreditProcessStep, dataSource.manager);
  }

  /**
   * updateStep
   * @param orderDate
   * @param currentStep
   * @param status
   * @returns current step
   * @author TuyenBQ
   */
  async updateStep(
    orderDate: Date,
    currentStep: number,
    status = STATUS.DONE,
    queryRunner: QueryRunner = null,
  ) {
    let step = await this.findOneBy({ orderDate });
    if (step) {
      step.currentStep = currentStep;
      step.status = status;
    } else {
      step = new CreditProcessStep();
      step.orderDate = orderDate;
      step.currentStep = currentStep;
      step.status = status;
    }
    if (queryRunner) {
      return await queryRunner.manager.save(step);
    } else {
      return await this.save(step);
    }
  }

  /**
   * getCurrentStep
   * @param orderDate
   * @param currentStep
   * @param status
   * @returns current step
   * @author TuyenBQ
   */
  async getCurrentStep(orderDate: Date): Promise<CreditProcessStep> {
    const order = await this.findOne({
      select: {
        currentStep: true,
        status: true,
      },
      where: {
        orderDate,
      },
    });
    return order;
  }
}
