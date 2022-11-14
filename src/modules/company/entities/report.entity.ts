import { ApiProperty } from '@nestjs/swagger';
import { CompanyReport, Prisma } from '@prisma/client';

export class CompanyReportEntity implements CompanyReport {
  @ApiProperty({ description: 'The id of the company report' })
  id: number;
  lastDailyReport: Date;
  dailyReport: Prisma.JsonValue;
  created_at: Date;
  updated_at: Date;
  companyId: string;

  constructor(partial: Partial<CompanyReportEntity>) {
    Object.assign(this, partial);
  }
  esocialPendent: number;
  esocialReject: number;
  esocialDone: number;
  esocialProgress: number;
}
