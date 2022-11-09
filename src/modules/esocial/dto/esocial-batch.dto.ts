import {
  EmployeeESocialEventTypeEnum,
  Prisma,
  StatusEnum,
} from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/shared/dto/pagination.dto';

export class CreateESocialEvent {
  eventsDate: Date;
  eventXml: string;
  employeeId: number;
  examHistoryId?: number;
  // responseXml: string;
}

export class CreateESocialBatch {
  environment: number;
  status: StatusEnum;
  userTransmissionId: number;
  companyId: string;
  response?: any;
  events?: CreateESocialEvent[];
  examsIds?: number[];
  type: EmployeeESocialEventTypeEnum;
  protocolId?: string;
}

export class FindESocialBatchDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search: string;

  @IsString()
  @IsOptional()
  companyId: string;
}
