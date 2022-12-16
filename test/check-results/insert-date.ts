import { CreditReserveOrder } from './../../src/app/modules/credit-reserve-orders/entities/credit-reserve-order.entity';
import { FundMst } from './../../src/app/modules/fund_mst/entities/fund_mst.entity';
import { SnrGlobalHolidayCalendarBcp } from './../../src/app/modules/snr-global-holiday-calendar-bcp/entities/snr-global-holiday-calendar-bcp.entity';
import { CreditCardInfo } from './../../src/app/modules/inactive-card/entities/credit_card_info.entity';
import { SnrCustomerMstBcp } from './../../src/app/modules/snr-customer-mst-bcp/entities/snr-customer-mst-bcp.entity';
import { SnrOrderLockInfoBcp } from './../../src/app/modules/snr_order_lock_info_bcp/entities/snr_order_lock_info_bcp.entity';
import { SnrCustomerAccountBalanceBcp } from './../../src/app/modules/snr-customer-account-balance-bcp/entities/snr-customer-account-balance-bcp.entity';
import { WB4NisaLimitData } from './../../src/app/modules/wb4-nina-limitdata/entities/wb4-nisa-limitdata.entity';
import { AccountMstBcp } from './../../src/app/modules/WB4/account-MST-BCP.entity';
import * as moment from 'moment';

let orderDate = new Date(moment().year() + '-' + moment().month() + '-' + '08');

export function setOrderDate(date: Date) {
  orderDate = date;
}
/**
 * create CreditReservesOrders base on link data below
 * https://docs.google.com/spreadsheets/d/1lmq5a5LNJKadBeznC77PAtgBiHul5pBwG8YhuZ8RcP8/edit#gid=1987785313
 */
export async function createCreditReservesOrders() {
  const creditReservesOrders = [];
  let creditReservesId = 1;
  const creditReservesOrder1 = new CreditReserveOrder();
  creditReservesOrder1.branchCode = '301';
  creditReservesOrder1.accountCode = '100001';
  creditReservesOrder1.brandCode = '5613801';
  creditReservesOrder1.orderAmount = 10000;
  creditReservesOrder1.accountType = 0;
  creditReservesOrder1.creditReservesId = ++creditReservesId;
  creditReservesOrder1.orderDate = orderDate;
  creditReservesOrder1.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder1);

  const creditReservesOrder2 = new CreditReserveOrder();
  creditReservesOrder2.branchCode = '301';
  creditReservesOrder2.accountCode = '100001';
  creditReservesOrder2.brandCode = '5613803';
  creditReservesOrder2.orderAmount = 2000;
  creditReservesOrder2.accountType = 2;
  creditReservesOrder2.creditReservesId = ++creditReservesId;
  creditReservesOrder2.orderDate = orderDate;
  creditReservesOrder2.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder2);

  const creditReservesOrder3 = new CreditReserveOrder();
  creditReservesOrder3.branchCode = '302';
  creditReservesOrder3.accountCode = '100002';
  creditReservesOrder3.brandCode = '5613803';
  creditReservesOrder3.orderAmount = 20000;
  creditReservesOrder3.accountType = 0;
  creditReservesOrder3.creditReservesId = ++creditReservesId;
  creditReservesOrder3.orderDate = orderDate;
  creditReservesOrder3.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder3);

  const creditReservesOrder4 = new CreditReserveOrder();
  creditReservesOrder4.branchCode = '303';
  creditReservesOrder4.accountCode = '100003';
  creditReservesOrder4.brandCode = '5613805';
  creditReservesOrder4.orderAmount = 8000;
  creditReservesOrder4.accountType = 0;
  creditReservesOrder4.creditReservesId = ++creditReservesId;
  creditReservesOrder4.orderDate = orderDate;
  creditReservesOrder4.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder4);

  const creditReservesOrder5 = new CreditReserveOrder();
  creditReservesOrder5.branchCode = '305';
  creditReservesOrder5.accountCode = '100005';
  creditReservesOrder5.brandCode = '5613803';
  creditReservesOrder5.orderAmount = 10000;
  creditReservesOrder5.accountType = 0;
  creditReservesOrder5.creditReservesId = ++creditReservesId;
  creditReservesOrder5.orderDate = orderDate;
  creditReservesOrder5.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder5);

  const creditReservesOrder6 = new CreditReserveOrder();
  creditReservesOrder6.branchCode = '305';
  creditReservesOrder6.accountCode = '100005';
  creditReservesOrder6.brandCode = '5613805';
  creditReservesOrder6.orderAmount = 10000;
  creditReservesOrder6.accountType = 0;
  creditReservesOrder6.creditReservesId = ++creditReservesId;
  creditReservesOrder6.orderDate = orderDate;
  creditReservesOrder6.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder6);

  const creditReservesOrder7 = new CreditReserveOrder();
  creditReservesOrder7.branchCode = '305';
  creditReservesOrder7.accountCode = '100005';
  creditReservesOrder7.brandCode = '5613811';
  creditReservesOrder7.orderAmount = 30000;
  creditReservesOrder7.accountType = 0;
  creditReservesOrder7.creditReservesId = ++creditReservesId;
  creditReservesOrder7.orderDate = orderDate;
  creditReservesOrder7.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder7);

  const creditReservesOrder8 = new CreditReserveOrder();
  creditReservesOrder8.branchCode = '306';
  creditReservesOrder8.accountCode = '100006';
  creditReservesOrder8.brandCode = '5613805';
  creditReservesOrder8.orderAmount = 90000;
  creditReservesOrder8.accountType = 2;
  creditReservesOrder8.creditReservesId = ++creditReservesId;
  creditReservesOrder8.orderDate = orderDate;
  creditReservesOrder8.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder8);

  const creditReservesOrder9 = new CreditReserveOrder();
  creditReservesOrder9.branchCode = '307';
  creditReservesOrder9.accountCode = '100007';
  creditReservesOrder9.brandCode = '5613803';
  creditReservesOrder9.orderAmount = 100000;
  creditReservesOrder9.accountType = 0;
  creditReservesOrder9.creditReservesId = ++creditReservesId;
  creditReservesOrder9.orderDate = orderDate;
  creditReservesOrder9.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder9);

  const creditReservesOrder10 = new CreditReserveOrder();
  creditReservesOrder10.branchCode = '307';
  creditReservesOrder10.accountCode = '100007';
  creditReservesOrder10.brandCode = '5613808';
  creditReservesOrder10.orderAmount = 50000;
  creditReservesOrder10.accountType = 0;
  creditReservesOrder10.creditReservesId = ++creditReservesId;
  creditReservesOrder10.orderDate = orderDate;
  creditReservesOrder10.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder10);

  const creditReservesOrder11 = new CreditReserveOrder();
  creditReservesOrder11.branchCode = '307';
  creditReservesOrder11.accountCode = '100007';
  creditReservesOrder11.brandCode = '5613811';
  creditReservesOrder11.orderAmount = 100000;
  creditReservesOrder11.accountType = 0;
  creditReservesOrder11.creditReservesId = ++creditReservesId;
  creditReservesOrder11.orderDate = orderDate;
  creditReservesOrder11.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder11);

  const creditReservesOrder12 = new CreditReserveOrder();
  creditReservesOrder12.branchCode = '308';
  creditReservesOrder12.accountCode = '100008';
  creditReservesOrder12.brandCode = '5613808';
  creditReservesOrder12.orderAmount = 10000;
  creditReservesOrder12.accountType = 0;
  creditReservesOrder12.creditReservesId = ++creditReservesId;
  creditReservesOrder12.orderDate = orderDate;
  creditReservesOrder12.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder12);

  const creditReservesOrder13 = new CreditReserveOrder();
  creditReservesOrder13.branchCode = '308';
  creditReservesOrder13.accountCode = '100008';
  creditReservesOrder13.brandCode = '5613801';
  creditReservesOrder13.orderAmount = 90000;
  creditReservesOrder13.accountType = 0;
  creditReservesOrder13.creditReservesId = ++creditReservesId;
  creditReservesOrder13.orderDate = orderDate;
  creditReservesOrder13.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder13);

  const creditReservesOrder14 = new CreditReserveOrder();
  creditReservesOrder14.branchCode = '309';
  creditReservesOrder14.accountCode = '100009';
  creditReservesOrder14.brandCode = '5613801';
  creditReservesOrder14.orderAmount = 120000;
  creditReservesOrder14.accountType = 0;
  creditReservesOrder14.creditReservesId = ++creditReservesId;
  creditReservesOrder14.orderDate = orderDate;
  creditReservesOrder14.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder14);

  const creditReservesOrder15 = new CreditReserveOrder();
  creditReservesOrder15.branchCode = '310';
  creditReservesOrder15.accountCode = '100010';
  creditReservesOrder15.brandCode = '5613801';
  creditReservesOrder15.orderAmount = 70000;
  creditReservesOrder15.accountType = 0;
  creditReservesOrder15.creditReservesId = ++creditReservesId;
  creditReservesOrder15.orderDate = orderDate;
  creditReservesOrder15.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder15);

  const creditReservesOrder16 = new CreditReserveOrder();
  creditReservesOrder16.branchCode = '311';
  creditReservesOrder16.accountCode = '100011';
  creditReservesOrder16.brandCode = '5613801';
  creditReservesOrder16.orderAmount = 90000;
  creditReservesOrder16.accountType = 0;
  creditReservesOrder16.creditReservesId = ++creditReservesId;
  creditReservesOrder16.orderDate = orderDate;
  creditReservesOrder16.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder16);

  const creditReservesOrder17 = new CreditReserveOrder();
  creditReservesOrder17.branchCode = '313';
  creditReservesOrder17.accountCode = '100013';
  creditReservesOrder17.brandCode = '5613801';
  creditReservesOrder17.orderAmount = 60000;
  creditReservesOrder17.accountType = 2;
  creditReservesOrder17.creditReservesId = ++creditReservesId;
  creditReservesOrder17.orderDate = orderDate;
  creditReservesOrder17.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder17);

  const creditReservesOrder18 = new CreditReserveOrder();
  creditReservesOrder18.branchCode = '313';
  creditReservesOrder18.accountCode = '100013';
  creditReservesOrder18.brandCode = '5613803';
  creditReservesOrder18.orderAmount = 50000;
  creditReservesOrder18.accountType = 2;
  creditReservesOrder18.creditReservesId = ++creditReservesId;
  creditReservesOrder18.orderDate = orderDate;
  creditReservesOrder18.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder18);

  const creditReservesOrder19 = new CreditReserveOrder();
  creditReservesOrder19.branchCode = '313';
  creditReservesOrder19.accountCode = '100013';
  creditReservesOrder19.brandCode = '5613811';
  creditReservesOrder19.orderAmount = 90000;
  creditReservesOrder19.accountType = 2;
  creditReservesOrder19.creditReservesId = ++creditReservesId;
  creditReservesOrder19.orderDate = orderDate;
  creditReservesOrder19.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder19);

  const creditReservesOrder20 = new CreditReserveOrder();
  creditReservesOrder20.branchCode = '313';
  creditReservesOrder20.accountCode = '100013';
  creditReservesOrder20.brandCode = '5613808';
  creditReservesOrder20.orderAmount = 20000;
  creditReservesOrder20.accountType = 2;
  creditReservesOrder20.creditReservesId = ++creditReservesId;
  creditReservesOrder20.orderDate = orderDate;
  creditReservesOrder20.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder20);

  const creditReservesOrder21 = new CreditReserveOrder();
  creditReservesOrder21.branchCode = '314';
  creditReservesOrder21.accountCode = '100014';
  creditReservesOrder21.brandCode = '5613801';
  creditReservesOrder21.orderAmount = 100000;
  creditReservesOrder21.accountType = 2;
  creditReservesOrder21.creditReservesId = ++creditReservesId;
  creditReservesOrder21.orderDate = orderDate;
  creditReservesOrder21.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder21);

  const creditReservesOrder22 = new CreditReserveOrder();
  creditReservesOrder22.branchCode = '314';
  creditReservesOrder22.accountCode = '100014';
  creditReservesOrder22.brandCode = '5613803';
  creditReservesOrder22.orderAmount = 20000;
  creditReservesOrder22.accountType = 2;
  creditReservesOrder22.creditReservesId = ++creditReservesId;
  creditReservesOrder22.orderDate = orderDate;
  creditReservesOrder22.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder22);

  const creditReservesOrder23 = new CreditReserveOrder();
  creditReservesOrder23.branchCode = '314';
  creditReservesOrder23.accountCode = '100014';
  creditReservesOrder23.brandCode = '5613811';
  creditReservesOrder23.orderAmount = 20000;
  creditReservesOrder23.accountType = 2;
  creditReservesOrder23.creditReservesId = ++creditReservesId;
  creditReservesOrder23.orderDate = orderDate;
  creditReservesOrder23.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder23);

  const creditReservesOrder24 = new CreditReserveOrder();
  creditReservesOrder24.branchCode = '314';
  creditReservesOrder24.accountCode = '100014';
  creditReservesOrder24.brandCode = '5613808';
  creditReservesOrder24.orderAmount = 200000;
  creditReservesOrder24.accountType = 2;
  creditReservesOrder24.creditReservesId = ++creditReservesId;
  creditReservesOrder24.orderDate = orderDate;
  creditReservesOrder24.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder24);

  const creditReservesOrder25 = new CreditReserveOrder();
  creditReservesOrder25.branchCode = '315';
  creditReservesOrder25.accountCode = '100015';
  creditReservesOrder25.brandCode = '5613801';
  creditReservesOrder25.orderAmount = 60000;
  creditReservesOrder25.accountType = 2;
  creditReservesOrder25.creditReservesId = ++creditReservesId;
  creditReservesOrder25.orderDate = orderDate;
  creditReservesOrder25.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder25);

  const creditReservesOrder26 = new CreditReserveOrder();
  creditReservesOrder26.branchCode = '315';
  creditReservesOrder26.accountCode = '100015';
  creditReservesOrder26.brandCode = '5613803';
  creditReservesOrder26.orderAmount = 50000;
  creditReservesOrder26.accountType = 2;
  creditReservesOrder26.creditReservesId = ++creditReservesId;
  creditReservesOrder26.orderDate = orderDate;
  creditReservesOrder26.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder26);

  const creditReservesOrder27 = new CreditReserveOrder();
  creditReservesOrder27.branchCode = '315';
  creditReservesOrder27.accountCode = '100015';
  creditReservesOrder27.brandCode = '5613811';
  creditReservesOrder27.orderAmount = 90000;
  creditReservesOrder27.accountType = 0;
  creditReservesOrder27.creditReservesId = ++creditReservesId;
  creditReservesOrder27.orderDate = orderDate;
  creditReservesOrder27.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder27);

  const creditReservesOrder28 = new CreditReserveOrder();
  creditReservesOrder28.branchCode = '315';
  creditReservesOrder28.accountCode = '100015';
  creditReservesOrder28.brandCode = '5613808';
  creditReservesOrder28.orderAmount = 20000;
  creditReservesOrder28.accountType = 2;
  creditReservesOrder28.creditReservesId = ++creditReservesId;
  creditReservesOrder28.orderDate = orderDate;
  creditReservesOrder28.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder28);

  const creditReservesOrder29 = new CreditReserveOrder();
  creditReservesOrder29.branchCode = '316';
  creditReservesOrder29.accountCode = '100016';
  creditReservesOrder29.brandCode = '5613801';
  creditReservesOrder29.orderAmount = 100000;
  creditReservesOrder29.accountType = 0;
  creditReservesOrder29.creditReservesId = ++creditReservesId;
  creditReservesOrder29.orderDate = orderDate;
  creditReservesOrder29.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder29);

  const creditReservesOrder30 = new CreditReserveOrder();
  creditReservesOrder30.branchCode = '316';
  creditReservesOrder30.accountCode = '100016';
  creditReservesOrder30.brandCode = '5613803';
  creditReservesOrder30.orderAmount = 20000;
  creditReservesOrder30.accountType = 2;
  creditReservesOrder30.creditReservesId = ++creditReservesId;
  creditReservesOrder30.orderDate = orderDate;
  creditReservesOrder30.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder30);

  const creditReservesOrder31 = new CreditReserveOrder();
  creditReservesOrder31.branchCode = '316';
  creditReservesOrder31.accountCode = '100016';
  creditReservesOrder31.brandCode = '5613811';
  creditReservesOrder31.orderAmount = 20000;
  creditReservesOrder31.accountType = 0;
  creditReservesOrder31.creditReservesId = ++creditReservesId;
  creditReservesOrder31.orderDate = orderDate;
  creditReservesOrder31.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder31);

  const creditReservesOrder32 = new CreditReserveOrder();
  creditReservesOrder32.branchCode = '316';
  creditReservesOrder32.accountCode = '100016';
  creditReservesOrder32.brandCode = '5613808';
  creditReservesOrder32.orderAmount = 200000;
  creditReservesOrder32.accountType = 2;
  creditReservesOrder32.creditReservesId = ++creditReservesId;
  creditReservesOrder32.orderDate = orderDate;
  creditReservesOrder32.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder32);

  const creditReservesOrder33 = new CreditReserveOrder();
  creditReservesOrder33.branchCode = '317';
  creditReservesOrder33.accountCode = '100017';
  creditReservesOrder33.brandCode = '5613801';
  creditReservesOrder33.orderAmount = 10000;
  creditReservesOrder33.accountType = 2;
  creditReservesOrder33.creditReservesId = ++creditReservesId;
  creditReservesOrder33.orderDate = orderDate;
  creditReservesOrder33.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder33);

  const creditReservesOrder34 = new CreditReserveOrder();
  creditReservesOrder34.branchCode = '317';
  creditReservesOrder34.accountCode = '100017';
  creditReservesOrder34.brandCode = '5613803';
  creditReservesOrder34.orderAmount = 20000;
  creditReservesOrder34.accountType = 0;
  creditReservesOrder34.creditReservesId = ++creditReservesId;
  creditReservesOrder34.orderDate = orderDate;
  creditReservesOrder34.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder34);

  const creditReservesOrder35 = new CreditReserveOrder();
  creditReservesOrder35.branchCode = '317';
  creditReservesOrder35.accountCode = '100017';
  creditReservesOrder35.brandCode = '5613811';
  creditReservesOrder35.orderAmount = 100000;
  creditReservesOrder35.accountType = 2;
  creditReservesOrder35.creditReservesId = ++creditReservesId;
  creditReservesOrder35.orderDate = orderDate;
  creditReservesOrder35.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder35);

  const creditReservesOrder36 = new CreditReserveOrder();
  creditReservesOrder36.branchCode = '317';
  creditReservesOrder36.accountCode = '100017';
  creditReservesOrder36.brandCode = '5613808';
  creditReservesOrder36.orderAmount = 20000;
  creditReservesOrder36.accountType = 2;
  creditReservesOrder36.creditReservesId = ++creditReservesId;
  creditReservesOrder36.orderDate = orderDate;
  creditReservesOrder36.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder36);

  const creditReservesOrder37 = new CreditReserveOrder();
  creditReservesOrder37.branchCode = '318';
  creditReservesOrder37.accountCode = '100018';
  creditReservesOrder37.brandCode = '5613801';
  creditReservesOrder37.orderAmount = 60000;
  creditReservesOrder37.accountType = 2;
  creditReservesOrder37.creditReservesId = ++creditReservesId;
  creditReservesOrder37.orderDate = orderDate;
  creditReservesOrder37.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder37);

  const creditReservesOrder38 = new CreditReserveOrder();
  creditReservesOrder38.branchCode = '318';
  creditReservesOrder38.accountCode = '100018';
  creditReservesOrder38.brandCode = '5613803';
  creditReservesOrder38.orderAmount = 90000;
  creditReservesOrder38.accountType = 2;
  creditReservesOrder38.creditReservesId = ++creditReservesId;
  creditReservesOrder38.orderDate = orderDate;
  creditReservesOrder38.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder38);

  const creditReservesOrder39 = new CreditReserveOrder();
  creditReservesOrder39.branchCode = '318';
  creditReservesOrder39.accountCode = '100018';
  creditReservesOrder39.brandCode = '5613811';
  creditReservesOrder39.orderAmount = 200000;
  creditReservesOrder39.accountType = 0;
  creditReservesOrder39.creditReservesId = ++creditReservesId;
  creditReservesOrder39.orderDate = orderDate;
  creditReservesOrder39.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder39);

  const creditReservesOrder40 = new CreditReserveOrder();
  creditReservesOrder40.branchCode = '318';
  creditReservesOrder40.accountCode = '100018';
  creditReservesOrder40.brandCode = '5613808';
  creditReservesOrder40.orderAmount = 200000;
  creditReservesOrder40.accountType = 2;
  creditReservesOrder40.creditReservesId = ++creditReservesId;
  creditReservesOrder40.orderDate = orderDate;
  creditReservesOrder40.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder40);

  const creditReservesOrder41 = new CreditReserveOrder();
  creditReservesOrder41.branchCode = '319';
  creditReservesOrder41.accountCode = '100019';
  creditReservesOrder41.brandCode = '5613801';
  creditReservesOrder41.orderAmount = 50000;
  creditReservesOrder41.accountType = 2;
  creditReservesOrder41.creditReservesId = ++creditReservesId;
  creditReservesOrder41.orderDate = orderDate;
  creditReservesOrder41.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder41);

  const creditReservesOrder42 = new CreditReserveOrder();
  creditReservesOrder42.branchCode = '319';
  creditReservesOrder42.accountCode = '100019';
  creditReservesOrder42.brandCode = '5613803';
  creditReservesOrder42.orderAmount = 100000;
  creditReservesOrder42.accountType = 0;
  creditReservesOrder42.creditReservesId = ++creditReservesId;
  creditReservesOrder42.orderDate = orderDate;
  creditReservesOrder42.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder42);

  const creditReservesOrder43 = new CreditReserveOrder();
  creditReservesOrder43.branchCode = '319';
  creditReservesOrder43.accountCode = '100019';
  creditReservesOrder43.brandCode = '5613811';
  creditReservesOrder43.orderAmount = 200000;
  creditReservesOrder43.accountType = 2;
  creditReservesOrder43.creditReservesId = ++creditReservesId;
  creditReservesOrder43.orderDate = orderDate;
  creditReservesOrder43.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder43);

  const creditReservesOrder44 = new CreditReserveOrder();
  creditReservesOrder44.branchCode = '319';
  creditReservesOrder44.accountCode = '100019';
  creditReservesOrder44.brandCode = '5613808';
  creditReservesOrder44.orderAmount = 20000;
  creditReservesOrder44.accountType = 2;
  creditReservesOrder44.creditReservesId = ++creditReservesId;
  creditReservesOrder44.orderDate = orderDate;
  creditReservesOrder44.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder44);

  const creditReservesOrder45 = new CreditReserveOrder();
  creditReservesOrder45.branchCode = '320';
  creditReservesOrder45.accountCode = '100020';
  creditReservesOrder45.brandCode = '5613801';
  creditReservesOrder45.orderAmount = 60000;
  creditReservesOrder45.accountType = 2;
  creditReservesOrder45.creditReservesId = ++creditReservesId;
  creditReservesOrder45.orderDate = orderDate;
  creditReservesOrder45.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder45);

  const creditReservesOrder46 = new CreditReserveOrder();
  creditReservesOrder46.branchCode = '320';
  creditReservesOrder46.accountCode = '100020';
  creditReservesOrder46.brandCode = '5613803';
  creditReservesOrder46.orderAmount = 90000;
  creditReservesOrder46.accountType = 2;
  creditReservesOrder46.creditReservesId = ++creditReservesId;
  creditReservesOrder46.orderDate = orderDate;
  creditReservesOrder46.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder46);

  const creditReservesOrder47 = new CreditReserveOrder();
  creditReservesOrder47.branchCode = '320';
  creditReservesOrder47.accountCode = '100020';
  creditReservesOrder47.brandCode = '5613811';
  creditReservesOrder47.orderAmount = 5000;
  creditReservesOrder47.accountType = 0;
  creditReservesOrder47.creditReservesId = ++creditReservesId;
  creditReservesOrder47.orderDate = orderDate;
  creditReservesOrder47.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder47);

  const creditReservesOrder48 = new CreditReserveOrder();
  creditReservesOrder48.branchCode = '320';
  creditReservesOrder48.accountCode = '100020';
  creditReservesOrder48.brandCode = '5613808';
  creditReservesOrder48.orderAmount = 200000;
  creditReservesOrder48.accountType = 2;
  creditReservesOrder48.creditReservesId = ++creditReservesId;
  creditReservesOrder48.orderDate = orderDate;
  creditReservesOrder48.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder48);

  const creditReservesOrder49 = new CreditReserveOrder();
  creditReservesOrder49.branchCode = '321';
  creditReservesOrder49.accountCode = '100021';
  creditReservesOrder49.brandCode = '5613803';
  creditReservesOrder49.orderAmount = 100000;
  creditReservesOrder49.accountType = 0;
  creditReservesOrder49.creditReservesId = ++creditReservesId;
  creditReservesOrder49.orderDate = orderDate;
  creditReservesOrder49.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder49);

  const creditReservesOrder50 = new CreditReserveOrder();
  creditReservesOrder50.branchCode = '321';
  creditReservesOrder50.accountCode = '100021';
  creditReservesOrder50.brandCode = '5613811';
  creditReservesOrder50.orderAmount = 200000;
  creditReservesOrder50.accountType = 2;
  creditReservesOrder50.creditReservesId = ++creditReservesId;
  creditReservesOrder50.orderDate = orderDate;
  creditReservesOrder50.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder50);

  const creditReservesOrder51 = new CreditReserveOrder();
  creditReservesOrder51.branchCode = '321';
  creditReservesOrder51.accountCode = '100021';
  creditReservesOrder51.brandCode = '5613808';
  creditReservesOrder51.orderAmount = 20000;
  creditReservesOrder51.accountType = 2;
  creditReservesOrder51.creditReservesId = ++creditReservesId;
  creditReservesOrder51.orderDate = orderDate;
  creditReservesOrder51.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder51);

  const creditReservesOrder52 = new CreditReserveOrder();
  creditReservesOrder52.branchCode = '321';
  creditReservesOrder52.accountCode = '100021';
  creditReservesOrder52.brandCode = '5613801';
  creditReservesOrder52.orderAmount = 60000;
  creditReservesOrder52.accountType = 2;
  creditReservesOrder52.creditReservesId = ++creditReservesId;
  creditReservesOrder52.orderDate = orderDate;
  creditReservesOrder52.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder52);

  const creditReservesOrder53 = new CreditReserveOrder();
  creditReservesOrder53.branchCode = '322';
  creditReservesOrder53.accountCode = '100022';
  creditReservesOrder53.brandCode = '5613801';
  creditReservesOrder53.orderAmount = 100000;
  creditReservesOrder53.accountType = 2;
  creditReservesOrder53.creditReservesId = ++creditReservesId;
  creditReservesOrder53.orderDate = orderDate;
  creditReservesOrder53.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder53);

  const creditReservesOrder54 = new CreditReserveOrder();
  creditReservesOrder54.branchCode = '322';
  creditReservesOrder54.accountCode = '100022';
  creditReservesOrder54.brandCode = '5613803';
  creditReservesOrder54.orderAmount = 100000;
  creditReservesOrder54.accountType = 0;
  creditReservesOrder54.creditReservesId = ++creditReservesId;
  creditReservesOrder54.orderDate = orderDate;
  creditReservesOrder54.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder54);

  const creditReservesOrder55 = new CreditReserveOrder();
  creditReservesOrder55.branchCode = '322';
  creditReservesOrder55.accountCode = '100022';
  creditReservesOrder55.brandCode = '5613811';
  creditReservesOrder55.orderAmount = 100000;
  creditReservesOrder55.accountType = 2;
  creditReservesOrder55.creditReservesId = ++creditReservesId;
  creditReservesOrder55.orderDate = orderDate;
  creditReservesOrder55.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder55);

  const creditReservesOrder56 = new CreditReserveOrder();
  creditReservesOrder56.branchCode = '322';
  creditReservesOrder56.accountCode = '100022';
  creditReservesOrder56.brandCode = '5613808';
  creditReservesOrder56.orderAmount = 100000;
  creditReservesOrder56.accountType = 2;
  creditReservesOrder56.creditReservesId = ++creditReservesId;
  creditReservesOrder56.orderDate = orderDate;
  creditReservesOrder56.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder56);

  const creditReservesOrder57 = new CreditReserveOrder();
  creditReservesOrder57.branchCode = '323';
  creditReservesOrder57.accountCode = '100023';
  creditReservesOrder57.brandCode = '5613801';
  creditReservesOrder57.orderAmount = 60000;
  creditReservesOrder57.accountType = 2;
  creditReservesOrder57.creditReservesId = ++creditReservesId;
  creditReservesOrder57.orderDate = orderDate;
  creditReservesOrder57.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder57);

  const creditReservesOrder58 = new CreditReserveOrder();
  creditReservesOrder58.branchCode = '323';
  creditReservesOrder58.accountCode = '100023';
  creditReservesOrder58.brandCode = '5613803';
  creditReservesOrder58.orderAmount = 10000;
  creditReservesOrder58.accountType = 2;
  creditReservesOrder58.creditReservesId = ++creditReservesId;
  creditReservesOrder58.orderDate = orderDate;
  creditReservesOrder58.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder58);

  const creditReservesOrder59 = new CreditReserveOrder();
  creditReservesOrder59.branchCode = '323';
  creditReservesOrder59.accountCode = '100023';
  creditReservesOrder59.brandCode = '5613811';
  creditReservesOrder59.orderAmount = 10000;
  creditReservesOrder59.accountType = 0;
  creditReservesOrder59.creditReservesId = ++creditReservesId;
  creditReservesOrder59.orderDate = orderDate;
  creditReservesOrder59.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder59);

  const creditReservesOrder60 = new CreditReserveOrder();
  creditReservesOrder60.branchCode = '323';
  creditReservesOrder60.accountCode = '100023';
  creditReservesOrder60.brandCode = '5613808';
  creditReservesOrder60.orderAmount = 200000;
  creditReservesOrder60.accountType = 2;
  creditReservesOrder60.creditReservesId = ++creditReservesId;
  creditReservesOrder60.orderDate = orderDate;
  creditReservesOrder60.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder60);

  await CreditReserveOrder.insert(creditReservesOrders);
}

