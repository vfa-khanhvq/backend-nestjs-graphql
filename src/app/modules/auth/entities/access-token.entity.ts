import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('saison_access_token_info')
export class AccessTokenInfo extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id', type: 'bigint' })
  id: number;

  @Column({ name: 'branch_code', type: 'nchar', length: 3 })
  branchCode: string;

  @Column({
    name: 'account_code',
    type: 'nchar',
    nullable: false,
    length: 6,
  })
  accountCode: string;

  @Column({
    name: 'access_token',
    type: 'nvarchar',
    length: 64,
  })
  accessToken: string;

  @Column({ name: 'access_token_expires_in' })
  accessTokenExpire: Date = new Date();

  @Column({ name: 'refresh_token', type: 'nvarchar', length: 64 })
  refreshToken: string;

  @Column({ name: 'token', type: 'nvarchar', length: 255 })
  paymentToken: string;

  @Column({ name: 'payment_token_expires_in' })
  paymentTokenExpires: Date = new Date();

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date = new Date();

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
}
