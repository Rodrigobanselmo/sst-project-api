import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';
import { RiskDocumentsRequirementVO } from '@/@v2/shared/domain/values-object/document/risk-documents-requirement.vo';
import { GrauInsalubridade } from '@prisma/client';

export enum RiskPericulosidadeEnum {
  EXPLOSIVOS_1 = 'EXPLOSIVOS_1',
  INFLAMAVEIS_2 = 'INFLAMAVEIS_2',
  ROUBO_3 = 'ROUBO_3',
  ELETRICIDADE_4 = 'ELETRICIDADE_4',
  MOTOCICLETA_5 = 'MOTOCICLETA_5',
  RADIACAO_6 = 'RADIACAO_6',
}

export enum RiskInsalubridadeEnum {
  RUIDO_CONTINUO_1 = 'RUIDO_CONTINUO_1',
  RUIDO_IMPACTO_2 = 'RUIDO_IMPACTO_2',
  CALOR_3 = 'CALOR_3',
  RADIACAO_IONIZANTE_5 = 'RADIACAO_IONIZANTE_5',
  PRESSAO_HIPERBARICA_6 = 'PRESSAO_HIPERBARICA_6',
  RADIACAO_NAO_IONIZANTE_7 = 'RADIACAO_NAO_IONIZANTE_7',
  VIBRACAO_8 = 'VIBRACAO_8',
  FRIO_9 = 'FRIO_9',
  UMIDADE_10 = 'UMIDADE_10',
  AGENTES_QUIMICOS_11 = 'AGENTES_QUIMICOS_11',
  POEIRAS_MINERAIS_12 = 'POEIRAS_MINERAIS_12',
  AGENTES_QUIMICOS_QUALITATIVO_13 = 'AGENTES_QUIMICOS_QUALITATIVO_13',
  BENZENO_13A = 'BENZENO_13A',
  AGENTES_BIOLOGICOS_14 = 'AGENTES_BIOLOGICOS_14',
}

export type IRiskModel = {
  id: string;
  name: string;
  severity: number;
  type: RiskTypeEnum;
  isEmergency: boolean;
  isRepresentAll: boolean;
  unit: string | null;
  cas: string | null;
  propagation: string[] | null;
  appendix: string | null;
  nr15lt: string | null;
  twa: string | null;
  stel: string | null;
  ipvs: string | null;
  pe: string | null;
  pv: string | null;
  carnogenicityACGIH: string | null;
  carnogenicityLinach: string | null;
  symptoms: string | null;
  healthRisk: string | null;
  otherAppendix: string | null;
  grauInsalubridade: GrauInsalubridade | null;

  requirement: { document: RiskDocumentsRequirementVO };
  documentsRequirements: RiskDocumentsRequirementVO[];
};

export class RiskModel {
  id: string;
  name: string;
  severity: number;
  type: RiskTypeEnum;
  isEmergency: boolean;
  isRepresentAll: boolean;
  unit: string | null;
  cas: string | null;
  propagation: string[] | null;
  appendix: string | null;
  nr15lt: string | null;
  twa: string | null;
  stel: string | null;
  ipvs: string | null;
  pe: string | null;
  pv: string | null;
  carnogenicityACGIH: string | null;
  carnogenicityLinach: string | null;
  symptoms: string | null;
  healthRisk: string | null;
  otherAppendix: string | null;
  grauInsalubridade: GrauInsalubridade | null;

  #requirements: { document: RiskDocumentsRequirementVO };
  #documentsRequirements: RiskDocumentsRequirementVO[];

  constructor(params: IRiskModel) {
    this.id = params.id;
    this.name = params.name;
    this.severity = params.severity;
    this.type = params.type;
    this.isEmergency = params.isEmergency;
    this.isRepresentAll = params.isRepresentAll;
    this.unit = params.unit;
    this.cas = params.cas;
    this.propagation = params.propagation;
    this.appendix = params.appendix;
    this.nr15lt = params.nr15lt;
    this.twa = params.twa;
    this.stel = params.stel;
    this.ipvs = params.ipvs;
    this.pe = params.pe;
    this.pv = params.pv;
    this.carnogenicityACGIH = params.carnogenicityACGIH;
    this.carnogenicityLinach = params.carnogenicityLinach;
    this.symptoms = params.symptoms;
    this.healthRisk = params.healthRisk;
    this.otherAppendix = params.otherAppendix;
    this.grauInsalubridade = params.grauInsalubridade;

    this.#requirements = params.requirement;
    this.#documentsRequirements = params.documentsRequirements;
  }

  get documentsRequirements() {
    const documentsRequirements = this.#documentsRequirements;
    documentsRequirements.push(this.#requirements.document);
    return documentsRequirements;
  }

  get isPericulosidade() {
    return this.otherAppendix?.includes('NR 16');
  }

  get periculosidade() {
    if (!this.isPericulosidade) return null;

    if (this.otherAppendix.includes('NR 16 Anexo 1')) return RiskPericulosidadeEnum.EXPLOSIVOS_1;
    if (this.otherAppendix.includes('NR 16 Anexo 2')) return RiskPericulosidadeEnum.INFLAMAVEIS_2;
    if (this.otherAppendix.includes('NR 16 Anexo 3')) return RiskPericulosidadeEnum.ROUBO_3;
    if (this.otherAppendix.includes('NR 16 Anexo 4')) return RiskPericulosidadeEnum.ELETRICIDADE_4;
    if (this.otherAppendix.includes('NR 16 Anexo 5')) return RiskPericulosidadeEnum.MOTOCICLETA_5;
    if (this.otherAppendix.includes('NR 16 Anexo 6')) return RiskPericulosidadeEnum.RADIACAO_6;
    return null;
  }

  get isInsalubridade() {
    return !!this.appendix;
  }

  get insalubridade() {
    if (!this.isInsalubridade) return null;

    // O campo appendix já é implícito da NR-15, então basta comparar diretamente
    if (this.appendix == '1') return RiskInsalubridadeEnum.RUIDO_CONTINUO_1;
    if (this.appendix == '2') return RiskInsalubridadeEnum.RUIDO_IMPACTO_2;
    if (this.appendix == '3') return RiskInsalubridadeEnum.CALOR_3;
    if (this.appendix == '5') return RiskInsalubridadeEnum.RADIACAO_IONIZANTE_5;
    if (this.appendix == '6') return RiskInsalubridadeEnum.PRESSAO_HIPERBARICA_6;
    if (this.appendix == '7') return RiskInsalubridadeEnum.RADIACAO_NAO_IONIZANTE_7;
    if (this.appendix == '8') return RiskInsalubridadeEnum.VIBRACAO_8;
    if (this.appendix == '9') return RiskInsalubridadeEnum.FRIO_9;
    if (this.appendix == '10') return RiskInsalubridadeEnum.UMIDADE_10;
    if (this.appendix == '11') return RiskInsalubridadeEnum.AGENTES_QUIMICOS_11;
    if (this.appendix == '12') return RiskInsalubridadeEnum.POEIRAS_MINERAIS_12;
    if (this.appendix == '13-A') return RiskInsalubridadeEnum.BENZENO_13A;
    if (this.appendix == '13') return RiskInsalubridadeEnum.AGENTES_QUIMICOS_QUALITATIVO_13;
    if (this.appendix == '14') return RiskInsalubridadeEnum.AGENTES_BIOLOGICOS_14;
    return null;
  }
}
