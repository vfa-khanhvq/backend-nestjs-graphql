import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('WB4_NISA_LIMITDATA')
export class WB4NisaLimitData extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'REC_ID' })
  recId: number;

  @Column({ name: 'OfficeCode', type: 'nvarchar', length: 3 })
  officeCode: string;

  @Column({ name: 'AccountCode', type: 'nvarchar', length: 6 })
  accountCode: string;

  @Column({ name: 'AccountingYear', type: 'nvarchar', length: 4 })
  accountingYear: string;

  @Column({ name: 'CreditLimit' })
  creditLimit: number;

  @Column({ name: 'UsageAmount' })
  usageAmount: number;

  @Column({ name: 'ScheduledFixedAmount' })
  scheduledFixedAmount: number;

  @Column({ name: 'UnExecutedAmount' })
  unExecutedAmount: number;

  @Column({ name: 'uploadDate', type: 'nvarchar', length: 8, nullable: true })
  uploadDate: string;

  @Column({ name: 'Status', type: 'nvarchar', length: 51, nullable: true })
  status: string;

  @Column({ name: 'UpdatedBy', type: 'nvarchar', length: 51, nullable: true })
  updatedBy: string;
}
