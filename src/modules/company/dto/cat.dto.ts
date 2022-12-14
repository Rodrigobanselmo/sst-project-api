import { PartialType } from '@nestjs/swagger';
import { StatusEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { DateFormat } from '../../../shared/transformers/date-format';
import { QueryArray } from '../../../shared/transformers/query-array';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';

export class CreateCatDto {
  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data de início inválida' })
  @Type(() => Date)
  dtAcid: Date;

  @IsOptional()
  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data inválida' })
  @Type(() => Date)
  dtObito?: Date;

  @IsOptional()
  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data inválida' })
  @Type(() => Date)
  ultDiaTrab?: Date;

  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data inválida' })
  @Type(() => Date)
  dtAtendimento: Date;

  @IsInt()
  tpAcid: number;

  @IsInt()
  tpCat: number;

  @IsInt()
  iniciatCAT: number;

  @IsInt()
  tpLocal: number;

  @IsOptional()
  @IsInt()
  ideLocalAcidTpInsc?: number;

  @IsInt()
  lateralidade: number;

  @IsInt()
  durTrat: number;

  @IsInt()
  docId: number;

  @IsInt()
  employeeId: number;

  @IsInt()
  @IsOptional()
  catOriginId?: number;

  @IsString()
  @IsOptional()
  hrAcid?: string;

  @IsString()
  @IsOptional()
  hrsTrabAntesAcid?: string;

  @IsString()
  codSitGeradora: string;

  @IsString()
  @IsOptional()
  obsCAT?: string;

  @IsString()
  dscLocal: string;

  @IsString()
  @IsOptional()
  tpLograd?: string;

  @IsString()
  dscLograd: string;

  @IsString()
  nrLograd: string;

  @IsString()
  @IsOptional()
  complemento?: string;

  @IsString()
  @IsOptional()
  bairro?: string;

  @IsString()
  @IsOptional()
  cep?: string;

  @IsString()
  @IsOptional()
  codMunic?: string;

  @IsString()
  @IsOptional()
  uf?: string;

  @IsString()
  @IsOptional()
  pais?: string;

  @IsString()
  @IsOptional()
  codPostal?: string;

  @IsString()
  @IsOptional()
  ideLocalAcidCnpj?: string;

  @IsString()
  codParteAting: string;

  @IsString()
  codAgntCausador: string;

  @IsString()
  hrAtendimento: string;

  @IsString()
  dscLesao: string;

  @IsString()
  @IsOptional()
  dscCompLesao?: string;

  @IsString()
  @IsOptional()
  diagProvavel?: string;

  @IsString()
  codCID: string;

  @IsString()
  @IsOptional()
  observacao?: string;

  @IsBoolean()
  @IsOptional()
  isIndCatObito?: boolean;

  @IsBoolean()
  @IsOptional()
  isIndComunPolicia?: boolean;

  @IsBoolean()
  @IsOptional()
  houveAfast?: boolean;

  @IsOptional()
  @IsBoolean()
  isIndInternacao: boolean;

  @IsOptional()
  @IsBoolean()
  isIndAfast: boolean;

  @IsString()
  @IsOptional()
  companyId: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `Status inválido`,
  })
  status: StatusEnum;
}

export class UpdateCatDto extends PartialType(CreateCatDto) {
  @IsInt()
  id: number;
}

export class FindCatDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  companyId?: string;

  @IsBoolean()
  @IsOptional()
  onlyCompany?: boolean;

  @IsBoolean()
  @IsOptional()
  withReceipt?: boolean;

  @Transform(QueryArray, { toClassOnly: true })
  @IsString({ each: true })
  @IsOptional()
  companiesIds?: string[];
}
