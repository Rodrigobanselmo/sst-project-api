import { PartialType } from '@nestjs/swagger';
import { ProfessionalRespTypeEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { DateFormat } from './../../../shared/transformers/date-format';

export class CreateProfessionalResponsibleDto {
  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data de início inválida' })
  @Type(() => Date)
  startDate: Date;

  @IsString()
  companyId: string;

  @IsInt()
  professionalCouncilId: number;

  @IsString()
  @IsOptional()
  @IsEnum(ProfessionalRespTypeEnum, {
    message: `Erro ao enviar tipo de profissional`,
  })
  type?: ProfessionalRespTypeEnum;
}

export class UpdateProfessionalResponsibleDto extends PartialType(CreateProfessionalResponsibleDto) {
  id?: number;

  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data de início inválida' })
  @Type(() => Date)
  startDate: Date;

  @IsString()
  companyId: string;

  @IsInt()
  professionalCouncilId: number;
}

export class FindProfessionalResponsibleDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  companyId?: string;
}
