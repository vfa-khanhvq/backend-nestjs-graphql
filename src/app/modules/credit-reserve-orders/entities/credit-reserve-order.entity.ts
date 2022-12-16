import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('credit_reserve_orders')
export class CreditReserveOrder extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({
    name: 'credit_reserves_id',
    nullable: false,
  })
  creditReservesId: number;

  @Column({ name: 'branch_code', length: 3 })
  branchCode: string;

  @Column({ name: 'account_code', length: 6 })
  accountCode: string;

  @Column({ name: 'brand_code', length: 12 })
  brandCode: string;

  @Column({ name: 'order_amount', type: 'int' })
  orderAmount: number;

  @Column({ name: 'account_type', type: 'tinyint' })
  accountType: number;

  @Column({ name: 'order_date', type: 'date' })
  orderDate: Date;

  @Column({ name: 'invalid_card_check_result', nullable: true, length: 1 })
  invalidCardCheckResult: string;

  @Column({ name: 'ycustomer_result', nullable: true, length: 1 })
  ycustomerResult: string;

  @Column({ name: 'branchlock_result', nullable: true, length: 1 })
  branchlockResult: string;

  @Column({ name: 'money_shortage_result', nullable: true, length: 1 })
  moneyShortageResult: string;

  @Column({ name: 'nisa_result', nullable: true, length: 1 })
  nisaResult: string;

  @Column({ name: 'name_matching_result', nullable: true, length: 1 })
  nameMatchingResult: string;

  @Column({ name: 'auth_sales_result', nullable: true, length: 1 })
  authSalesResult: string;

  @Column({ name: 'snrfile_funds_id', nullable: true })
  snrfileFundsId: number;

  @Column({ name: 'snrfile_deposits_id', nullable: true })
  snrfileDepositsId: number;

  @Column({ name: 'not_target', nullable: true, length: 2 })
  notTarget: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date = new Date();

  @UpdateDateColumn({
    name: 'updated_at',
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
