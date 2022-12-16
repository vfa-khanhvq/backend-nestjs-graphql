import { SnrFileFunds } from '../../src/app/modules/snrfile_funds/entities/snrfile_funds.entity';
import { SnrfileDeposits } from '../../src/app/modules/snrfile-deposits/entities/snrfile-deposits.entity';
import { CreditReserveOrder } from '../../src/app/modules/credit-reserve-orders/entities/credit-reserve-order.entity';
import { CreditProcessStep } from '../../src/app/modules/credit-process-steps/entities/credit-process-steps.entity';

export async function insertResetData(isStepOne = false) {
  for (let i = 1; i < 10; i++) {
    let snrfileFund = new SnrFileFunds();
    snrfileFund.accountCode = '10000' + i;
    snrfileFund.branchCode = 'b' + i;
    snrfileFund.brandCode = 'bn' + i;
    snrfileFund.dataCode = 'd' + i;
    snrfileFund.unitType = i.toString();
    snrfileFund.settlementMethod = i.toString();
    snrfileFund.specifiedAccountType = i.toString();
    snrfileFund.orderCh = i.toString();
    snrfileFund.identifyingCode = i.toString();
    snrfileFund.orderReceiveDate = i.toString();
    snrfileFund.orderReceiveTime = i.toString();
    snrfileFund.createdAt = new Date();
    snrfileFund = await snrfileFund.save();
    let snrfileDeposit = new SnrfileDeposits();
    snrfileDeposit.accountCode = '10000' + i;
    snrfileDeposit.branchCode = 'b' + i;
    snrfileDeposit.dataType = 'b' + i;
    snrfileDeposit.workingDay = 'b' + i;
    snrfileDeposit.dataCode = 'b' + i;
    snrfileDeposit.salesCode = 'b' + i;
    snrfileDeposit.depositAmount = 'b' + i;
    snrfileDeposit.descriptionCode = 'b' + i;
    snrfileDeposit.transferDate = 'b' + i;
    snrfileDeposit.informationType = 'b' + i;
    snrfileDeposit.sequenceNo = 'b' + i;
    snrfileDeposit.reserve = 'b' + i;
    snrfileDeposit.companyCode = 'b' + i;
    snrfileDeposit = await snrfileDeposit.save();
    const newOrder = new CreditReserveOrder();
    newOrder.accountCode = '10000' + i;
    newOrder.branchCode = 'b' + i;
    newOrder.brandCode = 'bn' + i;
    newOrder.orderAmount = 1000 + i;
    newOrder.orderDate = new Date('2022-10-10 00:00:00');
    newOrder.creditReservesId = i;
    newOrder.accountType = 0;
    newOrder.invalidCardCheckResult = '0';
    newOrder.ycustomerResult = '0';
    newOrder.branchlockResult = '0';
    newOrder.moneyShortageResult = '0';
    newOrder.nisaResult = '0';
    newOrder.nameMatchingResult = '0';
    if (!isStepOne) {
      newOrder.authSalesResult = '0';
      newOrder.snrfileFundsId = snrfileFund.id;
      newOrder.snrfileDepositsId = snrfileDeposit.id;
    }
    await newOrder.save();
  }
  const order = new CreditReserveOrder();
  order.accountCode = '100011';
  order.branchCode = 'b11';
  order.brandCode = 'bn11';
  order.orderAmount = 1011;
  order.orderDate = new Date('2022-10-11 00:00:00');
  order.creditReservesId = 11;
  order.accountType = 0;
  order.invalidCardCheckResult = '0';
  order.ycustomerResult = '0';
  order.branchlockResult = '0';
  order.moneyShortageResult = '0';
  order.nisaResult = '0';
  order.nameMatchingResult = '0';
  order.authSalesResult = '0';
  await order.save();
  const step = new CreditProcessStep();
  step.orderDate = new Date('2022-10-12 00:00:00');
  step.currentStep = 3;
  step.status = 'DONE';
  await step.save();
}