export async function createCreditReservesOrders2() {
  const orderDate8 = new Date(
    moment(moment().year() + '-' + moment().month() + '-' + '08').format(
      'YYYY-MM-DD',
    ),
  );

  const orderDate7 = new Date(
    moment(moment().year() + '-' + moment().month() + '-' + '07').format(
      'YYYY-MM-DD',
    ),
  );

  const creditReservesOrders = [];
  let creditReservesId = 0;
  const creditReservesOrder1 = new CreditReserveOrder();
  creditReservesOrder1.branchCode = '301';
  creditReservesOrder1.accountCode = '100001';
  creditReservesOrder1.brandCode = '5613801';
  creditReservesOrder1.orderAmount = 10000;
  creditReservesOrder1.accountType = 0;
  creditReservesOrder1.creditReservesId = ++creditReservesId;
  creditReservesOrder1.orderDate = orderDate8;
  creditReservesOrder1.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder1);

  const creditReservesOrder2 = new CreditReserveOrder();
  creditReservesOrder2.branchCode = '301';
  creditReservesOrder2.accountCode = '100001';
  creditReservesOrder2.brandCode = '5613802';
  creditReservesOrder2.orderAmount = 2000;
  creditReservesOrder2.accountType = 2;
  creditReservesOrder2.creditReservesId = ++creditReservesId;
  creditReservesOrder2.orderDate = orderDate7;
  creditReservesOrder2.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder2);

  const creditReservesOrder3 = new CreditReserveOrder();
  creditReservesOrder3.branchCode = '301';
  creditReservesOrder3.accountCode = '100001';
  creditReservesOrder3.brandCode = '5613803';
  creditReservesOrder3.orderAmount = 2000;
  creditReservesOrder3.accountType = 2;
  creditReservesOrder3.creditReservesId = ++creditReservesId;
  creditReservesOrder3.orderDate = orderDate8;
  creditReservesOrder3.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder3);

  const creditReservesOrder4 = new CreditReserveOrder();
  creditReservesOrder4.branchCode = '302';
  creditReservesOrder4.accountCode = '100002';
  creditReservesOrder4.brandCode = '5613802';
  creditReservesOrder4.orderAmount = 1000;
  creditReservesOrder4.accountType = 2;
  creditReservesOrder4.creditReservesId = ++creditReservesId;
  creditReservesOrder4.orderDate = orderDate7;
  creditReservesOrder4.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder4);

  const creditReservesOrder5 = new CreditReserveOrder();
  creditReservesOrder5.branchCode = '302';
  creditReservesOrder5.accountCode = '100002';
  creditReservesOrder5.brandCode = '5613803';
  creditReservesOrder5.orderAmount = 20000;
  creditReservesOrder5.accountType = 0;
  creditReservesOrder5.creditReservesId = ++creditReservesId;
  creditReservesOrder5.orderDate = orderDate8;
  creditReservesOrder5.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder5);

  const creditReservesOrder6 = new CreditReserveOrder();
  creditReservesOrder6.branchCode = '302';
  creditReservesOrder6.accountCode = '100002';
  creditReservesOrder6.brandCode = '5613804';
  creditReservesOrder6.orderAmount = 10000;
  creditReservesOrder6.accountType = 0;
  creditReservesOrder6.creditReservesId = ++creditReservesId;
  creditReservesOrder6.orderDate = orderDate7;
  creditReservesOrder6.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder6);

  const creditReservesOrder7 = new CreditReserveOrder();
  creditReservesOrder7.branchCode = '303';
  creditReservesOrder7.accountCode = '100003';
  creditReservesOrder7.brandCode = '5613806';
  creditReservesOrder7.orderAmount = 1000;
  creditReservesOrder7.accountType = 2;
  creditReservesOrder7.creditReservesId = ++creditReservesId;
  creditReservesOrder7.orderDate = orderDate7;
  creditReservesOrder7.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder7);

  const creditReservesOrder8 = new CreditReserveOrder();
  creditReservesOrder8.branchCode = '303';
  creditReservesOrder8.accountCode = '100003';
  creditReservesOrder8.brandCode = '5613805';
  creditReservesOrder8.orderAmount = 8000;
  creditReservesOrder8.accountType = 0;
  creditReservesOrder8.creditReservesId = ++creditReservesId;
  creditReservesOrder8.orderDate = orderDate8;
  creditReservesOrder8.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder8);

  const creditReservesOrder9 = new CreditReserveOrder();
  creditReservesOrder9.branchCode = '303';
  creditReservesOrder9.accountCode = '100003';
  creditReservesOrder9.brandCode = '5613807';
  creditReservesOrder9.orderAmount = 9000;
  creditReservesOrder9.accountType = 0;
  creditReservesOrder9.creditReservesId = ++creditReservesId;
  creditReservesOrder9.orderDate = orderDate7;
  creditReservesOrder9.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder9);

  const creditReservesOrder10 = new CreditReserveOrder();
  creditReservesOrder10.branchCode = '304';
  creditReservesOrder10.accountCode = '100004';
  creditReservesOrder10.brandCode = '5613802';
  creditReservesOrder10.orderAmount = 1000;
  creditReservesOrder10.accountType = 2;
  creditReservesOrder10.creditReservesId = ++creditReservesId;
  creditReservesOrder10.orderDate = orderDate7;
  creditReservesOrder10.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder10);

  const creditReservesOrder11 = new CreditReserveOrder();
  creditReservesOrder11.branchCode = '305';
  creditReservesOrder11.accountCode = '100005';
  creditReservesOrder11.brandCode = '5613803';
  creditReservesOrder11.orderAmount = 10000;
  creditReservesOrder11.accountType = 0;
  creditReservesOrder11.creditReservesId = ++creditReservesId;
  creditReservesOrder11.orderDate = orderDate8;
  creditReservesOrder11.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder11);

  const creditReservesOrder12 = new CreditReserveOrder();
  creditReservesOrder12.branchCode = '305';
  creditReservesOrder12.accountCode = '100005';
  creditReservesOrder12.brandCode = '5613806';
  creditReservesOrder12.orderAmount = 70000;
  creditReservesOrder12.accountType = 2;
  creditReservesOrder12.creditReservesId = ++creditReservesId;
  creditReservesOrder12.orderDate = orderDate7;
  creditReservesOrder12.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder12);

  const creditReservesOrder13 = new CreditReserveOrder();
  creditReservesOrder13.branchCode = '305';
  creditReservesOrder13.accountCode = '100005';
  creditReservesOrder13.brandCode = '5613802';
  creditReservesOrder13.orderAmount = 20000;
  creditReservesOrder13.accountType = 0;
  creditReservesOrder13.creditReservesId = ++creditReservesId;
  creditReservesOrder13.orderDate = orderDate7;
  creditReservesOrder13.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder13);

  const creditReservesOrder14 = new CreditReserveOrder();
  creditReservesOrder14.branchCode = '305';
  creditReservesOrder14.accountCode = '100005';
  creditReservesOrder14.brandCode = '5613805';
  creditReservesOrder14.orderAmount = 10000;
  creditReservesOrder14.accountType = 0;
  creditReservesOrder14.creditReservesId = ++creditReservesId;
  creditReservesOrder14.orderDate = orderDate8;
  creditReservesOrder14.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder14);

  const creditReservesOrder15 = new CreditReserveOrder();
  creditReservesOrder15.branchCode = '305';
  creditReservesOrder15.accountCode = '100005';
  creditReservesOrder15.brandCode = '5613804';
  creditReservesOrder15.orderAmount = 20000;
  creditReservesOrder15.accountType = 0;
  creditReservesOrder15.creditReservesId = ++creditReservesId;
  creditReservesOrder15.orderDate = orderDate7;
  creditReservesOrder15.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder15);

  const creditReservesOrder16 = new CreditReserveOrder();
  creditReservesOrder16.branchCode = '305';
  creditReservesOrder16.accountCode = '100005';
  creditReservesOrder16.brandCode = '5613811';
  creditReservesOrder16.orderAmount = 30000;
  creditReservesOrder16.accountType = 0;
  creditReservesOrder16.creditReservesId = ++creditReservesId;
  creditReservesOrder16.orderDate = orderDate8;
  creditReservesOrder16.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder16);

  const creditReservesOrder17 = new CreditReserveOrder();
  creditReservesOrder17.branchCode = '306';
  creditReservesOrder17.accountCode = '100006';
  creditReservesOrder17.brandCode = '5613805';
  creditReservesOrder17.orderAmount = 90000;
  creditReservesOrder17.accountType = 2;
  creditReservesOrder17.creditReservesId = ++creditReservesId;
  creditReservesOrder17.orderDate = orderDate8;
  creditReservesOrder17.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder17);

  const creditReservesOrder18 = new CreditReserveOrder();
  creditReservesOrder18.branchCode = '306';
  creditReservesOrder18.accountCode = '100006';
  creditReservesOrder18.brandCode = '5613806';
  creditReservesOrder18.orderAmount = 120000;
  creditReservesOrder18.accountType = 2;
  creditReservesOrder18.creditReservesId = ++creditReservesId;
  creditReservesOrder18.orderDate = orderDate7;
  creditReservesOrder18.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder18);

  const creditReservesOrder19 = new CreditReserveOrder();
  creditReservesOrder19.branchCode = '306';
  creditReservesOrder19.accountCode = '100006';
  creditReservesOrder19.brandCode = '5613802';
  creditReservesOrder19.orderAmount = 110000;
  creditReservesOrder19.accountType = 2;
  creditReservesOrder19.creditReservesId = ++creditReservesId;
  creditReservesOrder19.orderDate = orderDate7;
  creditReservesOrder19.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder19);

  const creditReservesOrder20 = new CreditReserveOrder();
  creditReservesOrder20.branchCode = '307';
  creditReservesOrder20.accountCode = '100007';
  creditReservesOrder20.brandCode = '5613807';
  creditReservesOrder20.orderAmount = 100000;
  creditReservesOrder20.accountType = 0;
  creditReservesOrder20.creditReservesId = ++creditReservesId;
  creditReservesOrder20.orderDate = orderDate7;
  creditReservesOrder20.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder20);

  const creditReservesOrder21 = new CreditReserveOrder();
  creditReservesOrder21.branchCode = '307';
  creditReservesOrder21.accountCode = '100007';
  creditReservesOrder21.brandCode = '5613803';
  creditReservesOrder21.orderAmount = 100000;
  creditReservesOrder21.accountType = 0;
  creditReservesOrder21.creditReservesId = ++creditReservesId;
  creditReservesOrder21.orderDate = orderDate8;
  creditReservesOrder21.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder21);

  const creditReservesOrder22 = new CreditReserveOrder();
  creditReservesOrder22.branchCode = '307';
  creditReservesOrder22.accountCode = '100007';
  creditReservesOrder22.brandCode = '5613804';
  creditReservesOrder22.orderAmount = 200000;
  creditReservesOrder22.accountType = 0;
  creditReservesOrder22.creditReservesId = ++creditReservesId;
  creditReservesOrder22.orderDate = orderDate7;
  creditReservesOrder22.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder22);

  const creditReservesOrder23 = new CreditReserveOrder();
  creditReservesOrder23.branchCode = '307';
  creditReservesOrder23.accountCode = '100007';
  creditReservesOrder23.brandCode = '5613808';
  creditReservesOrder23.orderAmount = 50000;
  creditReservesOrder23.accountType = 0;
  creditReservesOrder23.creditReservesId = ++creditReservesId;
  creditReservesOrder23.orderDate = orderDate8;
  creditReservesOrder23.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder23);

  const creditReservesOrder24 = new CreditReserveOrder();
  creditReservesOrder24.branchCode = '307';
  creditReservesOrder24.accountCode = '100007';
  creditReservesOrder24.brandCode = '5613811';
  creditReservesOrder24.orderAmount = 100000;
  creditReservesOrder24.accountType = 0;
  creditReservesOrder24.creditReservesId = ++creditReservesId;
  creditReservesOrder24.orderDate = orderDate8;
  creditReservesOrder24.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder24);

  const creditReservesOrder25 = new CreditReserveOrder();
  creditReservesOrder25.branchCode = '308';
  creditReservesOrder25.accountCode = '100008';
  creditReservesOrder25.brandCode = '5613808';
  creditReservesOrder25.orderAmount = 10000;
  creditReservesOrder25.accountType = 0;
  creditReservesOrder25.creditReservesId = ++creditReservesId;
  creditReservesOrder25.orderDate = orderDate8;
  creditReservesOrder25.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder25);

  const creditReservesOrder26 = new CreditReserveOrder();
  creditReservesOrder26.branchCode = '308';
  creditReservesOrder26.accountCode = '100008';
  creditReservesOrder26.brandCode = '5613809';
  creditReservesOrder26.orderAmount = 70000;
  creditReservesOrder26.accountType = 0;
  creditReservesOrder26.creditReservesId = ++creditReservesId;
  creditReservesOrder26.orderDate = orderDate7;
  creditReservesOrder26.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder26);

  const creditReservesOrder27 = new CreditReserveOrder();
  creditReservesOrder27.branchCode = '308';
  creditReservesOrder27.accountCode = '100008';
  creditReservesOrder27.brandCode = '5613801';
  creditReservesOrder27.orderAmount = 90000;
  creditReservesOrder27.accountType = 0;
  creditReservesOrder27.creditReservesId = ++creditReservesId;
  creditReservesOrder27.orderDate = orderDate8;
  creditReservesOrder27.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder27);

  const creditReservesOrder28 = new CreditReserveOrder();
  creditReservesOrder28.branchCode = '309';
  creditReservesOrder28.accountCode = '100009';
  creditReservesOrder28.brandCode = '5613801';
  creditReservesOrder28.orderAmount = 120000;
  creditReservesOrder28.accountType = 0;
  creditReservesOrder28.creditReservesId = ++creditReservesId;
  creditReservesOrder28.orderDate = orderDate8;
  creditReservesOrder28.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder28);

  const creditReservesOrder29 = new CreditReserveOrder();
  creditReservesOrder29.branchCode = '310';
  creditReservesOrder29.accountCode = '100010';
  creditReservesOrder29.brandCode = '5613809';
  creditReservesOrder29.orderAmount = 110000;
  creditReservesOrder29.accountType = 0;
  creditReservesOrder29.creditReservesId = ++creditReservesId;
  creditReservesOrder29.orderDate = orderDate7;
  creditReservesOrder29.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder29);

  const creditReservesOrder30 = new CreditReserveOrder();
  creditReservesOrder30.branchCode = '310';
  creditReservesOrder30.accountCode = '100010';
  creditReservesOrder30.brandCode = '5613801';
  creditReservesOrder30.orderAmount = 70000;
  creditReservesOrder30.accountType = 0;
  creditReservesOrder30.creditReservesId = ++creditReservesId;
  creditReservesOrder30.orderDate = orderDate8;
  creditReservesOrder30.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder30);

  const creditReservesOrder31 = new CreditReserveOrder();
  creditReservesOrder31.branchCode = '311';
  creditReservesOrder31.accountCode = '100011';
  creditReservesOrder31.brandCode = '5613801';
  creditReservesOrder31.orderAmount = 90000;
  creditReservesOrder31.accountType = 0;
  creditReservesOrder31.creditReservesId = ++creditReservesId;
  creditReservesOrder31.orderDate = orderDate8;
  creditReservesOrder31.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder31);

  const creditReservesOrder32 = new CreditReserveOrder();
  creditReservesOrder32.branchCode = '311';
  creditReservesOrder32.accountCode = '100011';
  creditReservesOrder32.brandCode = '5613807';
  creditReservesOrder32.orderAmount = 120000;
  creditReservesOrder32.accountType = 0;
  creditReservesOrder32.creditReservesId = ++creditReservesId;
  creditReservesOrder32.orderDate = orderDate7;
  creditReservesOrder32.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder32);

  const creditReservesOrder33 = new CreditReserveOrder();
  creditReservesOrder33.branchCode = '311';
  creditReservesOrder33.accountCode = '100011';
  creditReservesOrder33.brandCode = '5613802';
  creditReservesOrder33.orderAmount = 100000;
  creditReservesOrder33.accountType = 0;
  creditReservesOrder33.creditReservesId = ++creditReservesId;
  creditReservesOrder33.orderDate = orderDate7;
  creditReservesOrder33.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder33);

  const creditReservesOrder34 = new CreditReserveOrder();
  creditReservesOrder34.branchCode = '312';
  creditReservesOrder34.accountCode = '100012';
  creditReservesOrder34.brandCode = '5613802';
  creditReservesOrder34.orderAmount = 10000;
  creditReservesOrder34.accountType = 0;
  creditReservesOrder34.creditReservesId = ++creditReservesId;
  creditReservesOrder34.orderDate = orderDate7;
  creditReservesOrder34.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder34);

  const creditReservesOrder35 = new CreditReserveOrder();
  creditReservesOrder35.branchCode = '313';
  creditReservesOrder35.accountCode = '100013';
  creditReservesOrder35.brandCode = '5613801';
  creditReservesOrder35.orderAmount = 60000;
  creditReservesOrder35.accountType = 2;
  creditReservesOrder35.creditReservesId = ++creditReservesId;
  creditReservesOrder35.orderDate = orderDate8;
  creditReservesOrder35.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder35);

  const creditReservesOrder36 = new CreditReserveOrder();
  creditReservesOrder36.branchCode = '313';
  creditReservesOrder36.accountCode = '100013';
  creditReservesOrder36.brandCode = '5613803';
  creditReservesOrder36.orderAmount = 50000;
  creditReservesOrder36.accountType = 2;
  creditReservesOrder36.creditReservesId = ++creditReservesId;
  creditReservesOrder36.orderDate = orderDate8;
  creditReservesOrder36.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder36);

  const creditReservesOrder37 = new CreditReserveOrder();
  creditReservesOrder37.branchCode = '313';
  creditReservesOrder37.accountCode = '100013';
  creditReservesOrder37.brandCode = '5613811';
  creditReservesOrder37.orderAmount = 90000;
  creditReservesOrder37.accountType = 2;
  creditReservesOrder37.creditReservesId = ++creditReservesId;
  creditReservesOrder37.orderDate = orderDate8;
  creditReservesOrder37.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder37);

  const creditReservesOrder38 = new CreditReserveOrder();
  creditReservesOrder38.branchCode = '313';
  creditReservesOrder38.accountCode = '100013';
  creditReservesOrder38.brandCode = '5613808';
  creditReservesOrder38.orderAmount = 20000;
  creditReservesOrder38.accountType = 2;
  creditReservesOrder38.creditReservesId = ++creditReservesId;
  creditReservesOrder38.orderDate = orderDate8;
  creditReservesOrder38.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder38);

  const creditReservesOrder39 = new CreditReserveOrder();
  creditReservesOrder39.branchCode = '314';
  creditReservesOrder39.accountCode = '100014';
  creditReservesOrder39.brandCode = '5613801';
  creditReservesOrder39.orderAmount = 100000;
  creditReservesOrder39.accountType = 2;
  creditReservesOrder39.creditReservesId = ++creditReservesId;
  creditReservesOrder39.orderDate = orderDate8;
  creditReservesOrder39.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder39);

  const creditReservesOrder40 = new CreditReserveOrder();
  creditReservesOrder40.branchCode = '314';
  creditReservesOrder40.accountCode = '100014';
  creditReservesOrder40.brandCode = '5613803';
  creditReservesOrder40.orderAmount = 20000;
  creditReservesOrder40.accountType = 2;
  creditReservesOrder40.creditReservesId = ++creditReservesId;
  creditReservesOrder40.orderDate = orderDate8;
  creditReservesOrder40.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder40);

  const creditReservesOrder41 = new CreditReserveOrder();
  creditReservesOrder41.branchCode = '314';
  creditReservesOrder41.accountCode = '100014';
  creditReservesOrder41.brandCode = '5613811';
  creditReservesOrder41.orderAmount = 20000;
  creditReservesOrder41.accountType = 2;
  creditReservesOrder41.creditReservesId = ++creditReservesId;
  creditReservesOrder41.orderDate = orderDate8;
  creditReservesOrder41.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder41);

  const creditReservesOrder42 = new CreditReserveOrder();
  creditReservesOrder42.branchCode = '314';
  creditReservesOrder42.accountCode = '100014';
  creditReservesOrder42.brandCode = '5613808';
  creditReservesOrder42.orderAmount = 200000;
  creditReservesOrder42.accountType = 2;
  creditReservesOrder42.creditReservesId = ++creditReservesId;
  creditReservesOrder42.orderDate = orderDate8;
  creditReservesOrder42.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder42);

  const creditReservesOrder43 = new CreditReserveOrder();
  creditReservesOrder43.branchCode = '315';
  creditReservesOrder43.accountCode = '100015';
  creditReservesOrder43.brandCode = '5613801';
  creditReservesOrder43.orderAmount = 60000;
  creditReservesOrder43.accountType = 2;
  creditReservesOrder43.creditReservesId = ++creditReservesId;
  creditReservesOrder43.orderDate = orderDate8;
  creditReservesOrder43.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder43);

  const creditReservesOrder44 = new CreditReserveOrder();
  creditReservesOrder44.branchCode = '315';
  creditReservesOrder44.accountCode = '100015';
  creditReservesOrder44.brandCode = '5613803';
  creditReservesOrder44.orderAmount = 50000;
  creditReservesOrder44.accountType = 2;
  creditReservesOrder44.creditReservesId = ++creditReservesId;
  creditReservesOrder44.orderDate = orderDate8;
  creditReservesOrder44.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder44);

  const creditReservesOrder45 = new CreditReserveOrder();
  creditReservesOrder45.branchCode = '315';
  creditReservesOrder45.accountCode = '100015';
  creditReservesOrder45.brandCode = '5613811';
  creditReservesOrder45.orderAmount = 90000;
  creditReservesOrder45.accountType = 0;
  creditReservesOrder45.creditReservesId = ++creditReservesId;
  creditReservesOrder45.orderDate = orderDate8;
  creditReservesOrder45.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder45);

  const creditReservesOrder46 = new CreditReserveOrder();
  creditReservesOrder46.branchCode = '315';
  creditReservesOrder46.accountCode = '100015';
  creditReservesOrder46.brandCode = '5613808';
  creditReservesOrder46.orderAmount = 20000;
  creditReservesOrder46.accountType = 2;
  creditReservesOrder46.creditReservesId = ++creditReservesId;
  creditReservesOrder46.orderDate = orderDate8;
  creditReservesOrder46.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder46);

  const creditReservesOrder47 = new CreditReserveOrder();
  creditReservesOrder47.branchCode = '316';
  creditReservesOrder47.accountCode = '100016';
  creditReservesOrder47.brandCode = '5613801';
  creditReservesOrder47.orderAmount = 100000;
  creditReservesOrder47.accountType = 0;
  creditReservesOrder47.creditReservesId = ++creditReservesId;
  creditReservesOrder47.orderDate = orderDate8;
  creditReservesOrder47.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder47);

  const creditReservesOrder48 = new CreditReserveOrder();
  creditReservesOrder48.branchCode = '316';
  creditReservesOrder48.accountCode = '100016';
  creditReservesOrder48.brandCode = '5613803';
  creditReservesOrder48.orderAmount = 20000;
  creditReservesOrder48.accountType = 2;
  creditReservesOrder48.creditReservesId = ++creditReservesId;
  creditReservesOrder48.orderDate = orderDate8;
  creditReservesOrder48.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder48);

  const creditReservesOrder49 = new CreditReserveOrder();
  creditReservesOrder49.branchCode = '316';
  creditReservesOrder49.accountCode = '100016';
  creditReservesOrder49.brandCode = '5613811';
  creditReservesOrder49.orderAmount = 20000;
  creditReservesOrder49.accountType = 0;
  creditReservesOrder49.creditReservesId = ++creditReservesId;
  creditReservesOrder49.orderDate = orderDate8;
  creditReservesOrder49.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder49);

  const creditReservesOrder50 = new CreditReserveOrder();
  creditReservesOrder50.branchCode = '316';
  creditReservesOrder50.accountCode = '100016';
  creditReservesOrder50.brandCode = '5613808';
  creditReservesOrder50.orderAmount = 200000;
  creditReservesOrder50.accountType = 2;
  creditReservesOrder50.creditReservesId = ++creditReservesId;
  creditReservesOrder50.orderDate = orderDate8;
  creditReservesOrder50.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder50);

  const creditReservesOrder51 = new CreditReserveOrder();
  creditReservesOrder51.branchCode = '317';
  creditReservesOrder51.accountCode = '100017';
  creditReservesOrder51.brandCode = '5613801';
  creditReservesOrder51.orderAmount = 10000;
  creditReservesOrder51.accountType = 2;
  creditReservesOrder51.creditReservesId = ++creditReservesId;
  creditReservesOrder51.orderDate = orderDate8;
  creditReservesOrder51.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder51);

  const creditReservesOrder52 = new CreditReserveOrder();
  creditReservesOrder52.branchCode = '317';
  creditReservesOrder52.accountCode = '100017';
  creditReservesOrder52.brandCode = '5613803';
  creditReservesOrder52.orderAmount = 20000;
  creditReservesOrder52.accountType = 0;
  creditReservesOrder52.creditReservesId = ++creditReservesId;
  creditReservesOrder52.orderDate = orderDate8;
  creditReservesOrder52.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder52);

  const creditReservesOrder53 = new CreditReserveOrder();
  creditReservesOrder53.branchCode = '317';
  creditReservesOrder53.accountCode = '100017';
  creditReservesOrder53.brandCode = '5613811';
  creditReservesOrder53.orderAmount = 100000;
  creditReservesOrder53.accountType = 2;
  creditReservesOrder53.creditReservesId = ++creditReservesId;
  creditReservesOrder53.orderDate = orderDate8;
  creditReservesOrder53.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder53);

  const creditReservesOrder54 = new CreditReserveOrder();
  creditReservesOrder54.branchCode = '317';
  creditReservesOrder54.accountCode = '100017';
  creditReservesOrder54.brandCode = '5613808';
  creditReservesOrder54.orderAmount = 20000;
  creditReservesOrder54.accountType = 2;
  creditReservesOrder54.creditReservesId = ++creditReservesId;
  creditReservesOrder54.orderDate = orderDate8;
  creditReservesOrder54.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder54);

  const creditReservesOrder55 = new CreditReserveOrder();
  creditReservesOrder55.branchCode = '318';
  creditReservesOrder55.accountCode = '100018';
  creditReservesOrder55.brandCode = '5613801';
  creditReservesOrder55.orderAmount = 60000;
  creditReservesOrder55.accountType = 2;
  creditReservesOrder55.creditReservesId = ++creditReservesId;
  creditReservesOrder55.orderDate = orderDate8;
  creditReservesOrder55.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder55);

  const creditReservesOrder56 = new CreditReserveOrder();
  creditReservesOrder56.branchCode = '318';
  creditReservesOrder56.accountCode = '100018';
  creditReservesOrder56.brandCode = '5613803';
  creditReservesOrder56.orderAmount = 90000;
  creditReservesOrder56.accountType = 2;
  creditReservesOrder56.creditReservesId = ++creditReservesId;
  creditReservesOrder56.orderDate = orderDate8;
  creditReservesOrder56.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder56);

  const creditReservesOrder57 = new CreditReserveOrder();
  creditReservesOrder57.branchCode = '318';
  creditReservesOrder57.accountCode = '100018';
  creditReservesOrder57.brandCode = '5613811';
  creditReservesOrder57.orderAmount = 200000;
  creditReservesOrder57.accountType = 0;
  creditReservesOrder57.creditReservesId = ++creditReservesId;
  creditReservesOrder57.orderDate = orderDate8;
  creditReservesOrder57.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder57);

  const creditReservesOrder58 = new CreditReserveOrder();
  creditReservesOrder58.branchCode = '318';
  creditReservesOrder58.accountCode = '100018';
  creditReservesOrder58.brandCode = '5613808';
  creditReservesOrder58.orderAmount = 200000;
  creditReservesOrder58.accountType = 2;
  creditReservesOrder58.creditReservesId = ++creditReservesId;
  creditReservesOrder58.orderDate = orderDate8;
  creditReservesOrder58.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder58);

  const creditReservesOrder59 = new CreditReserveOrder();
  creditReservesOrder59.branchCode = '319';
  creditReservesOrder59.accountCode = '100019';
  creditReservesOrder59.brandCode = '5613801';
  creditReservesOrder59.orderAmount = 50000;
  creditReservesOrder59.accountType = 2;
  creditReservesOrder59.creditReservesId = ++creditReservesId;
  creditReservesOrder59.orderDate = orderDate8;
  creditReservesOrder59.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder59);

  const creditReservesOrder60 = new CreditReserveOrder();
  creditReservesOrder60.branchCode = '319';
  creditReservesOrder60.accountCode = '100019';
  creditReservesOrder60.brandCode = '5613803';
  creditReservesOrder60.orderAmount = 100000;
  creditReservesOrder60.accountType = 0;
  creditReservesOrder60.creditReservesId = ++creditReservesId;
  creditReservesOrder60.orderDate = orderDate8;
  creditReservesOrder60.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder60);

  const creditReservesOrder61 = new CreditReserveOrder();
  creditReservesOrder61.branchCode = '319';
  creditReservesOrder61.accountCode = '100019';
  creditReservesOrder61.brandCode = '5613811';
  creditReservesOrder61.orderAmount = 200000;
  creditReservesOrder61.accountType = 2;
  creditReservesOrder61.creditReservesId = ++creditReservesId;
  creditReservesOrder61.orderDate = orderDate8;
  creditReservesOrder61.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder61);

  const creditReservesOrder62 = new CreditReserveOrder();
  creditReservesOrder62.branchCode = '319';
  creditReservesOrder62.accountCode = '100019';
  creditReservesOrder62.brandCode = '5613808';
  creditReservesOrder62.orderAmount = 20000;
  creditReservesOrder62.accountType = 2;
  creditReservesOrder62.creditReservesId = ++creditReservesId;
  creditReservesOrder62.orderDate = orderDate8;
  creditReservesOrder62.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder62);

  const creditReservesOrder63 = new CreditReserveOrder();
  creditReservesOrder63.branchCode = '320';
  creditReservesOrder63.accountCode = '100020';
  creditReservesOrder63.brandCode = '5613801';
  creditReservesOrder63.orderAmount = 60000;
  creditReservesOrder63.accountType = 2;
  creditReservesOrder63.creditReservesId = ++creditReservesId;
  creditReservesOrder63.orderDate = orderDate8;
  creditReservesOrder63.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder63);

  const creditReservesOrder64 = new CreditReserveOrder();
  creditReservesOrder64.branchCode = '320';
  creditReservesOrder64.accountCode = '100020';
  creditReservesOrder64.brandCode = '5613803';
  creditReservesOrder64.orderAmount = 90000;
  creditReservesOrder64.accountType = 2;
  creditReservesOrder64.creditReservesId = ++creditReservesId;
  creditReservesOrder64.orderDate = orderDate8;
  creditReservesOrder64.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder64);

  const creditReservesOrder65 = new CreditReserveOrder();
  creditReservesOrder65.branchCode = '320';
  creditReservesOrder65.accountCode = '100020';
  creditReservesOrder65.brandCode = '5613811';
  creditReservesOrder65.orderAmount = 5000;
  creditReservesOrder65.accountType = 0;
  creditReservesOrder65.creditReservesId = ++creditReservesId;
  creditReservesOrder65.orderDate = orderDate8;
  creditReservesOrder65.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder65);

  const creditReservesOrder66 = new CreditReserveOrder();
  creditReservesOrder66.branchCode = '320';
  creditReservesOrder66.accountCode = '100020';
  creditReservesOrder66.brandCode = '5613808';
  creditReservesOrder66.orderAmount = 200000;
  creditReservesOrder66.accountType = 2;
  creditReservesOrder66.creditReservesId = ++creditReservesId;
  creditReservesOrder66.orderDate = orderDate8;
  creditReservesOrder66.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder66);

  const creditReservesOrder67 = new CreditReserveOrder();
  creditReservesOrder67.branchCode = '321';
  creditReservesOrder67.accountCode = '100021';
  creditReservesOrder67.brandCode = '5613803';
  creditReservesOrder67.orderAmount = 100000;
  creditReservesOrder67.accountType = 0;
  creditReservesOrder67.creditReservesId = ++creditReservesId;
  creditReservesOrder67.orderDate = orderDate8;
  creditReservesOrder67.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder67);

  const creditReservesOrder68 = new CreditReserveOrder();
  creditReservesOrder68.branchCode = '321';
  creditReservesOrder68.accountCode = '100021';
  creditReservesOrder68.brandCode = '5613811';
  creditReservesOrder68.orderAmount = 200000;
  creditReservesOrder68.accountType = 2;
  creditReservesOrder68.creditReservesId = ++creditReservesId;
  creditReservesOrder68.orderDate = orderDate8;
  creditReservesOrder68.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder68);

  const creditReservesOrder69 = new CreditReserveOrder();
  creditReservesOrder69.branchCode = '321';
  creditReservesOrder69.accountCode = '100021';
  creditReservesOrder69.brandCode = '5613808';
  creditReservesOrder69.orderAmount = 20000;
  creditReservesOrder69.accountType = 2;
  creditReservesOrder69.creditReservesId = ++creditReservesId;
  creditReservesOrder69.orderDate = orderDate8;
  creditReservesOrder69.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder69);

  const creditReservesOrder70 = new CreditReserveOrder();
  creditReservesOrder70.branchCode = '321';
  creditReservesOrder70.accountCode = '100021';
  creditReservesOrder70.brandCode = '5613801';
  creditReservesOrder70.orderAmount = 60000;
  creditReservesOrder70.accountType = 2;
  creditReservesOrder70.creditReservesId = ++creditReservesId;
  creditReservesOrder70.orderDate = orderDate8;
  creditReservesOrder70.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder70);

  const creditReservesOrder71 = new CreditReserveOrder();
  creditReservesOrder71.branchCode = '322';
  creditReservesOrder71.accountCode = '100022';
  creditReservesOrder71.brandCode = '5613801';
  creditReservesOrder71.orderAmount = 100000;
  creditReservesOrder71.accountType = 2;
  creditReservesOrder71.creditReservesId = ++creditReservesId;
  creditReservesOrder71.orderDate = orderDate8;
  creditReservesOrder71.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder71);

  const creditReservesOrder72 = new CreditReserveOrder();
  creditReservesOrder72.branchCode = '322';
  creditReservesOrder72.accountCode = '100022';
  creditReservesOrder72.brandCode = '5613803';
  creditReservesOrder72.orderAmount = 100000;
  creditReservesOrder72.accountType = 0;
  creditReservesOrder72.creditReservesId = ++creditReservesId;
  creditReservesOrder72.orderDate = orderDate8;
  creditReservesOrder72.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder72);

  const creditReservesOrder73 = new CreditReserveOrder();
  creditReservesOrder73.branchCode = '322';
  creditReservesOrder73.accountCode = '100022';
  creditReservesOrder73.brandCode = '5613811';
  creditReservesOrder73.orderAmount = 100000;
  creditReservesOrder73.accountType = 2;
  creditReservesOrder73.creditReservesId = ++creditReservesId;
  creditReservesOrder73.orderDate = orderDate8;
  creditReservesOrder73.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder73);

  const creditReservesOrder74 = new CreditReserveOrder();
  creditReservesOrder74.branchCode = '322';
  creditReservesOrder74.accountCode = '100022';
  creditReservesOrder74.brandCode = '5613808';
  creditReservesOrder74.orderAmount = 100000;
  creditReservesOrder74.accountType = 2;
  creditReservesOrder74.creditReservesId = ++creditReservesId;
  creditReservesOrder74.orderDate = orderDate8;
  creditReservesOrder74.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder74);

  const creditReservesOrder75 = new CreditReserveOrder();
  creditReservesOrder75.branchCode = '323';
  creditReservesOrder75.accountCode = '100023';
  creditReservesOrder75.brandCode = '5613801';
  creditReservesOrder75.orderAmount = 60000;
  creditReservesOrder75.accountType = 2;
  creditReservesOrder75.creditReservesId = ++creditReservesId;
  creditReservesOrder75.orderDate = orderDate8;
  creditReservesOrder75.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder75);

  const creditReservesOrder76 = new CreditReserveOrder();
  creditReservesOrder76.branchCode = '323';
  creditReservesOrder76.accountCode = '100023';
  creditReservesOrder76.brandCode = '5613803';
  creditReservesOrder76.orderAmount = 10000;
  creditReservesOrder76.accountType = 2;
  creditReservesOrder76.creditReservesId = ++creditReservesId;
  creditReservesOrder76.orderDate = orderDate8;
  creditReservesOrder76.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder76);

  const creditReservesOrder77 = new CreditReserveOrder();
  creditReservesOrder77.branchCode = '323';
  creditReservesOrder77.accountCode = '100023';
  creditReservesOrder77.brandCode = '5613811';
  creditReservesOrder77.orderAmount = 10000;
  creditReservesOrder77.accountType = 0;
  creditReservesOrder77.creditReservesId = ++creditReservesId;
  creditReservesOrder77.orderDate = orderDate8;
  creditReservesOrder77.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder77);

  const creditReservesOrder78 = new CreditReserveOrder();
  creditReservesOrder78.branchCode = '323';
  creditReservesOrder78.accountCode = '100023';
  creditReservesOrder78.brandCode = '5613808';
  creditReservesOrder78.orderAmount = 200000;
  creditReservesOrder78.accountType = 2;
  creditReservesOrder78.creditReservesId = ++creditReservesId;
  creditReservesOrder78.orderDate = orderDate8;
  creditReservesOrder78.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder78);

  await CreditReserveOrder.save(creditReservesOrders);
}

