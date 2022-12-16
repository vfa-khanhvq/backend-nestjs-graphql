import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('snrfile_deposits')
export class SnrfileDeposits extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({ name: 'service_type', type: 'int', nullable: true })
  serviceType: number;

  @Column({ name: 'close_history_id', type: 'bigint', nullable: true })
  closeHistoryId: number;

  @Column({ name: 'customer_order_close_id', type: 'bigint', nullable: true })
  customerOrderCloseId: number;

  @Column({ name: 'hulft_number', type: 'int', nullable: true })
  hulftNumber: number;

  @Column({ name: 'errorcode', type: 'nvarchar', nullable: true, length: 255 })
  errorcode: string;

  @Column({ name: 'data_type', type: 'nvarchar', nullable: false, length: 2 })
  dataType: string;

  @Column({ name: 'working_day', type: 'nvarchar', nullable: false, length: 8 })
  workingDay: string;

  @Column({ name: 'data_code', type: 'nvarchar', nullable: false, length: 5 })
  dataCode: string;

  @Column({
    name: 'company_code',
    type: 'nvarchar',
    nullable: false,
    length: 2,
  })
  companyCode: string;

  @Column({ name: 'branch_code', type: 'nvarchar', nullable: false, length: 3 })
  branchCode: string;

  @Column({
    name: 'account_code',
    type: 'nvarchar',
    nullable: false,
    length: 7,
  })
  accountCode: string;

  @Column({ name: 'sales_code', type: 'nvarchar', nullable: false, length: 5 })
  salesCode: string;

  @Column({
    name: 'disbursement_amount',
    type: 'nvarchar',
    nullable: true,
    length: 12,
  })
  disbursementAmount: string;

  @Column({
    name: 'deposit_amount',
    type: 'nvarchar',
    nullable: false,
    length: 12,
  })
  depositAmount: string;

  @Column({
    name: 'description_code',
    type: 'nvarchar',
    nullable: false,
    length: 2,
  })
  descriptionCode: string;

  @Column({ name: 'description', type: 'nvarchar', nullable: true, length: 25 })
  description: string;

  @Column({
    name: 'transfer_type',
    type: 'nvarchar',
    nullable: true,
    length: 1,
  })
  transferType: string;

  @Column({
    name: 'transfer_date',
    type: 'nvarchar',
    nullable: false,
    length: 8,
  })
  transferDate: string;

  @Column({
    name: 'information_type',
    type: 'nvarchar',
    nullable: false,
    length: 2,
  })
  informationType: string;

  @Column({ name: 'sequence_no', type: 'nvarchar', nullable: false, length: 8 })
  sequenceNo: string;

  @Column({ name: 'reserve', type: 'nvarchar', nullable: false, length: 30 })
  reserve: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', nullable: true })
  createdAt: Date = new Date();

  @UpdateDateColumn({
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
