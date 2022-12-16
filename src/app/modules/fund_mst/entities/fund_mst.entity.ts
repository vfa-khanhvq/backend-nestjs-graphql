import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('fund_mst')
export class FundMst extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({ name: 'brand_code', length: 12 })
  brandCode: string;

  @Column({ name: 'bramd_name', length: 256, type: 'nvarchar' })
  brandName: string;

  @Column({ name: 'til_execution_days' })
  tilExecutionDays: number;

  @Column({ name: 'til_delicery_days' })
  tilDeliceryDays: number;

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
