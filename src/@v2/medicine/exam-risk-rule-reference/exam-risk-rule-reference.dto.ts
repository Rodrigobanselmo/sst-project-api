import { IsNotEmpty, IsString } from 'class-validator';

/** Body do apply de fonte complementar ACGIH/BEI a partir da comparação. */
export class ApplyAcgihReferenceBody {
  @IsString()
  @IsNotEmpty()
  acgihBeiIndicatorId: string;
}

export class RuleReferencesPath {
  @IsString()
  @IsNotEmpty()
  ruleId: string;
}

export class RuleReferenceByIdPath {
  @IsString()
  @IsNotEmpty()
  ruleId: string;

  @IsString()
  @IsNotEmpty()
  referenceId: string;
}
