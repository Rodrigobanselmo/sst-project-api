import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

class RiskAssignmentItem {
  @IsString()
  @IsNotEmpty()
  riskId!: string;

  @IsNumber()
  probability!: number;

  @IsString()
  @IsNotEmpty()
  hierarchyId!: string;
}

export class AssignRisksFormApplicationPayload {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => RiskAssignmentItem)
  risks!: RiskAssignmentItem[];
}
