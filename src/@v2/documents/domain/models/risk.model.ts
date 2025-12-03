import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';
import { RiskDocumentsRequirementVO } from '@/@v2/shared/domain/values-object/document/risk-documents-requirement.vo';

export enum RiskPericulosidadeEnum {
  EXPLOSIVOS_1 = 'EXPLOSIVOS_1',
  INFLAMAVEIS_2 = 'INFLAMAVEIS_2',
  ROUBO_3 = 'ROUBO_3',
  ELETRICIDADE_4 = 'ELETRICIDADE_4',
  MOTOCICLETA_5 = 'MOTOCICLETA_5',
  RADIACAO_6 = 'RADIACAO_6',
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
}
