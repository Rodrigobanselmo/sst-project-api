import { IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class FonteGeradora {
  nome!: string;
  justificativa!: string;
  origem!: 'sistema' | 'ia';
}

class MedidaRecomendada {
  nome!: string;
  justificativa!: string;
  origem!: 'sistema' | 'ia';
}

export class AnalysisData {
  frps!: string;
  fontesGeradoras!: FonteGeradora[];
  medidasEngenhariaRecomendadas!: MedidaRecomendada[];
  medidasAdministrativasRecomendadas!: MedidaRecomendada[];
}

export class EditFormQuestionsAnswersAnalysisPayload {
  @IsObject()
  analysis!: any;
  // @ValidateNested()
  // @Type(() => AnalysisData)
  // analysis!: AnalysisData;
}
