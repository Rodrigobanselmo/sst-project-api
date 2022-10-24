import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ChecklistDataDto {
  @IsNumber()
  @IsOptional()
  checklistId?: number;

  @IsString()
  json: string;
}
