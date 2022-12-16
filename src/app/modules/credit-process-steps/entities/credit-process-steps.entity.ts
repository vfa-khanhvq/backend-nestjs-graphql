import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('credit_process_steps')
export class CreditProcessStep extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({ name: 'order_date', type: 'date' })
  orderDate: Date;

  @Column({ name: 'current_step', type: 'int' })
  currentStep: number;

  @Column({ name: 'status' })
  status: string;

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
}
