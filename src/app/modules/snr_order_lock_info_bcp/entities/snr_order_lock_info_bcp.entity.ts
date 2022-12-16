import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('SNR_ORDER_LOCK_INFO_BCP')
export class SnrOrderLockInfoBcp extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'REC_ID' })
  recId: number;

  @Column({ name: 'OfficeCode', type: 'char', nullable: true, length: 3 })
  officeCode: string;

  @Column({ name: 'CustomerCode', type: 'char', nullable: true, length: 7 })
  customerCode: string;

  @Column({ name: 'BranchLock', type: 'char', nullable: true, length: 1 })
  branchLock: string;

  @Column({ name: 'uploadDate', type: 'nchar', nullable: true, length: 8 })
  uploadDate: string;

  @Column({ name: 'Status', type: 'nvarchar', nullable: true, length: 50 })
  status: string;

  @Column({ name: 'UpdatedBy', type: 'nvarchar', nullable: true, length: 51 })
  updatedBy: string;
}
