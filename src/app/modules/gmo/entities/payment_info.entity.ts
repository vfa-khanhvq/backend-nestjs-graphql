import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('gmo_payment_info')
export class PaymentInfo extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({ name: 'account_code' })
  accountCode: string;

  @Column({ name: 'branch_code' })
  branchCode: string;

  @Column({ name: 'member_id' })
  memberId: string;

  @Column({ name: 'card_seq', length: 10 })
  cardSeq: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date = new Date();

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
  updatedAt?: Date = new Date();
}
