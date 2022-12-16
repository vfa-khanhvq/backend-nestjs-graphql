import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('credit_process_transactions')
export class CreditProcessTransaction extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({ name: 'order_date', type: 'date' })
  orderDate: Date;

  @Column({ name: 'current_step', type: 'int' })
  currentStep: number;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'expire_time' })
  expireTime: Date = new Date();

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

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