/**
 * create SnrGlobalHoliday base on link data below
 * https://docs.google.com/spreadsheets/d/1lmq5a5LNJKadBeznC77PAtgBiHul5pBwG8YhuZ8RcP8/edit#gid=1987785313
 */
export async function createSnrGlobalHolidays() {
  const holiday = moment().year().toString() + moment().month().toString();
  const snrGlobalHolidayCalendarBcps = [];
  const snrGlobalHolidayCalendarBcp1 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp1.securityCode = '5613801';
  snrGlobalHolidayCalendarBcp1.holiday = holiday + '05';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp1);
  const snrGlobalHolidayCalendarBcp2 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp2.securityCode = '5613801';
  snrGlobalHolidayCalendarBcp2.holiday = holiday + '06';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp2);
  const snrGlobalHolidayCalendarBcp3 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp3.securityCode = '5613801';
  snrGlobalHolidayCalendarBcp3.holiday = holiday + '07';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp3);
  const snrGlobalHolidayCalendarBcp4 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp4.securityCode = '5613802';
  snrGlobalHolidayCalendarBcp4.holiday = holiday + '05';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp4);
  const snrGlobalHolidayCalendarBcp5 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp5.securityCode = '5613802';
  snrGlobalHolidayCalendarBcp5.holiday = holiday + '06';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp5);
  const snrGlobalHolidayCalendarBcp6 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp6.securityCode = '5613802';
  snrGlobalHolidayCalendarBcp6.holiday = holiday + '08';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp6);
  const snrGlobalHolidayCalendarBcp7 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp7.securityCode = '5613803';
  snrGlobalHolidayCalendarBcp7.holiday = holiday + '05';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp7);
  const snrGlobalHolidayCalendarBcp8 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp8.securityCode = '5613803';
  snrGlobalHolidayCalendarBcp8.holiday = holiday + '06';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp8);
  const snrGlobalHolidayCalendarBcp9 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp9.securityCode = '5613803';
  snrGlobalHolidayCalendarBcp9.holiday = holiday + '07';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp9);
  const snrGlobalHolidayCalendarBcp10 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp10.securityCode = '5613804';
  snrGlobalHolidayCalendarBcp10.holiday = holiday + '05';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp10);
  const snrGlobalHolidayCalendarBcp11 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp11.securityCode = '5613804';
  snrGlobalHolidayCalendarBcp11.holiday = holiday + '06';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp11);
  const snrGlobalHolidayCalendarBcp12 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp12.securityCode = '5613804';
  snrGlobalHolidayCalendarBcp12.holiday = holiday + '09';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp12);
  const snrGlobalHolidayCalendarBcp13 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp13.securityCode = '5613805';
  snrGlobalHolidayCalendarBcp13.holiday = holiday + '05';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp13);
  const snrGlobalHolidayCalendarBcp14 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp14.securityCode = '5613805';
  snrGlobalHolidayCalendarBcp14.holiday = holiday + '06';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp14);
  const snrGlobalHolidayCalendarBcp15 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp15.securityCode = '5613805';
  snrGlobalHolidayCalendarBcp15.holiday = holiday + '07';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp15);
  const snrGlobalHolidayCalendarBcp16 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp16.securityCode = '5613806';
  snrGlobalHolidayCalendarBcp16.holiday = holiday + '05';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp16);
  const snrGlobalHolidayCalendarBcp17 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp17.securityCode = '5613806';
  snrGlobalHolidayCalendarBcp17.holiday = holiday + '06';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp17);
  const snrGlobalHolidayCalendarBcp18 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp18.securityCode = '5613807';
  snrGlobalHolidayCalendarBcp18.holiday = holiday + '05';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp18);
  const snrGlobalHolidayCalendarBcp19 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp19.securityCode = '5613807';
  snrGlobalHolidayCalendarBcp19.holiday = holiday + '06';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp19);
  const snrGlobalHolidayCalendarBcp20 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp20.securityCode = '5613808';
  snrGlobalHolidayCalendarBcp20.holiday = holiday + '05';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp20);
  const snrGlobalHolidayCalendarBcp21 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp21.securityCode = '5613808';
  snrGlobalHolidayCalendarBcp21.holiday = holiday + '06';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp21);
  const snrGlobalHolidayCalendarBcp22 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp22.securityCode = '5613808';
  snrGlobalHolidayCalendarBcp22.holiday = holiday + '07';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp22);
  const snrGlobalHolidayCalendarBcp23 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp23.securityCode = '5613809';
  snrGlobalHolidayCalendarBcp23.holiday = holiday + '05';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp23);
  const snrGlobalHolidayCalendarBcp24 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp24.securityCode = '5613809';
  snrGlobalHolidayCalendarBcp24.holiday = holiday + '06';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp24);
  const snrGlobalHolidayCalendarBcp25 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp25.securityCode = '5613809';
  snrGlobalHolidayCalendarBcp25.holiday = holiday + '09';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp25);
  const snrGlobalHolidayCalendarBcp26 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp26.securityCode = '5613810';
  snrGlobalHolidayCalendarBcp26.holiday = holiday + '05';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp26);
  const snrGlobalHolidayCalendarBcp27 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp27.securityCode = '5613810';
  snrGlobalHolidayCalendarBcp27.holiday = holiday + '06';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp27);
  const snrGlobalHolidayCalendarBcp28 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp28.securityCode = '5613811';
  snrGlobalHolidayCalendarBcp28.holiday = holiday + '05';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp28);
  const snrGlobalHolidayCalendarBcp29 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp29.securityCode = '5613811';
  snrGlobalHolidayCalendarBcp29.holiday = holiday + '06';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp29);
  const snrGlobalHolidayCalendarBcp30 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp30.securityCode = '5613811';
  snrGlobalHolidayCalendarBcp30.holiday = holiday + '07';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp30);

  await SnrGlobalHolidayCalendarBcp.save(snrGlobalHolidayCalendarBcps);
}

