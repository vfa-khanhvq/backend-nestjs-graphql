import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('credit_reserves')
export class CreditReserves extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

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

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
