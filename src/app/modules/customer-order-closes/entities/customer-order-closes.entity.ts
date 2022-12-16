import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('customer_order_closes')
export class CustomerOrderCloses extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({ name: 'closed_at', type: 'datetime' })
  closedAt: Date = new Date();

  @Column({ name: 'handling_on', type: 'date' })
  handlingOn: Date;

  @Column({ name: 'service_type', type: 'int' })
  serviceType: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