/**
 * create CreditCardInfo base on link data below
 * https://docs.google.com/spreadsheets/d/1lmq5a5LNJKadBeznC77PAtgBiHul5pBwG8YhuZ8RcP8/edit#gid=1987785313
 */
export async function createCreditCardInfo() {
  const creditCardInfos = [];
  const creditCardInfo1 = new CreditCardInfo();
  creditCardInfo1.branchCode = '301';
  creditCardInfo1.accountCode = '100001';
  creditCardInfo1.invalidFlg = Boolean(0);
  creditCardInfos.push(creditCardInfo1);

  const creditCardInfo2 = new CreditCardInfo();
  creditCardInfo2.branchCode = '302';
  creditCardInfo2.accountCode = '100002';
  creditCardInfo2.invalidFlg = Boolean(0);
  creditCardInfos.push(creditCardInfo2);

  const creditCardInfo3 = new CreditCardInfo();
  creditCardInfo3.branchCode = '303';
  creditCardInfo3.accountCode = '100003';
  creditCardInfo3.invalidFlg = Boolean(1);
  creditCardInfos.push(creditCardInfo3);

  const creditCardInfo4 = new CreditCardInfo();
  creditCardInfo4.branchCode = '304';
  creditCardInfo4.accountCode = '100004';
  creditCardInfo4.invalidFlg = Boolean(0);
  creditCardInfos.push(creditCardInfo4);

  const creditCardInfo5 = new CreditCardInfo();
  creditCardInfo5.branchCode = '305';
  creditCardInfo5.accountCode = '100005';
  creditCardInfo5.invalidFlg = Boolean(0);
  creditCardInfos.push(creditCardInfo5);

  const creditCardInfo6 = new CreditCardInfo();
  creditCardInfo6.branchCode = '306';
  creditCardInfo6.accountCode = '100006';
  creditCardInfo6.invalidFlg = Boolean(0);
  creditCardInfos.push(creditCardInfo6);

  const creditCardInfo7 = new CreditCardInfo();
  creditCardInfo7.branchCode = '307';
  creditCardInfo7.accountCode = '100007';
  creditCardInfo7.invalidFlg = Boolean(0);
  creditCardInfos.push(creditCardInfo7);

  const creditCardInfo8 = new CreditCardInfo();
  creditCardInfo8.branchCode = '308';
  creditCardInfo8.accountCode = '100008';
  creditCardInfo8.invalidFlg = Boolean(0);
  creditCardInfos.push(creditCardInfo8);

  const creditCardInfo9 = new CreditCardInfo();
  creditCardInfo9.branchCode = '309';
  creditCardInfo9.accountCode = '100009';
  creditCardInfo9.invalidFlg = Boolean(0);
  creditCardInfos.push(creditCardInfo9);

  const creditCardInfo10 = new CreditCardInfo();
  creditCardInfo10.branchCode = '310';
  creditCardInfo10.accountCode = '100010';
  creditCardInfo10.invalidFlg = Boolean(0);
  creditCardInfos.push(creditCardInfo10);

  const creditCardInfo11 = new CreditCardInfo();
  creditCardInfo11.branchCode = '311';
  creditCardInfo11.accountCode = '100011';
  creditCardInfo11.invalidFlg = Boolean(0);
  creditCardInfos.push(creditCardInfo11);

  const creditCardInfo12 = new CreditCardInfo();
  creditCardInfo12.branchCode = '312';
  creditCardInfo12.accountCode = '100012';
  creditCardInfo12.invalidFlg = Boolean(1);
  creditCardInfos.push(creditCardInfo12);

  const creditCardInfo13 = new CreditCardInfo();
  creditCardInfo13.branchCode = '313';
  creditCardInfo13.accountCode = '100013';
  creditCardInfo13.invalidFlg = Boolean(0);
  creditCardInfos.push(creditCardInfo13);

  const creditCardInfo14 = new CreditCardInfo();
  creditCardInfo14.branchCode = '314';
  creditCardInfo14.accountCode = '100014';
  creditCardInfo14.invalidFlg = Boolean(0);
  creditCardInfos.push(creditCardInfo14);

  const creditCardInfo15 = new CreditCardInfo();
  creditCardInfo15.branchCode = '315';
  creditCardInfo15.accountCode = '100015';
  creditCardInfo15.invalidFlg = Boolean(0);
  creditCardInfos.push(creditCardInfo15);

  const creditCardInfo16 = new CreditCardInfo();
  creditCardInfo16.branchCode = '316';
  creditCardInfo16.accountCode = '100016';
  creditCardInfo16.invalidFlg = Boolean(0);
  creditCardInfos.push(creditCardInfo16);

  const creditCardInfo17 = new CreditCardInfo();
  creditCardInfo17.branchCode = '317';
  creditCardInfo17.accountCode = '100017';
  creditCardInfo17.invalidFlg = Boolean(0);
  creditCardInfos.push(creditCardInfo17);

  const creditCardInfo18 = new CreditCardInfo();
  creditCardInfo18.branchCode = '318';
  creditCardInfo18.accountCode = '100018';
  creditCardInfo18.invalidFlg = Boolean(0);
  creditCardInfos.push(creditCardInfo18);

  const creditCardInfo19 = new CreditCardInfo();
  creditCardInfo19.branchCode = '319';
  creditCardInfo19.accountCode = '100019';
  creditCardInfo19.invalidFlg = Boolean(0);
  creditCardInfos.push(creditCardInfo19);

  const creditCardInfo20 = new CreditCardInfo();
  creditCardInfo20.branchCode = '320';
  creditCardInfo20.accountCode = '100020';
  creditCardInfo20.invalidFlg = Boolean(0);
  creditCardInfos.push(creditCardInfo20);

  const creditCardInfo21 = new CreditCardInfo();
  creditCardInfo21.branchCode = '321';
  creditCardInfo21.accountCode = '100021';
  creditCardInfo21.invalidFlg = Boolean(0);
  creditCardInfos.push(creditCardInfo21);

  const creditCardInfo22 = new CreditCardInfo();
  creditCardInfo22.branchCode = '322';
  creditCardInfo22.accountCode = '100022';
  creditCardInfo22.invalidFlg = Boolean(0);
  creditCardInfos.push(creditCardInfo22);

  const creditCardInfo23 = new CreditCardInfo();
  creditCardInfo23.branchCode = '323';
  creditCardInfo23.accountCode = '100023';
  creditCardInfo23.invalidFlg = Boolean(0);
  creditCardInfos.push(creditCardInfo23);

  await CreditCardInfo.save(creditCardInfos);
}

