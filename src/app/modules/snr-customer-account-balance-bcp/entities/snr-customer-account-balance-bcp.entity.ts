import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('SNR_CUSTOMER_ACCOUNT_BALANCE_BCP')
export class SnrCustomerAccountBalanceBcp extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'REC_ID' })
  REC_ID: number;

  @Column({ name: 'OfficeCode', type: 'char', nullable: true, length: 3 })
  officeCode: string;

  @Column({ name: 'CustomerCode', type: 'char', nullable: true, length: 6 })
  customerCode: string;

  @Column({
    name: 'GuarantyMoneyType',
    type: 'char',
    nullable: true,
    length: 1,
  })
  guarantyMoneyType: string;

  @Column({
    name: 'AccountBalanceCurrentDate',
    type: 'char',
    length: 15,
  })
  accountBalanceCurrentDate: string;

  @Column({
    name: 'AccountBalanceNextDate',
    type: 'char',
    length: 15,
  })
  accountBalanceNextDate: string;

  @Column({
    name: 'AccountBalanceExecution',
    type: 'char',
    length: 15,
  })
  accountBalanceExecution: string;

  @Column({ name: 'uploadDate', type: 'nchar', nullable: true, length: 8 })
  uploaddate: string;

  @Column({ name: 'Status', type: 'nvarchar', nullable: true, length: 50 })
  status: string;

  @Column({ name: 'UpdatedBy', type: 'nvarchar', nullable: true, length: 51 })
  updatedby: string;
}
