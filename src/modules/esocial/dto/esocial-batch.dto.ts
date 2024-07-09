import { EmployeeESocialEventActionEnum, EmployeeESocialEventTypeEnum, Prisma, StatusEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  IESocial2240,
  IESocial2220,
  IESocial3000,
} from './../../../shared/providers/ESocialProvider/models/IESocialMethodProvider';

import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
import { QueryArray } from './../../../shared/transformers/query-array';

export class CreateESocialEvent {
  eventsDate?: Date;
  eventXml: string;
  employeeId: number;
  eventId: string;
  examHistoryId?: number;
  pppHistoryId?: number;
  action?: EmployeeESocialEventActionEnum;
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
  pppJson?: {
    json: any;
    event: IESocial3000.XmlReturn | IESocial2220.XmlReturn | IESocial2240.XmlReturn;
  }[];
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