/**
 * create snrCustomer base on link data below
 * https://docs.google.com/spreadsheets/d/1lmq5a5LNJKadBeznC77PAtgBiHul5pBwG8YhuZ8RcP8/edit#gid=1987785313
 */
export async function createsnrCustomers() {
  const snrCustomers = [];
  const snrCustomer1 = new SnrCustomerMstBcp();
  snrCustomer1.officeCode = '301';
  snrCustomer1.customerCode = '100001';
  snrCustomer1.yCustomerType = '0';
  snrCustomers.push(snrCustomer1);

  const snrCustomer2 = new SnrCustomerMstBcp();
  snrCustomer2.officeCode = '302';
  snrCustomer2.customerCode = '100002';
  snrCustomer2.yCustomerType = '0';
  snrCustomers.push(snrCustomer2);

  const snrCustomer3 = new SnrCustomerMstBcp();
  snrCustomer3.officeCode = '303';
  snrCustomer3.customerCode = '100003';
  snrCustomer3.yCustomerType = '0';
  snrCustomers.push(snrCustomer3);

  const snrCustomer4 = new SnrCustomerMstBcp();
  snrCustomer4.officeCode = '304';
  snrCustomer4.customerCode = '100004';
  snrCustomer4.yCustomerType = '0';
  snrCustomers.push(snrCustomer4);

  const snrCustomer5 = new SnrCustomerMstBcp();
  snrCustomer5.officeCode = '305';
  snrCustomer5.customerCode = '100005';
  snrCustomer5.yCustomerType = '0';
  snrCustomers.push(snrCustomer5);

  const snrCustomer6 = new SnrCustomerMstBcp();
  snrCustomer6.officeCode = '306';
  snrCustomer6.customerCode = '100006';
  snrCustomer6.yCustomerType = '0';
  snrCustomers.push(snrCustomer6);

  const snrCustomer7 = new SnrCustomerMstBcp();
  snrCustomer7.officeCode = '307';
  snrCustomer7.customerCode = '100007';
  snrCustomer7.yCustomerType = '0';
  snrCustomers.push(snrCustomer7);

  const snrCustomer8 = new SnrCustomerMstBcp();
  snrCustomer8.officeCode = '308';
  snrCustomer8.customerCode = '100008';
  snrCustomer8.yCustomerType = '0';
  snrCustomers.push(snrCustomer8);

  const snrCustomer9 = new SnrCustomerMstBcp();
  snrCustomer9.officeCode = '309';
  snrCustomer9.customerCode = '100009';
  snrCustomer9.yCustomerType = '0';
  snrCustomers.push(snrCustomer9);

  const snrCustomer10 = new SnrCustomerMstBcp();
  snrCustomer10.officeCode = '310';
  snrCustomer10.customerCode = '100010';
  snrCustomer10.yCustomerType = '0';
  snrCustomers.push(snrCustomer10);

  const snrCustomer11 = new SnrCustomerMstBcp();
  snrCustomer11.officeCode = '311';
  snrCustomer11.customerCode = '100011';
  snrCustomer11.yCustomerType = '0';
  snrCustomers.push(snrCustomer11);

  const snrCustomer12 = new SnrCustomerMstBcp();
  snrCustomer12.officeCode = '312';
  snrCustomer12.customerCode = '100012';
  snrCustomer12.yCustomerType = '1';
  snrCustomers.push(snrCustomer12);

  const snrCustomer13 = new SnrCustomerMstBcp();
  snrCustomer13.officeCode = '313';
  snrCustomer13.customerCode = '100013';
  snrCustomer13.yCustomerType = '0';
  snrCustomers.push(snrCustomer13);

  const snrCustomer14 = new SnrCustomerMstBcp();
  snrCustomer14.officeCode = '314';
  snrCustomer14.customerCode = '100014';
  snrCustomer14.yCustomerType = '0';
  snrCustomers.push(snrCustomer14);

  const snrCustomer15 = new SnrCustomerMstBcp();
  snrCustomer15.officeCode = '315';
  snrCustomer15.customerCode = '100015';
  snrCustomer15.yCustomerType = '0';
  snrCustomers.push(snrCustomer15);

  const snrCustomer16 = new SnrCustomerMstBcp();
  snrCustomer16.officeCode = '316';
  snrCustomer16.customerCode = '100016';
  snrCustomer16.yCustomerType = '0';
  snrCustomers.push(snrCustomer16);

  const snrCustomer17 = new SnrCustomerMstBcp();
  snrCustomer17.officeCode = '317';
  snrCustomer17.customerCode = '100017';
  snrCustomer17.yCustomerType = '0';
  snrCustomers.push(snrCustomer17);

  const snrCustomer18 = new SnrCustomerMstBcp();
  snrCustomer18.officeCode = '318';
  snrCustomer18.customerCode = '100018';
  snrCustomer18.yCustomerType = '0';
  snrCustomers.push(snrCustomer18);

  const snrCustomer19 = new SnrCustomerMstBcp();
  snrCustomer19.officeCode = '319';
  snrCustomer19.customerCode = '100019';
  snrCustomer19.yCustomerType = '0';
  snrCustomers.push(snrCustomer19);

  const snrCustomer20 = new SnrCustomerMstBcp();
  snrCustomer20.officeCode = '320';
  snrCustomer20.customerCode = '100020';
  snrCustomer20.yCustomerType = '0';
  snrCustomers.push(snrCustomer20);

  const snrCustomer21 = new SnrCustomerMstBcp();
  snrCustomer21.officeCode = '321';
  snrCustomer21.customerCode = '100021';
  snrCustomer21.yCustomerType = '0';
  snrCustomers.push(snrCustomer21);

  const snrCustomer22 = new SnrCustomerMstBcp();
  snrCustomer22.officeCode = '322';
  snrCustomer22.customerCode = '100022';
  snrCustomer22.yCustomerType = '0';
  snrCustomers.push(snrCustomer22);

  const snrCustomer23 = new SnrCustomerMstBcp();
  snrCustomer23.officeCode = '323';
  snrCustomer23.customerCode = '100023';
  snrCustomer23.yCustomerType = '0';
  snrCustomers.push(snrCustomer23);

  await SnrCustomerMstBcp.save(snrCustomers);
}

