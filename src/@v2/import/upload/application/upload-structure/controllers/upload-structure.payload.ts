import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class UploadStructurePayload {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  createHierarchyIfNotExists?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  createHomogeneousGroupIfNotExists?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  createEmployeeIfNotExists?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  linkHierarchyToHomogeneousGroupIfNotExists?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  stopOnFirstError?: boolean;
}
