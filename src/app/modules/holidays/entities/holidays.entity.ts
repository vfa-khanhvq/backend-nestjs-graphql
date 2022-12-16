import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('holidays')
export class Holidays extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({
    name: 'name',
    type: 'nvarchar',
    length: 255,
  })
  name: string;

  @Column({ name: 'date', type: 'date' })
  date: Date;

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