/**
 * create SnrOrderLock base on link data below
 * https://docs.google.com/spreadsheets/d/1lmq5a5LNJKadBeznC77PAtgBiHul5pBwG8YhuZ8RcP8/edit#gid=1987785313
 */
export async function createSnrOrderLocks() {
  const snrOrderLockInfoBcps = [];

  const snrOrderLockInfoBcp1 = new SnrOrderLockInfoBcp();
  snrOrderLockInfoBcp1.officeCode = '301';
  snrOrderLockInfoBcp1.customerCode = '100001';
  snrOrderLockInfoBcp1.branchLock = '0';
  snrOrderLockInfoBcps.push(snrOrderLockInfoBcp1);

  const snrOrderLockInfoBcp2 = new SnrOrderLockInfoBcp();
  snrOrderLockInfoBcp2.officeCode = '302';
  snrOrderLockInfoBcp2.customerCode = '100002';
  snrOrderLockInfoBcp2.branchLock = '0';
  snrOrderLockInfoBcps.push(snrOrderLockInfoBcp2);

  const snrOrderLockInfoBcp3 = new SnrOrderLockInfoBcp();
  snrOrderLockInfoBcp3.officeCode = '303';
  snrOrderLockInfoBcp3.customerCode = '100003';
  snrOrderLockInfoBcp3.branchLock = '0';
  snrOrderLockInfoBcps.push(snrOrderLockInfoBcp3);

  const snrOrderLockInfoBcp4 = new SnrOrderLockInfoBcp();
  snrOrderLockInfoBcp4.officeCode = '304';
  snrOrderLockInfoBcp4.customerCode = '100004';
  snrOrderLockInfoBcp4.branchLock = '0';
  snrOrderLockInfoBcps.push(snrOrderLockInfoBcp4);

  const snrOrderLockInfoBcp5 = new SnrOrderLockInfoBcp();
  snrOrderLockInfoBcp5.officeCode = '305';
  snrOrderLockInfoBcp5.customerCode = '100005';
  snrOrderLockInfoBcp5.branchLock = '0';
  snrOrderLockInfoBcps.push(snrOrderLockInfoBcp5);

  const snrOrderLockInfoBcp6 = new SnrOrderLockInfoBcp();
  snrOrderLockInfoBcp6.officeCode = '306';
  snrOrderLockInfoBcp6.customerCode = '100006';
  snrOrderLockInfoBcp6.branchLock = '0';
  snrOrderLockInfoBcps.push(snrOrderLockInfoBcp6);

  const snrOrderLockInfoBcp7 = new SnrOrderLockInfoBcp();
  snrOrderLockInfoBcp7.officeCode = '307';
  snrOrderLockInfoBcp7.customerCode = '100007';
  snrOrderLockInfoBcp7.branchLock = '0';
  snrOrderLockInfoBcps.push(snrOrderLockInfoBcp7);

  const snrOrderLockInfoBcp8 = new SnrOrderLockInfoBcp();
  snrOrderLockInfoBcp8.officeCode = '308';
  snrOrderLockInfoBcp8.customerCode = '100008';
  snrOrderLockInfoBcp8.branchLock = '0';
  snrOrderLockInfoBcps.push(snrOrderLockInfoBcp8);

  const snrOrderLockInfoBcp9 = new SnrOrderLockInfoBcp();
  snrOrderLockInfoBcp9.officeCode = '309';
  snrOrderLockInfoBcp9.customerCode = '100009';
  snrOrderLockInfoBcp9.branchLock = '0';
  snrOrderLockInfoBcps.push(snrOrderLockInfoBcp9);

  const snrOrderLockInfoBcp10 = new SnrOrderLockInfoBcp();
  snrOrderLockInfoBcp10.officeCode = '310';
  snrOrderLockInfoBcp10.customerCode = '100010';
  snrOrderLockInfoBcp10.branchLock = '0';
  snrOrderLockInfoBcps.push(snrOrderLockInfoBcp10);

  const snrOrderLockInfoBcp11 = new SnrOrderLockInfoBcp();
  snrOrderLockInfoBcp11.officeCode = '311';
  snrOrderLockInfoBcp11.customerCode = '100011';
  snrOrderLockInfoBcp11.branchLock = '0';
  snrOrderLockInfoBcps.push(snrOrderLockInfoBcp11);

  const snrOrderLockInfoBcp12 = new SnrOrderLockInfoBcp();
  snrOrderLockInfoBcp12.officeCode = '312';
  snrOrderLockInfoBcp12.customerCode = '100012';
  snrOrderLockInfoBcp12.branchLock = '0';
  snrOrderLockInfoBcps.push(snrOrderLockInfoBcp12);

  const snrOrderLockInfoBcp13 = new SnrOrderLockInfoBcp();
  snrOrderLockInfoBcp13.officeCode = '313';
  snrOrderLockInfoBcp13.customerCode = '100013';
  snrOrderLockInfoBcp13.branchLock = '0';
  snrOrderLockInfoBcps.push(snrOrderLockInfoBcp13);

  const snrOrderLockInfoBcp14 = new SnrOrderLockInfoBcp();
  snrOrderLockInfoBcp14.officeCode = '314';
  snrOrderLockInfoBcp14.customerCode = '100014';
  snrOrderLockInfoBcp14.branchLock = '0';
  snrOrderLockInfoBcps.push(snrOrderLockInfoBcp14);

  const snrOrderLockInfoBcp15 = new SnrOrderLockInfoBcp();
  snrOrderLockInfoBcp15.officeCode = '315';
  snrOrderLockInfoBcp15.customerCode = '100015';
  snrOrderLockInfoBcp15.branchLock = '0';
  snrOrderLockInfoBcps.push(snrOrderLockInfoBcp15);

  const snrOrderLockInfoBcp16 = new SnrOrderLockInfoBcp();
  snrOrderLockInfoBcp16.officeCode = '316';
  snrOrderLockInfoBcp16.customerCode = '100016';
  snrOrderLockInfoBcp16.branchLock = '0';
  snrOrderLockInfoBcps.push(snrOrderLockInfoBcp16);

  const snrOrderLockInfoBcp17 = new SnrOrderLockInfoBcp();
  snrOrderLockInfoBcp17.officeCode = '317';
  snrOrderLockInfoBcp17.customerCode = '100017';
  snrOrderLockInfoBcp17.branchLock = '0';
  snrOrderLockInfoBcps.push(snrOrderLockInfoBcp17);

  const snrOrderLockInfoBcp18 = new SnrOrderLockInfoBcp();
  snrOrderLockInfoBcp18.officeCode = '318';
  snrOrderLockInfoBcp18.customerCode = '100018';
  snrOrderLockInfoBcp18.branchLock = '0';
  snrOrderLockInfoBcps.push(snrOrderLockInfoBcp18);

  const snrOrderLockInfoBcp19 = new SnrOrderLockInfoBcp();
  snrOrderLockInfoBcp19.officeCode = '319';
  snrOrderLockInfoBcp19.customerCode = '100019';
  snrOrderLockInfoBcp19.branchLock = '0';
  snrOrderLockInfoBcps.push(snrOrderLockInfoBcp19);

  const snrOrderLockInfoBcp20 = new SnrOrderLockInfoBcp();
  snrOrderLockInfoBcp20.officeCode = '320';
  snrOrderLockInfoBcp20.customerCode = '100020';
  snrOrderLockInfoBcp20.branchLock = '0';
  snrOrderLockInfoBcps.push(snrOrderLockInfoBcp20);

  const snrOrderLockInfoBcp21 = new SnrOrderLockInfoBcp();
  snrOrderLockInfoBcp21.officeCode = '321';
  snrOrderLockInfoBcp21.customerCode = '100021';
  snrOrderLockInfoBcp21.branchLock = '0';
  snrOrderLockInfoBcps.push(snrOrderLockInfoBcp21);

  const snrOrderLockInfoBcp22 = new SnrOrderLockInfoBcp();
  snrOrderLockInfoBcp22.officeCode = '322';
  snrOrderLockInfoBcp22.customerCode = '100022';
  snrOrderLockInfoBcp22.branchLock = '0';
  snrOrderLockInfoBcps.push(snrOrderLockInfoBcp22);

  const snrOrderLockInfoBcp23 = new SnrOrderLockInfoBcp();
  snrOrderLockInfoBcp23.officeCode = '323';
  snrOrderLockInfoBcp23.customerCode = '100023';
  snrOrderLockInfoBcp23.branchLock = '0';
  snrOrderLockInfoBcps.push(snrOrderLockInfoBcp23);

  await SnrOrderLockInfoBcp.save(snrOrderLockInfoBcps);
}

/**
 * create SnrCustomerAccountBalanceBcp base on link data below
 * https://docs.google.com/spreadsheets/d/1lmq5a5LNJKadBeznC77PAtgBiHul5pBwG8YhuZ8RcP8/edit#gid=1987785313
 */
