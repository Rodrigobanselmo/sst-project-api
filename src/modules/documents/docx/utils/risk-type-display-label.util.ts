import { RiskFactorsEnum } from '@prisma/client';
import { riskMap } from '../../constants/risks.constant';

/** Ordem: primeiro match quando houver vários (ex.: prioriza Psicossociais). Alinhado ao client STagRisk. */
const SUBTYPE_LABEL_SUFFIX_BY_NAME: Record<string, string> = {
  Psicossociais: 'PSIC',
  Biomecânicos: 'BIOM',
  Ambientais: 'AMB',
  Organizacionais: 'ORG',
  'Mobiliário e Equipamentos': 'MOB',
};

export type RiskTypeDisplayInput = {
  type: RiskFactorsEnum | string;
  subTypes?: { sub_type?: { name?: string } }[];
};

/** Código exibido entre parênteses nas matrizes DOCX (ex.: ERG-PSIC ou ERG). */
export function getRiskTypeDocumentCode(risk: RiskTypeDisplayInput): string {
  for (const subtypeName of Object.keys(SUBTYPE_LABEL_SUFFIX_BY_NAME)) {
    if (risk.subTypes?.some((s) => s?.sub_type?.name === subtypeName)) {
      const suffix = SUBTYPE_LABEL_SUFFIX_BY_NAME[subtypeName];
      return risk.type === RiskFactorsEnum.ERG ? `ERG-${suffix}` : suffix;
    }
  }

  return String(risk.type);
}

/** Rótulo da coluna Tipo no inventário (ex.: ERG-PSIC em vez de Ergonômico genérico). */
export function getRiskTypeDisplayLabel(risk: RiskTypeDisplayInput): string {
  const code = getRiskTypeDocumentCode(risk);
  if (code !== String(risk.type)) return code;

  return riskMap[risk.type as keyof typeof riskMap]?.label ?? '';
}
