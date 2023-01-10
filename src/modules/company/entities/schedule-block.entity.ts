import { ApiProperty } from '@nestjs/swagger';
import { ScheduleBlock, ScheduleBlockTypeEnum, StatusEnum } from '@prisma/client';
import { CompanyEntity } from './company.entity';

export class ScheduleBlockEntity implements ScheduleBlock {
  @ApiProperty({ description: 'The id of the Company' })
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  companyId: string;
  yearRecurrence: boolean;
  allCompanies: boolean;
  status: StatusEnum;
  type: ScheduleBlockTypeEnum;
  updated_at: Date;
  created_at: Date;
  deleted_at: Date;

  applyOnCompanies?: CompanyEntity[];
  company?: CompanyEntity;

  constructor(partial: Partial<ScheduleBlockEntity>) {
    Object.assign(this, partial);

    if (this.startDate && this.startDate.length < 7) {
      this.startDate = new Date().getFullYear() + '-' + this.startDate;
    }
    if (this.endDate && this.endDate.length < 7) {
      this.endDate = new Date().getFullYear() + '-' + this.endDate;
    }
  }
}