export async function createSnrCustomerAccountBalanceBcps() {
  const snrCustomerAccountBalanceBcps = [];

  const snrCustomerAccountBalanceBcp1 = new SnrCustomerAccountBalanceBcp();
  snrCustomerAccountBalanceBcp1.officeCode = '301';
  snrCustomerAccountBalanceBcp1.customerCode = '100001';
  snrCustomerAccountBalanceBcp1.accountBalanceCurrentDate = '300';
  snrCustomerAccountBalanceBcp1.accountBalanceExecution = '-500';
  snrCustomerAccountBalanceBcp1.accountBalanceNextDate = '300';
  snrCustomerAccountBalanceBcp1.guarantyMoneyType = '1';
  snrCustomerAccountBalanceBcps.push(snrCustomerAccountBalanceBcp1);

  const snrCustomerAccountBalanceBcp2 = new SnrCustomerAccountBalanceBcp();
  snrCustomerAccountBalanceBcp2.officeCode = '302';
  snrCustomerAccountBalanceBcp2.customerCode = '100002';
  snrCustomerAccountBalanceBcp2.accountBalanceCurrentDate = '-200';
  snrCustomerAccountBalanceBcp2.accountBalanceExecution = '300';
  snrCustomerAccountBalanceBcp2.accountBalanceNextDate = '300';
  snrCustomerAccountBalanceBcp2.guarantyMoneyType = '1';
  snrCustomerAccountBalanceBcps.push(snrCustomerAccountBalanceBcp2);

  const snrCustomerAccountBalanceBcp3 = new SnrCustomerAccountBalanceBcp();
  snrCustomerAccountBalanceBcp3.officeCode = '303';
  snrCustomerAccountBalanceBcp3.customerCode = '100003';
  snrCustomerAccountBalanceBcp3.accountBalanceCurrentDate = '200';
  snrCustomerAccountBalanceBcp3.accountBalanceExecution = '-200';
  snrCustomerAccountBalanceBcp3.accountBalanceNextDate = '-200';
  snrCustomerAccountBalanceBcp3.guarantyMoneyType = '1';
  snrCustomerAccountBalanceBcps.push(snrCustomerAccountBalanceBcp3);

  const snrCustomerAccountBalanceBcp4 = new SnrCustomerAccountBalanceBcp();
  snrCustomerAccountBalanceBcp4.officeCode = '304';
  snrCustomerAccountBalanceBcp4.customerCode = '100004';
  snrCustomerAccountBalanceBcp4.accountBalanceCurrentDate = '-100';
  snrCustomerAccountBalanceBcp4.accountBalanceExecution = '-100';
  snrCustomerAccountBalanceBcp4.accountBalanceNextDate = '-100';
  snrCustomerAccountBalanceBcp4.guarantyMoneyType = '1';
  snrCustomerAccountBalanceBcps.push(snrCustomerAccountBalanceBcp4);

  const snrCustomerAccountBalanceBcp5 = new SnrCustomerAccountBalanceBcp();
  snrCustomerAccountBalanceBcp5.officeCode = '305';
  snrCustomerAccountBalanceBcp5.customerCode = '100005';
  snrCustomerAccountBalanceBcp5.accountBalanceCurrentDate = '200';
  snrCustomerAccountBalanceBcp5.accountBalanceExecution = '400';
  snrCustomerAccountBalanceBcp5.accountBalanceNextDate = '300';
  snrCustomerAccountBalanceBcp5.guarantyMoneyType = '1';
  snrCustomerAccountBalanceBcps.push(snrCustomerAccountBalanceBcp5);

  const snrCustomerAccountBalanceBcp6 = new SnrCustomerAccountBalanceBcp();
  snrCustomerAccountBalanceBcp6.officeCode = '306';
  snrCustomerAccountBalanceBcp6.customerCode = '100006';
  snrCustomerAccountBalanceBcp6.accountBalanceCurrentDate = '1000';
  snrCustomerAccountBalanceBcp6.accountBalanceExecution = '-200';
  snrCustomerAccountBalanceBcp6.accountBalanceNextDate = '2000';
  snrCustomerAccountBalanceBcp6.guarantyMoneyType = '1';
  snrCustomerAccountBalanceBcps.push(snrCustomerAccountBalanceBcp6);

  const snrCustomerAccountBalanceBcp7 = new SnrCustomerAccountBalanceBcp();
  snrCustomerAccountBalanceBcp7.officeCode = '307';
  snrCustomerAccountBalanceBcp7.customerCode = '100007';
  snrCustomerAccountBalanceBcp7.accountBalanceCurrentDate = '-100';
  snrCustomerAccountBalanceBcp7.accountBalanceExecution = '1000';
  snrCustomerAccountBalanceBcp7.accountBalanceNextDate = '-200';
  snrCustomerAccountBalanceBcp7.guarantyMoneyType = '1';
  snrCustomerAccountBalanceBcps.push(snrCustomerAccountBalanceBcp7);

  const snrCustomerAccountBalanceBcp8 = new SnrCustomerAccountBalanceBcp();
  snrCustomerAccountBalanceBcp8.officeCode = '308';
  snrCustomerAccountBalanceBcp8.customerCode = '100008';
  snrCustomerAccountBalanceBcp8.accountBalanceCurrentDate = '200';
  snrCustomerAccountBalanceBcp8.accountBalanceExecution = '-200';
  snrCustomerAccountBalanceBcp8.accountBalanceNextDate = '-200';
  snrCustomerAccountBalanceBcp8.guarantyMoneyType = '1';
  snrCustomerAccountBalanceBcps.push(snrCustomerAccountBalanceBcp8);

  const snrCustomerAccountBalanceBcp9 = new SnrCustomerAccountBalanceBcp();
  snrCustomerAccountBalanceBcp9.officeCode = '309';
  snrCustomerAccountBalanceBcp9.customerCode = '100009';
  snrCustomerAccountBalanceBcp9.accountBalanceCurrentDate = '300';
  snrCustomerAccountBalanceBcp9.accountBalanceExecution = '-100';
  snrCustomerAccountBalanceBcp9.accountBalanceNextDate = '-100';
  snrCustomerAccountBalanceBcp9.guarantyMoneyType = '1';
  snrCustomerAccountBalanceBcps.push(snrCustomerAccountBalanceBcp9);

  const snrCustomerAccountBalanceBcp10 = new SnrCustomerAccountBalanceBcp();
  snrCustomerAccountBalanceBcp10.officeCode = '310';
  snrCustomerAccountBalanceBcp10.customerCode = '100010';
  snrCustomerAccountBalanceBcp10.accountBalanceCurrentDate = '200';
  snrCustomerAccountBalanceBcp10.accountBalanceExecution = '400';
  snrCustomerAccountBalanceBcp10.accountBalanceNextDate = '300';
  snrCustomerAccountBalanceBcp10.guarantyMoneyType = '1';
  snrCustomerAccountBalanceBcps.push(snrCustomerAccountBalanceBcp10);

  const snrCustomerAccountBalanceBcp11 = new SnrCustomerAccountBalanceBcp();
  snrCustomerAccountBalanceBcp11.officeCode = '311';
  snrCustomerAccountBalanceBcp11.customerCode = '100011';
  snrCustomerAccountBalanceBcp11.accountBalanceCurrentDate = '1000';
  snrCustomerAccountBalanceBcp11.accountBalanceExecution = '-200';
  snrCustomerAccountBalanceBcp11.accountBalanceNextDate = '2000';
  snrCustomerAccountBalanceBcp11.guarantyMoneyType = '1';
  snrCustomerAccountBalanceBcps.push(snrCustomerAccountBalanceBcp11);

  const snrCustomerAccountBalanceBcp12 = new SnrCustomerAccountBalanceBcp();
  snrCustomerAccountBalanceBcp12.officeCode = '312';
  snrCustomerAccountBalanceBcp12.customerCode = '100012';
  snrCustomerAccountBalanceBcp12.accountBalanceCurrentDate = '1000';
  snrCustomerAccountBalanceBcp12.accountBalanceExecution = '-200';
  snrCustomerAccountBalanceBcp12.accountBalanceNextDate = '2000';
  snrCustomerAccountBalanceBcp12.guarantyMoneyType = '1';
  snrCustomerAccountBalanceBcps.push(snrCustomerAccountBalanceBcp12);

  const snrCustomerAccountBalanceBcp13 = new SnrCustomerAccountBalanceBcp();
  snrCustomerAccountBalanceBcp13.officeCode = '313';
  snrCustomerAccountBalanceBcp13.customerCode = '100013';
  snrCustomerAccountBalanceBcp13.accountBalanceCurrentDate = '200';
  snrCustomerAccountBalanceBcp13.accountBalanceExecution = '400';
  snrCustomerAccountBalanceBcp13.accountBalanceNextDate = '300';
  snrCustomerAccountBalanceBcp13.guarantyMoneyType = '1';
  snrCustomerAccountBalanceBcps.push(snrCustomerAccountBalanceBcp13);

  const snrCustomerAccountBalanceBcp14 = new SnrCustomerAccountBalanceBcp();
  snrCustomerAccountBalanceBcp14.officeCode = '314';
  snrCustomerAccountBalanceBcp14.customerCode = '100014';
  snrCustomerAccountBalanceBcp14.accountBalanceCurrentDate = '200';
  snrCustomerAccountBalanceBcp14.accountBalanceExecution = '400';
  snrCustomerAccountBalanceBcp14.accountBalanceNextDate = '300';
  snrCustomerAccountBalanceBcp14.guarantyMoneyType = '1';
  snrCustomerAccountBalanceBcps.push(snrCustomerAccountBalanceBcp14);

  const snrCustomerAccountBalanceBcp15 = new SnrCustomerAccountBalanceBcp();
  snrCustomerAccountBalanceBcp15.officeCode = '315';
  snrCustomerAccountBalanceBcp15.customerCode = '100015';
  snrCustomerAccountBalanceBcp15.accountBalanceCurrentDate = '1000';
  snrCustomerAccountBalanceBcp15.accountBalanceExecution = '2000';
  snrCustomerAccountBalanceBcp15.accountBalanceNextDate = '2000';
  snrCustomerAccountBalanceBcp15.guarantyMoneyType = '1';
  snrCustomerAccountBalanceBcps.push(snrCustomerAccountBalanceBcp15);

  const snrCustomerAccountBalanceBcp16 = new SnrCustomerAccountBalanceBcp();
  snrCustomerAccountBalanceBcp16.officeCode = '316';
  snrCustomerAccountBalanceBcp16.customerCode = '100016';
  snrCustomerAccountBalanceBcp16.accountBalanceCurrentDate = '-100';
  snrCustomerAccountBalanceBcp16.accountBalanceExecution = '1000';
  snrCustomerAccountBalanceBcp16.accountBalanceNextDate = '-200';
  snrCustomerAccountBalanceBcp16.guarantyMoneyType = '1';
  snrCustomerAccountBalanceBcps.push(snrCustomerAccountBalanceBcp16);

  const snrCustomerAccountBalanceBcp17 = new SnrCustomerAccountBalanceBcp();
  snrCustomerAccountBalanceBcp17.officeCode = '317';
  snrCustomerAccountBalanceBcp17.customerCode = '100017';
  snrCustomerAccountBalanceBcp17.accountBalanceCurrentDate = '-100';
  snrCustomerAccountBalanceBcp17.accountBalanceExecution = '200';
  snrCustomerAccountBalanceBcp17.accountBalanceNextDate = '-200';
  snrCustomerAccountBalanceBcp17.guarantyMoneyType = '1';
  snrCustomerAccountBalanceBcps.push(snrCustomerAccountBalanceBcp17);

  const snrCustomerAccountBalanceBcp18 = new SnrCustomerAccountBalanceBcp();
  snrCustomerAccountBalanceBcp18.officeCode = '318';
  snrCustomerAccountBalanceBcp18.customerCode = '100018';
  snrCustomerAccountBalanceBcp18.accountBalanceCurrentDate = '200';
  snrCustomerAccountBalanceBcp18.accountBalanceExecution = '400';
  snrCustomerAccountBalanceBcp18.accountBalanceNextDate = '300';
  snrCustomerAccountBalanceBcp18.guarantyMoneyType = '1';
  snrCustomerAccountBalanceBcps.push(snrCustomerAccountBalanceBcp18);

  const snrCustomerAccountBalanceBcp19 = new SnrCustomerAccountBalanceBcp();
  snrCustomerAccountBalanceBcp19.officeCode = '319';
  snrCustomerAccountBalanceBcp19.customerCode = '100019';
  snrCustomerAccountBalanceBcp19.accountBalanceCurrentDate = '1000';
  snrCustomerAccountBalanceBcp19.accountBalanceExecution = '2000';
  snrCustomerAccountBalanceBcp19.accountBalanceNextDate = '2000';
  snrCustomerAccountBalanceBcp19.guarantyMoneyType = '1';
  snrCustomerAccountBalanceBcps.push(snrCustomerAccountBalanceBcp19);

  const snrCustomerAccountBalanceBcp20 = new SnrCustomerAccountBalanceBcp();
  snrCustomerAccountBalanceBcp20.officeCode = '320';
  snrCustomerAccountBalanceBcp20.customerCode = '100020';
  snrCustomerAccountBalanceBcp20.accountBalanceCurrentDate = '200';
  snrCustomerAccountBalanceBcp20.accountBalanceExecution = '400';
  snrCustomerAccountBalanceBcp20.accountBalanceNextDate = '300';
  snrCustomerAccountBalanceBcp20.guarantyMoneyType = '1';
  snrCustomerAccountBalanceBcps.push(snrCustomerAccountBalanceBcp20);

  const snrCustomerAccountBalanceBcp21 = new SnrCustomerAccountBalanceBcp();
  snrCustomerAccountBalanceBcp21.officeCode = '321';
  snrCustomerAccountBalanceBcp21.customerCode = '100021';
  snrCustomerAccountBalanceBcp21.accountBalanceCurrentDate = '1000';
  snrCustomerAccountBalanceBcp21.accountBalanceExecution = '-200';
  snrCustomerAccountBalanceBcp21.accountBalanceNextDate = '2000';
  snrCustomerAccountBalanceBcp21.guarantyMoneyType = '1';
  snrCustomerAccountBalanceBcps.push(snrCustomerAccountBalanceBcp21);

  const snrCustomerAccountBalanceBcp22 = new SnrCustomerAccountBalanceBcp();
  snrCustomerAccountBalanceBcp22.officeCode = '322';
  snrCustomerAccountBalanceBcp22.customerCode = '100022';
  snrCustomerAccountBalanceBcp22.accountBalanceCurrentDate = '-100';
  snrCustomerAccountBalanceBcp22.accountBalanceExecution = '1000';
  snrCustomerAccountBalanceBcp22.accountBalanceNextDate = '-200';
  snrCustomerAccountBalanceBcp22.guarantyMoneyType = '1';
  snrCustomerAccountBalanceBcps.push(snrCustomerAccountBalanceBcp22);

  const snrCustomerAccountBalanceBcp23 = new SnrCustomerAccountBalanceBcp();
  snrCustomerAccountBalanceBcp23.officeCode = '323';
  snrCustomerAccountBalanceBcp23.customerCode = '100023';
  snrCustomerAccountBalanceBcp23.accountBalanceCurrentDate = '200';
  snrCustomerAccountBalanceBcp23.accountBalanceExecution = '200';
  snrCustomerAccountBalanceBcp23.accountBalanceNextDate = '-200';
  snrCustomerAccountBalanceBcp23.guarantyMoneyType = '1';
  snrCustomerAccountBalanceBcps.push(snrCustomerAccountBalanceBcp23);

  await SnrCustomerAccountBalanceBcp.save(snrCustomerAccountBalanceBcps);
}

/**
 * create NisaLimit base on link data below
 * https://docs.google.com/spreadsheets/d/1lmq5a5LNJKadBeznC77PAtgBiHul5pBwG8YhuZ8RcP8/edit#gid=1987785313
 */
