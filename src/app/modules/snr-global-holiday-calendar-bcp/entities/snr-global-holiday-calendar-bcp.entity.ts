import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('SNR_GLOBAL_HOLIDAY_CALENDAR_BCP')
export class SnrGlobalHolidayCalendarBcp extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'REC_ID' })
  REC_ID: number;

  @Column({ name: 'SecurityCode', length: 7, type: 'char', nullable: true })
  securityCode: string;

  @Column({ name: 'Holiday', length: 8, type: 'char', nullable: true })
  holiday: string;

  @Column({ name: 'uploadDate', length: 8, type: 'char', nullable: true })
  uploadDate: string;

  @Column({ name: 'Status', length: 50, type: 'nvarchar', nullable: true })
  status: string;

  @Column({ name: 'UpdatedBy', length: 51, type: 'nvarchar', nullable: true })
  updatedBy: string;
}
