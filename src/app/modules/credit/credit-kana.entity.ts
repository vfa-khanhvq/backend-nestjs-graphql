import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('credit_kana_responses')
export class CreditKana extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({
    name: 'credit_reserve_orders_id',
    type: 'bigint',
    nullable: false,
  })
  creditReserveOrderId: number;

  @Column({ name: 'branch_code', type: 'nvarchar', length: 3 })
  branchCode: string;

  @Column({
    name: 'account_code',
    type: 'nvarchar',
    length: 6,
  })
  accountCode: string;

  @Column({
    name: 'CustomerNameKana',
    type: 'nvarchar',
    length: 256,
  })
  customerNameKana: string;

  @Column({ name: 'kana_name', type: 'nvarchar', length: 256 })
  kanaName: string;

  @Column({ name: 'account_name', type: 'nvarchar', length: 256 })
  accountName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt = new Date();

  @UpdateDateColumn({
    name: 'updated_at',
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

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
