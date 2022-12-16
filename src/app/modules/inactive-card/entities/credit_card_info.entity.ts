import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('credit_card_info')
export class CreditCardInfo extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({ name: 'branch_code', length: 3 })
  branchCode: string;

  @Column({ name: 'account_code', length: 6 })
  accountCode: string;

  @Column({ name: 'firm_code', nullable: true })
  firmCode: string;

  @Column({ name: 'c_no', nullable: true })
  cNo: number;

  @Column({ name: 'expiration', nullable: true })
  expiration: Date = new Date();

  @Column({ name: 'invalid_flg' })
  invalidFlg: boolean;

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

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