export async function createWB4NisaLimitDatas() {
  const WB4NisaLimitDatas = [];
  const wb4NisaLimitData1 = new WB4NisaLimitData();
  wb4NisaLimitData1.officeCode = '301';
  wb4NisaLimitData1.accountCode = '100001';
  wb4NisaLimitData1.accountingYear = moment().year().toString();
  wb4NisaLimitData1.creditLimit = 400000;
  wb4NisaLimitData1.usageAmount = 200000;
  wb4NisaLimitData1.scheduledFixedAmount = 5000;
  wb4NisaLimitData1.unExecutedAmount = 10000;
  WB4NisaLimitDatas.push(wb4NisaLimitData1);

  const wb4NisaLimitData2 = new WB4NisaLimitData();
  wb4NisaLimitData2.officeCode = '302';
  wb4NisaLimitData2.accountCode = '100002';
  wb4NisaLimitData2.accountingYear = moment().year().toString();
  wb4NisaLimitData2.creditLimit = 400000;
  wb4NisaLimitData2.usageAmount = 300000;
  wb4NisaLimitData2.scheduledFixedAmount = 80000;
  wb4NisaLimitData2.unExecutedAmount = 10000;
  WB4NisaLimitDatas.push(wb4NisaLimitData2);

  const wb4NisaLimitData3 = new WB4NisaLimitData();
  wb4NisaLimitData3.officeCode = '303';
  wb4NisaLimitData3.accountCode = '100003';
  wb4NisaLimitData3.accountingYear = moment().year().toString();
  wb4NisaLimitData3.creditLimit = 400000;
  wb4NisaLimitData3.usageAmount = 200000;
  wb4NisaLimitData3.scheduledFixedAmount = 100000;
  wb4NisaLimitData3.unExecutedAmount = 90000;
  WB4NisaLimitDatas.push(wb4NisaLimitData3);

  const wb4NisaLimitData4 = new WB4NisaLimitData();
  wb4NisaLimitData4.officeCode = '304';
  wb4NisaLimitData4.accountCode = '100004';
  wb4NisaLimitData4.accountingYear = moment().year().toString();
  wb4NisaLimitData4.creditLimit = 400000;
  wb4NisaLimitData4.usageAmount = 2000;
  wb4NisaLimitData4.scheduledFixedAmount = 3000;
  wb4NisaLimitData4.unExecutedAmount = 5000;
  WB4NisaLimitDatas.push(wb4NisaLimitData4);

  const wb4NisaLimitData5 = new WB4NisaLimitData();
  wb4NisaLimitData5.officeCode = '305';
  wb4NisaLimitData5.accountCode = '100005';
  wb4NisaLimitData5.accountingYear = moment().year().toString();
  wb4NisaLimitData5.creditLimit = 400000;
  wb4NisaLimitData5.usageAmount = 10000;
  wb4NisaLimitData5.scheduledFixedAmount = 1000;
  wb4NisaLimitData5.unExecutedAmount = 3000;
  WB4NisaLimitDatas.push(wb4NisaLimitData5);

  const wb4NisaLimitData6 = new WB4NisaLimitData();
  wb4NisaLimitData6.officeCode = '306';
  wb4NisaLimitData6.accountCode = '100006';
  wb4NisaLimitData6.accountingYear = moment().year().toString();
  wb4NisaLimitData6.creditLimit = 100000;
  wb4NisaLimitData6.usageAmount = 200000;
  wb4NisaLimitData6.scheduledFixedAmount = 100000;
  wb4NisaLimitData6.unExecutedAmount = 20000;
  WB4NisaLimitDatas.push(wb4NisaLimitData6);

  const wb4NisaLimitData7 = new WB4NisaLimitData();
  wb4NisaLimitData7.officeCode = '307';
  wb4NisaLimitData7.accountCode = '100007';
  wb4NisaLimitData7.accountingYear = moment().year().toString();
  wb4NisaLimitData7.creditLimit = 400000;
  wb4NisaLimitData7.usageAmount = 370000;
  wb4NisaLimitData7.scheduledFixedAmount = 10000;
  wb4NisaLimitData7.unExecutedAmount = 10000;
  WB4NisaLimitDatas.push(wb4NisaLimitData7);

  const wb4NisaLimitData8 = new WB4NisaLimitData();
  wb4NisaLimitData8.officeCode = '308';
  wb4NisaLimitData8.accountCode = '100008';
  wb4NisaLimitData8.accountingYear = moment().year().toString();
  wb4NisaLimitData8.creditLimit = 400000;
  wb4NisaLimitData8.usageAmount = 300000;
  wb4NisaLimitData8.scheduledFixedAmount = 80000;
  wb4NisaLimitData8.unExecutedAmount = 10000;
  WB4NisaLimitDatas.push(wb4NisaLimitData8);

  const wb4NisaLimitData9 = new WB4NisaLimitData();
  wb4NisaLimitData9.officeCode = '309';
  wb4NisaLimitData9.accountCode = '100009';
  wb4NisaLimitData9.accountingYear = moment().year().toString();
  wb4NisaLimitData9.creditLimit = 400000;
  wb4NisaLimitData9.usageAmount = 100000;
  wb4NisaLimitData9.scheduledFixedAmount = 100000;
  wb4NisaLimitData9.unExecutedAmount = 10000;
  WB4NisaLimitDatas.push(wb4NisaLimitData9);

  const wb4NisaLimitData10 = new WB4NisaLimitData();
  wb4NisaLimitData10.officeCode = '310';
  wb4NisaLimitData10.accountCode = '100010';
  wb4NisaLimitData10.accountingYear = moment().year().toString();
  wb4NisaLimitData10.creditLimit = 400000;
  wb4NisaLimitData10.usageAmount = 100000;
  wb4NisaLimitData10.scheduledFixedAmount = 3000;
  wb4NisaLimitData10.unExecutedAmount = 5000;
  WB4NisaLimitDatas.push(wb4NisaLimitData10);

  const wb4NisaLimitData11 = new WB4NisaLimitData();
  wb4NisaLimitData11.officeCode = '311';
  wb4NisaLimitData11.accountCode = '100011';
  wb4NisaLimitData11.accountingYear = moment().year().toString();
  wb4NisaLimitData11.creditLimit = 400000;
  wb4NisaLimitData11.usageAmount = 200000;
  wb4NisaLimitData11.scheduledFixedAmount = 10000;
  wb4NisaLimitData11.unExecutedAmount = 10000;
  WB4NisaLimitDatas.push(wb4NisaLimitData11);

  const wb4NisaLimitData12 = new WB4NisaLimitData();
  wb4NisaLimitData12.officeCode = '312';
  wb4NisaLimitData12.accountCode = '100012';
  wb4NisaLimitData12.accountingYear = moment().year().toString();
  wb4NisaLimitData12.creditLimit = 400000;
  wb4NisaLimitData12.usageAmount = 370000;
  wb4NisaLimitData12.scheduledFixedAmount = 10000;
  wb4NisaLimitData12.unExecutedAmount = 10000;
  WB4NisaLimitDatas.push(wb4NisaLimitData12);

  const wb4NisaLimitData13 = new WB4NisaLimitData();
  wb4NisaLimitData13.officeCode = '313';
  wb4NisaLimitData13.accountCode = '100013';
  wb4NisaLimitData13.accountingYear = moment().year().toString();
  wb4NisaLimitData13.creditLimit = 400000;
  wb4NisaLimitData13.usageAmount = 100000;
  wb4NisaLimitData13.scheduledFixedAmount = 30000;
  wb4NisaLimitData13.unExecutedAmount = 80000;
  WB4NisaLimitDatas.push(wb4NisaLimitData13);

  const wb4NisaLimitData14 = new WB4NisaLimitData();
  wb4NisaLimitData14.officeCode = '314';
  wb4NisaLimitData14.accountCode = '100014';
  wb4NisaLimitData14.accountingYear = moment().year().toString();
  wb4NisaLimitData14.creditLimit = 400000;
  wb4NisaLimitData14.usageAmount = 200000;
  wb4NisaLimitData14.scheduledFixedAmount = 100000;
  wb4NisaLimitData14.unExecutedAmount = 20000;
  WB4NisaLimitDatas.push(wb4NisaLimitData14);

  const wb4NisaLimitData15 = new WB4NisaLimitData();
  wb4NisaLimitData15.officeCode = '315';
  wb4NisaLimitData15.accountCode = '100015';
  wb4NisaLimitData15.accountingYear = moment().year().toString();
  wb4NisaLimitData15.creditLimit = 400000;
  wb4NisaLimitData15.usageAmount = 100000;
  wb4NisaLimitData15.scheduledFixedAmount = 20000;
  wb4NisaLimitData15.unExecutedAmount = 20000;
  WB4NisaLimitDatas.push(wb4NisaLimitData15);

  const wb4NisaLimitData16 = new WB4NisaLimitData();
  wb4NisaLimitData16.officeCode = '316';
  wb4NisaLimitData16.accountCode = '100016';
  wb4NisaLimitData16.accountingYear = moment().year().toString();
  wb4NisaLimitData16.creditLimit = 400000;
  wb4NisaLimitData16.usageAmount = 10000;
  wb4NisaLimitData16.scheduledFixedAmount = 80000;
  wb4NisaLimitData16.unExecutedAmount = 10000;
  WB4NisaLimitDatas.push(wb4NisaLimitData16);

  const wb4NisaLimitData17 = new WB4NisaLimitData();
  wb4NisaLimitData17.officeCode = '317';
  wb4NisaLimitData17.accountCode = '100017';
  wb4NisaLimitData17.accountingYear = moment().year().toString();
  wb4NisaLimitData17.creditLimit = 400000;
  wb4NisaLimitData17.usageAmount = 10000;
  wb4NisaLimitData17.scheduledFixedAmount = 100000;
  wb4NisaLimitData17.unExecutedAmount = 3000;
  WB4NisaLimitDatas.push(wb4NisaLimitData17);

  const wb4NisaLimitData18 = new WB4NisaLimitData();
  wb4NisaLimitData18.officeCode = '318';
  wb4NisaLimitData18.accountCode = '100018';
  wb4NisaLimitData18.accountingYear = moment().year().toString();
  wb4NisaLimitData18.creditLimit = 400000;
  wb4NisaLimitData18.usageAmount = 100000;
  wb4NisaLimitData18.scheduledFixedAmount = 100000;
  wb4NisaLimitData18.unExecutedAmount = 20000;
  WB4NisaLimitDatas.push(wb4NisaLimitData18);

  const wb4NisaLimitData19 = new WB4NisaLimitData();
  wb4NisaLimitData19.officeCode = '319';
  wb4NisaLimitData19.accountCode = '100019';
  wb4NisaLimitData19.accountingYear = moment().year().toString();
  wb4NisaLimitData19.creditLimit = 400000;
  wb4NisaLimitData19.usageAmount = 170000;
  wb4NisaLimitData19.scheduledFixedAmount = 10000;
  wb4NisaLimitData19.unExecutedAmount = 80000;
  WB4NisaLimitDatas.push(wb4NisaLimitData19);

  const wb4NisaLimitData20 = new WB4NisaLimitData();
  wb4NisaLimitData20.officeCode = '320';
  wb4NisaLimitData20.accountCode = '100020';
  wb4NisaLimitData20.accountingYear = moment().year().toString();
  wb4NisaLimitData20.creditLimit = 400000;
  wb4NisaLimitData20.usageAmount = 10000;
  wb4NisaLimitData20.scheduledFixedAmount = 80000;
  wb4NisaLimitData20.unExecutedAmount = 10000;
  WB4NisaLimitDatas.push(wb4NisaLimitData20);

  const wb4NisaLimitData21 = new WB4NisaLimitData();
  wb4NisaLimitData21.officeCode = '321';
  wb4NisaLimitData21.accountCode = '100021';
  wb4NisaLimitData21.accountingYear = moment().year().toString();
  wb4NisaLimitData21.creditLimit = 400000;
  wb4NisaLimitData21.usageAmount = 200000;
  wb4NisaLimitData21.scheduledFixedAmount = 50000;
  wb4NisaLimitData21.unExecutedAmount = 10000;
  WB4NisaLimitDatas.push(wb4NisaLimitData21);

  const wb4NisaLimitData22 = new WB4NisaLimitData();
  wb4NisaLimitData22.officeCode = '322';
  wb4NisaLimitData22.accountCode = '100022';
  wb4NisaLimitData22.accountingYear = moment().year().toString();
  wb4NisaLimitData22.creditLimit = 400000;
  wb4NisaLimitData22.usageAmount = 10000;
  wb4NisaLimitData22.scheduledFixedAmount = 10000;
  wb4NisaLimitData22.unExecutedAmount = 10000;
  WB4NisaLimitDatas.push(wb4NisaLimitData22);

  const wb4NisaLimitData23 = new WB4NisaLimitData();
  wb4NisaLimitData23.officeCode = '323';
  wb4NisaLimitData23.accountCode = '100023';
  wb4NisaLimitData23.accountingYear = moment().year().toString();
  wb4NisaLimitData23.creditLimit = 400000;
  wb4NisaLimitData23.usageAmount = 10000;
  wb4NisaLimitData23.scheduledFixedAmount = 100000;
  wb4NisaLimitData23.unExecutedAmount = 80000;
  WB4NisaLimitDatas.push(wb4NisaLimitData23);

  await WB4NisaLimitData.save(WB4NisaLimitDatas);
}
/**
 * create FundMsts base on link data below
 * https://docs.google.com/spreadsheets/d/1lmq5a5LNJKadBeznC77PAtgBiHul5pBwG8YhuZ8RcP8/edit#gid=1987785313
 */
export async function createFundMsts() {
  const fundMsts = new Array<FundMst>();
  const fundMst1 = new FundMst();
  fundMst1.brandCode = '5613801';
  fundMst1.brandName = '';
  fundMst1.tilExecutionDays = 1;
  fundMst1.tilDeliceryDays = 1;
  fundMsts.push(fundMst1);
  const fundMst2 = new FundMst();
  fundMst2.brandCode = '5613802';
  fundMst2.brandName = '';
  fundMst2.tilExecutionDays = 2;
  fundMst2.tilDeliceryDays = 1;
  fundMsts.push(fundMst2);
  const fundMst3 = new FundMst();
  fundMst3.brandCode = '5613803';
  fundMst3.brandName = '';
  fundMst3.tilExecutionDays = 3;
  fundMst3.tilDeliceryDays = 1;
  fundMsts.push(fundMst3);
  const fundMst4 = new FundMst();
  fundMst4.brandCode = '5613804';
  fundMst4.brandName = '';
  fundMst4.tilExecutionDays = 2;
  fundMst4.tilDeliceryDays = 1;
  fundMsts.push(fundMst4);
  const fundMst5 = new FundMst();
  fundMst5.brandCode = '5613806';
  fundMst5.brandName = '';
  fundMst5.tilExecutionDays = 2;
  fundMst5.tilDeliceryDays = 1;
  fundMsts.push(fundMst5);
  const fundMst6 = new FundMst();
  fundMst6.brandCode = '5613805';
  fundMst6.brandName = '';
  fundMst6.tilExecutionDays = 1;
  fundMst6.tilDeliceryDays = 1;
  fundMsts.push(fundMst6);
  const fundMst7 = new FundMst();
  fundMst7.brandCode = '5613807';
  fundMst7.brandName = '';
  fundMst7.tilExecutionDays = 1;
  fundMst7.tilDeliceryDays = 1;
  fundMsts.push(fundMst7);
  const fundMst8 = new FundMst();
  fundMst8.brandCode = '5613808';
  fundMst8.brandName = '';
  fundMst8.tilExecutionDays = 3;
  fundMst8.tilDeliceryDays = 1;
  fundMsts.push(fundMst8);
  const fundMst9 = new FundMst();
  fundMst9.brandCode = '5613809';
  fundMst9.brandName = '';
  fundMst9.tilExecutionDays = 2;
  fundMst9.tilDeliceryDays = 1;
  fundMsts.push(fundMst9);
  const fundMst10 = new FundMst();
  fundMst10.brandCode = '5613811';
  fundMst10.brandName = '';
  fundMst10.tilExecutionDays = 3;
  fundMst10.tilDeliceryDays = 1;
  fundMsts.push(fundMst10);
  await FundMst.save(fundMsts);
  for (const key of fundMsts) {
    console.log(key);
  }
}

/**
 * create Wb4AccountMsts base on link data below
 * https://docs.google.com/spreadsheets/d/1lmq5a5LNJKadBeznC77PAtgBiHul5pBwG8YhuZ8RcP8/edit#gid=1987785313
 */
export async function createWb4AccountMsts() {
  const accountMstBcps = [];
  const accountMstBcp1 = new AccountMstBcp();
  accountMstBcp1.officeCode = '303';
  accountMstBcp1.accountCode = '100003';
  accountMstBcp1.customerNameKana = 'ハーオ　サグライ';
  accountMstBcps.push(accountMstBcp1);

  const accountMstBcp2 = new AccountMstBcp();
  accountMstBcp2.officeCode = '304';
  accountMstBcp2.accountCode = '100004';
  accountMstBcp2.customerNameKana = 'ユーシコ　ナツ';
  accountMstBcps.push(accountMstBcp2);

  const accountMstBcp3 = new AccountMstBcp();
  accountMstBcp3.officeCode = '305';
  accountMstBcp3.accountCode = '100005';
  accountMstBcp3.customerNameKana = 'ナジメ';
  accountMstBcps.push(accountMstBcp3);

  const accountMstBcp4 = new AccountMstBcp();
  accountMstBcp4.officeCode = '306';
  accountMstBcp4.accountCode = '100006';
  accountMstBcp4.customerNameKana = 'ナーシ';
  accountMstBcps.push(accountMstBcp4);

  const accountMstBcp5 = new AccountMstBcp();
  accountMstBcp5.officeCode = '307';
  accountMstBcp5.accountCode = '100007';
  accountMstBcp5.customerNameKana = 'イチ　ゴ';
  accountMstBcps.push(accountMstBcp5);

  const accountMstBcp6 = new AccountMstBcp();
  accountMstBcp6.officeCode = '308';
  accountMstBcp6.accountCode = '100008';
  accountMstBcp6.customerNameKana = 'ハル　コ';
  accountMstBcps.push(accountMstBcp6);

  const accountMstBcp7 = new AccountMstBcp();
  accountMstBcp7.officeCode = '309';
  accountMstBcp7.accountCode = '100009';
  accountMstBcp7.customerNameKana = 'パン';
  accountMstBcps.push(accountMstBcp7);

  const accountMstBcp8 = new AccountMstBcp();
  accountMstBcp8.officeCode = '310';
  accountMstBcp8.accountCode = '100010';
  accountMstBcp8.customerNameKana = 'ハルコ';
  accountMstBcps.push(accountMstBcp8);

  const accountMstBcp9 = new AccountMstBcp();
  accountMstBcp9.officeCode = '311';
  accountMstBcp9.accountCode = '100011';
  accountMstBcp9.customerNameKana = 'ハオ　ザグライ';
  accountMstBcps.push(accountMstBcp9);

  const accountMstBcp10 = new AccountMstBcp();
  accountMstBcp10.officeCode = '312';
  accountMstBcp10.accountCode = '100012';
  accountMstBcp10.customerNameKana = 'ユーシコ　ハツ';
  accountMstBcps.push(accountMstBcp10);

  const accountMstBcp11 = new AccountMstBcp();
  accountMstBcp11.officeCode = '313';
  accountMstBcp11.accountCode = '100013';
  accountMstBcp11.customerNameKana = 'ナジネ';
  accountMstBcps.push(accountMstBcp11);

  const accountMstBcp12 = new AccountMstBcp();
  accountMstBcp12.officeCode = '314';
  accountMstBcp12.accountCode = '100014';
  accountMstBcp12.customerNameKana = 'ナーシユ';
  accountMstBcps.push(accountMstBcp12);

  const accountMstBcp13 = new AccountMstBcp();
  accountMstBcp13.officeCode = '315';
  accountMstBcp13.accountCode = '100015';
  accountMstBcp13.customerNameKana = 'イチ　ゴル';
  accountMstBcps.push(accountMstBcp13);

  const accountMstBcp14 = new AccountMstBcp();
  accountMstBcp14.officeCode = '316';
  accountMstBcp14.accountCode = '100016';
  accountMstBcp14.customerNameKana = 'ハル　コリ';
  accountMstBcps.push(accountMstBcp14);

  const accountMstBcp15 = new AccountMstBcp();
  accountMstBcp15.officeCode = '317';
  accountMstBcp15.accountCode = '100017';
  accountMstBcp15.customerNameKana = 'パンン';
  accountMstBcps.push(accountMstBcp15);

  const accountMstBcp16 = new AccountMstBcp();
  accountMstBcp16.officeCode = '318';
  accountMstBcp16.accountCode = '100018';
  accountMstBcp16.customerNameKana = 'ハルココ';
  accountMstBcps.push(accountMstBcp16);

  const accountMstBcp17 = new AccountMstBcp();
  accountMstBcp17.officeCode = '318';
  accountMstBcp17.accountCode = '100018';
  accountMstBcp17.customerNameKana = 'ハーオ　ザグライ';
  accountMstBcps.push(accountMstBcp17);

  const accountMstBcp18 = new AccountMstBcp();
  accountMstBcp18.officeCode = '319';
  accountMstBcp18.accountCode = '100019';
  accountMstBcp18.customerNameKana = 'ユーシコ　ナツ';
  accountMstBcps.push(accountMstBcp18);

  const accountMstBcp19 = new AccountMstBcp();
  accountMstBcp19.officeCode = '320';
  accountMstBcp19.accountCode = '100020';
  accountMstBcp19.customerNameKana = 'ナジメ';
  accountMstBcps.push(accountMstBcp19);

  const accountMstBcp20 = new AccountMstBcp();
  accountMstBcp20.officeCode = '321';
  accountMstBcp20.accountCode = '100021';
  accountMstBcp20.customerNameKana = 'ナーシ';
  accountMstBcps.push(accountMstBcp20);

  const accountMstBcp21 = new AccountMstBcp();
  accountMstBcp21.officeCode = '322';
  accountMstBcp21.accountCode = '100022';
  accountMstBcp21.customerNameKana = 'イチ　ゴ';
  accountMstBcps.push(accountMstBcp21);

  const accountMstBcp22 = new AccountMstBcp();
  accountMstBcp22.officeCode = '323';
  accountMstBcp22.accountCode = '100023';
  accountMstBcp22.customerNameKana = 'ハル　コ';
  accountMstBcps.push(accountMstBcp22);

  await AccountMstBcp.save(accountMstBcps);
}
