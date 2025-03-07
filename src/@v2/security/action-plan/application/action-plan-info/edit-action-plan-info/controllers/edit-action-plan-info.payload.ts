import { IsDate, IsInt, IsOptional } from 'class-validator';

export class EditActionPlanInfoPayload {
  @IsInt()
  @IsOptional()
  coordinatorId?: number;

  @IsDate()
  @IsOptional()
  validityStart?: Date;

  @IsDate()
  @IsOptional()
  validityEnd?: Date;

  @IsInt()
  @IsOptional()
  monthsLevel_2?: number;

  @IsInt()
  @IsOptional()
  monthsLevel_3?: number;

  @IsInt()
  @IsOptional()
  monthsLevel_4?: number;

  @IsInt()
  @IsOptional()
  monthsLevel_5?: number;
}
