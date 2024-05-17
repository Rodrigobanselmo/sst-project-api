import { AppendixEnum, OtherAppendixEnum } from './../../../shared/constants/enum/appendix';
import { QuantityTypeEnum } from './../../company/interfaces/risk-data-json.types';
import { ApiProperty } from '@nestjs/swagger';

import { Prisma, RiskFactors, RiskFactorsEnum } from '.prisma/client';
import { GrauInsalubridade, StatusEnum } from '@prisma/client';
import { RecMedEntity } from './recMed.entity';
import { GenerateSourceEntity } from './generateSource.entity';
import { ExamRiskEntity } from './examRisk.entity';
import { RiskFactorDataEntity } from './riskData.entity';
import { RiskDocInfoEntity } from './riskDocInfo.entity';
import { EsocialTable24Entity } from '../../../modules/esocial/entities/esocialTable24.entity';
import { ProtocolToRiskEntity } from './protocol.entity';
import { isRiskQuantity } from '../../../shared/utils/isRiskQuantity';

export type RiskFactorActivitie = {
  description: string;
  subActivities: {
    description: string;
  }[]
}

export class RiskFactorsEntity implements RiskFactors {
  @ApiProperty({ description: 'The id of the Company' })
  id: string;

  @ApiProperty({ description: 'The name of the risk' })
  name: string;

  search: string;


  @ApiProperty({ description: 'The severity of the rik' })
  severity: number;

  @ApiProperty({
    description: 'The current type of the risk',
    examples: ['BIO', 'QUI', 'FIS'],
  })
  type: RiskFactorsEnum;

  @ApiProperty({ description: 'The company id related to the risk' })
  companyId: string;

  @ApiProperty({
    description: 'If risk was created from one of simple professionals',
  })
  system: boolean;

  @ApiProperty({
    description: 'If represent all risks',
  })
  representAll: boolean;

  @ApiProperty({
    description: 'The current status of the risk',
    examples: ['ACTIVE', 'PENDING', 'CANCELED'],
  })
  status: StatusEnum;

  @ApiProperty({ description: 'The creation date of the risk' })
  created_at: Date;

  updated_at: Date;

  @ApiProperty({ description: 'The appendix date of the risk' })
  appendix: string;

  @ApiProperty({ description: 'The propagation array of the risk' })
  propagation: string[];

  @ApiProperty({
    description: 'The array with recommendations and measure controls data',
  })
  recMed?: RecMedEntity[];

  @ApiProperty({ description: 'The array with generate source data' })
  generateSource?: GenerateSourceEntity[];

  @ApiProperty({ description: 'The deleted date of data' })
  deleted_at: Date | null;

  task: string | null;
  risk: string;
  symptoms: string;

  isEmergency: boolean;
  json: Prisma.JsonValue;
  exame: string;
  method: string;
  unit: string;
  cas: string;
  breather: string;
  nr15lt: string;
  twa: string;
  stel: string;
  vmp: string;
  ipvs: string;
  pv: string;
  pe: string;
  fraction: string;
  tlv: string;
  coments: string;
  carnogenicityACGIH: string;
  carnogenicityLinach: string;
  otherAppendix: string | null;
  activities: RiskFactorActivitie[] | null;
  grauInsalubridade: GrauInsalubridade | null;
  synonymous: string[];

  examToRisk: ExamRiskEntity[];
  riskFactorData: RiskFactorDataEntity[];
  docInfo?: RiskDocInfoEntity[];
  protocolToRisk?: ProtocolToRiskEntity[];


  isAso: boolean;
  isPGR: boolean;
  isPCMSO: boolean;
  isPPP: boolean;

  esocialCode: string;
  esocial?: EsocialTable24Entity;

  constructor(partial: Partial<Omit<RiskFactorsEntity, 'activities'>>) {
    Object.assign(this, partial);
    this.vmp = String(this.getVMP(this?.nr15lt || ''));

    if (this.riskFactorData) {
      this.riskFactorData = this.riskFactorData.map((riskData) => new RiskFactorDataEntity(riskData));
    }
  }

  private getVMP(nr15lt?: string) {
    if (!nr15lt) return '';
    if (nr15lt == '-') return '';

    const LT = Number(nr15lt.replace(/[^0-9.]/g, ''));

    if (LT <= 1) return 3 * LT;
    if (LT <= 10) return 2 * LT;
    if (LT <= 100) return 1.5 * LT;
    if (LT <= 1000) return 1.25 * LT;
    return 1.1 * LT;
  }

  public getRiskType() {
    return isRiskQuantity(this);
  }

  public getAnexo(): AppendixEnum {
    const apendixNumber = Number(this.appendix);
    // 6 = Anexo 6 Pressão Hiperbarica !!!!(ATIVIDADES)
    // 7 = Anexo 7 RAD Não Ionizantes
    // 9 = Anexo 9 FRIO 
    // 10 = Anexo 10 Umidade
    // 11 = Anexo 11 QUIMICO NR 15
    // 12 = Anexo 12 POEIRAS  
    // 13 = Anexo 13 QUIMICO !!!!(ATIVIDADES)
    if (apendixNumber && !Number.isNaN(apendixNumber)) return apendixNumber

    // A = Riscos de Acidentes
    if (this.type === 'ACI') return AppendixEnum.ACI
    // E = Riscos Ergonomicos
    if (this.type === 'ERG') return AppendixEnum.ERG
    // N = Riscos não relacionados
    if (this.type === 'OUTROS') return AppendixEnum.OUTROS

    const type = this.getRiskType();
    const isNoise = type == QuantityTypeEnum.NOISE
    const isNoisImpact = isNoise && this.name.toLocaleLowerCase().includes('impacto');

    // 1 = Anexo 1
    if (isNoise && !isNoisImpact) return 1

    // 2 = Anexo 2 Ruido Impacto
    if (isNoise) return 2

    // 3 = Anexo 3
    if (type == QuantityTypeEnum.HEAT) return 3

    // 5 = Anexo 5
    if (type == QuantityTypeEnum.RADIATION) return 5

    // 8 = Anexo 8
    if (type == QuantityTypeEnum.VL || type == QuantityTypeEnum.VFB) return 8

    // 14 = Anexo 14
    if (this.type === 'BIO') return 14
  }
}
