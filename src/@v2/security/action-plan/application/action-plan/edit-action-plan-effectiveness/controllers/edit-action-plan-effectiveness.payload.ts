import { EffectivenessStatusEnum } from '@/@v2/security/action-plan/domain/enums/effectiveness-status.enum';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class EditActionPlanEffectivenessPayload {
  @IsString()
  recommendationId!: string;

  @IsString()
  riskDataId!: string;

  @IsString()
  workspaceId!: string;

  @IsEnum(EffectivenessStatusEnum)
  effectivenessStatus!: EffectivenessStatusEnum;

  @IsString()
  @IsOptional()
  @MaxLength(4000)
  effectivenessComment?: string | null;
}
