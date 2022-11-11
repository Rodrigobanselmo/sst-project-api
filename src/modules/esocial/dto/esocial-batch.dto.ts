import { KeysOfEnum } from './../../../shared/utils/keysOfEnum.utils';
import { QueryArray } from './../../../shared/transformers/query-array';
import {
  EmployeeESocialEventTypeEnum,
  Prisma,
  StatusEnum,
} from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/shared/dto/pagination.dto';
import { Transform } from 'class-transformer';

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

  @Transform(QueryArray, { toClassOnly: true })
  @IsOptional()
  @IsString({ each: true })
  @IsEnum(StatusEnum, {
    each: true,
    message: `Erro ao enviar status`,
  })
  status?: StatusEnum[];
}
