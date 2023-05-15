import { IDocumentModelData } from '../types/document-mode.types';
import { QueryArray } from '../../../shared/transformers/query-array';
import { DocumentTypeEnum, StatusEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsInt, IsBoolean, IsDefined } from 'class-validator';
import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { ToBoolean } from '../../../shared/decorators/boolean.decorator';

import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';
import { Types } from 'aws-sdk/clients/applicationautoscaling';

export class VisitReportPdfDto {
  @IsInt()
  @IsOptional()
  scheduleMedicalVisitId?: number;
}
