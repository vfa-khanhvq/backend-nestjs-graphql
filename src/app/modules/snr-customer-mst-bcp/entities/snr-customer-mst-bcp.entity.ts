import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('SNR_CUSTOMER_MST_BCP')
export class SnrCustomerMstBcp extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'REC_ID' })
  REC_ID: number;

  @Column({ name: 'OfficeCode', type: 'char', nullable: true, length: 3 })
  officeCode: string;

  @Column({ name: 'CustomerCode', type: 'char', nullable: true, length: 6 })
  customerCode: string;

  @Column({ name: 'SalesCode', type: 'char', nullable: true, length: 5 })
  salescode: string;

  @Column({ name: 'YCustomerType', type: 'char', nullable: true, length: 1 })
  yCustomerType: string;

  @Column({ name: 'uploadDate', type: 'nchar', nullable: true, length: 8 })
  uploaddate: string;

  @Column({ name: 'Status', type: 'nvarchar', nullable: true, length: 50 })
  status: string;

  @Column({ name: 'UpdatedBy', type: 'nvarchar', nullable: true, length: 51 })
  updatedby: string;
}
