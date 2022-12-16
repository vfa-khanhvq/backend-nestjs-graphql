import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('WB4_ACCOUNT_MST_BCP')
export class AccountMstBcp extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'REC_ID' })
  recId: number;

  @Column({ name: 'OfficeCode', type: 'char', length: 3, nullable: true })
  officeCode: string;

  @Column({ name: 'AccountCode', length: 6, type: 'char', nullable: false })
  accountCode: string;

  @Column({
    name: 'CustomerNameKana',
    length: 40,
    type: 'char',
    nullable: true,
  })
  customerNameKana: string;

  @Column({ name: 'Status', type: 'nvarchar', nullable: true, length: 50 })
  status: string;

  @Column({ name: 'uploadDate', type: 'nchar', nullable: true, length: 8 })
  uploaddate: string;

  @Column({ name: 'UpdatedBy', length: 51, type: 'nvarchar', nullable: true })
  updatedBy: string;
}
