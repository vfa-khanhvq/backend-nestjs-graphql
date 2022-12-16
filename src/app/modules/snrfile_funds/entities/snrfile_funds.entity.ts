import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('snrfile_funds')
export class SnrFileFunds extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;
  @Column({ name: 'service_type', type: 'int', nullable: true })
  serviceType: number;
  @Column({ name: 'credit_reserve_orders_id', type: 'bigint', nullable: true })
  creditReserveOrdersId: number;
  @Column({ name: 'customer_order_close_id', type: 'bigint', nullable: true })
  customerOrderCloseId: number;
  @Column({ name: 'hulft_number', type: 'int', nullable: true })
  hulftNumber: number;
  @Column({ name: 'errorcode', type: 'nvarchar', nullable: true, length: 255 })
  errorcode: string;
  @Column({ name: 'data_code', type: 'nvarchar', nullable: false, length: 5 })
  dataCode: string;
  @Column({ name: 'branch_code', type: 'nvarchar', nullable: false, length: 3 })
  branchCode: string;
  @Column({
    name: 'account_code',
    type: 'nvarchar',
    nullable: false,
    length: 7,
  })
  accountCode: string;
  @Column({ name: 'sales_code', type: 'nvarchar', nullable: true, length: 5 })
  salesCode: string;
  @Column({ name: 'brand_code', type: 'nvarchar', nullable: false, length: 7 })
  brandCode: string;
  @Column({ name: 'unit_type', type: 'nvarchar', nullable: false, length: 1 })
  unitType: string;
  @Column({
    name: 'contracted_number_buy',
    type: 'nvarchar',
    nullable: true,
    length: 10,
  })
  contractedNumberBuy: string;
  @Column({
    name: 'contracted_number_sell',
    type: 'nvarchar',
    nullable: true,
    length: 10,
  })
  contractedNumberSell: string;
  @Column({
    name: 'settlement_method',
    type: 'nvarchar',
    nullable: false,
    length: 1,
  })
  settlementMethod: string;
  @Column({ name: 'slip_no', type: 'nvarchar', nullable: true, length: 4 })
  slipNo: string;
  @Column({
    name: 'commission_type',
    type: 'nvarchar',
    nullable: true,
    length: 1,
  })
  commissionType: string;
  @Column({
    name: 'purchase_claim_type',
    type: 'nvarchar',
    nullable: true,
    length: 1,
  })
  purchaseClaimType: string;
  @Column({
    name: 'specified_account_type',
    type: 'nvarchar',
    nullable: false,
    length: 1,
  })
  specifiedAccountType: string;
  @Column({ name: 'order_ch', type: 'nvarchar', nullable: false, length: 1 })
  orderCh: string;
  @Column({
    name: 'check_balance',
    type: 'nvarchar',
    nullable: true,
    length: 1,
  })
  checkBalance: string;
  @Column({
    name: 'nisa_usage_amount',
    type: 'nvarchar',
    nullable: true,
    length: 10,
  })
  nisaUsageAmount: string;
  @Column({
    name: 'identifying_code',
    type: 'nvarchar',
    nullable: false,
    length: 9,
  })
  identifyingCode: string;
  @Column({
    name: 'order_receive_date',
    type: 'nvarchar',
    nullable: false,
    length: 8,
  })
  orderReceiveDate: string;
  @Column({
    name: 'order_receive_time',
    type: 'nvarchar',
    nullable: false,
    length: 4,
  })
  orderReceiveTime: string;
  @Column({ name: 'created_at', type: 'datetime', nullable: false })
  createdAt: Date = new Date();
  @Column({
    name: 'updated_at',
    type: 'datetime',
    nullable: true,
    transformer: {
      to() {
        return new Date();
      },
      from(value) {
        return value;
      },
    },
  })
  updatedAt: Date = new Date();
}
