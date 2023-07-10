import { HierarchyEntity } from './../../company/entities/hierarchy.entity';
import { EmployeeEntity } from './../../company/entities/employee.entity';
import { ExamHistoryEvaluationEnum } from '@prisma/client';

import { RiskFactorsEntity } from './../../sst/entities/risk.entity';
import { RiskFactorDataEntity } from './../../sst/entities/riskData.entity';
import { ProfessionalEntity } from './../../users/entities/professional.entity';
import { IEventProps } from './event-batch';
import { IdeOCEnum } from './esocial';

export enum LocalAmbEnum {
  OWNER = 1,
  NOT_OWNER = 2,
}

export enum TpAvalEnum {
  QUANTITY = 1,
  QUALITY = 2,
}

export enum TpInscEnum {
  CNPJ = 1,
  CAEPF = 3,
  CNO = 4,
}

export enum YesNoEnum {
  YES = 'S',
  NO = 'N',
}

export enum utileEpiEpcEnum {
  NOT_APT = 0,
  NOT_IMPLEMENTED = 1,
  IMPLEMENTED = 2,
}

export const UnMedEnum = {
  ['dose diária de ruído']: 1,
  ['dB (linear)']: 2,
  ['dB(C)']: 3,
  ['dB(A)']: 4,
  ['m/s2']: 5,
  ['m/s1,75']: 6,
  ['ppm']: 7,
  ['mg/m3']: 8,
  ['f/cm3']: 9,
  ['ºC']: 10,
  ['m/s']: 11,
  ['%']: 12,
  ['lx']: 13,
  ['ufc/m3']: 14,
  ['dose diária']: 15,
  ['dose mensal']: 16,
  ['dose trimestral']: 17,
  ['dose anual']: 18,
  ['W/m2']: 19,
  ['A/m']: 20,
  ['mT']: 21,
  ['μT']: 22,
  ['mA']: 23,
  ['kV/m']: 24,
  ['V/m']: 25,
  ['J/m2']: 26,
  ['mJ/cm2']: 27,
  ['mSv']: 28,
  ['mppdc']: 29,
  ['UR (%)']: 30,
};

export enum EnumResAso {
  APT = 1,
  INAPT = 2,
}

export const mapTpExameOcup: Record<ExamHistoryEvaluationEnum, EnumResAso | null> = {
  [ExamHistoryEvaluationEnum.APTO]: EnumResAso.APT,
  [ExamHistoryEvaluationEnum.INAPT]: EnumResAso.INAPT,
  [ExamHistoryEvaluationEnum.NONE]: null,
  [ExamHistoryEvaluationEnum.INCONCLUSIVE]: null,
};

export const mapInverseTpExameOcup: Record<EnumResAso, ExamHistoryEvaluationEnum> = {
  [EnumResAso.APT]: ExamHistoryEvaluationEnum.APTO,
  [EnumResAso.INAPT]: ExamHistoryEvaluationEnum.INAPT,
};

export const requiredLimTol = ['02.01.014', '01.18.001']; // Calor e Silica

export const requiredTpAval = ['09.01.001'];
export const requiredDescAg = ['01.01.001', '01.02.001', '01.03.001', '01.04.001', '01.05.001', '01.06.001', '01.07.001', '01.08.001', '01.09.001', '01.10.001', '01.12.001', '01.13.001', '01.14.001', '01.15.001', '01.16.001', '01.17.001', '01.18.001', '05.01.001']

export interface IEvent2240Props extends IEventProps {
  id: string;
  evtExpRisco: {
    infoExpRisco: {
      dtIniCondicao: Date;
      infoAmb: {
        localAmb: LocalAmbEnum;
        dscSetor: string;
        nrInsc: string;
      }[];
      infoAtiv: {
        dscAtivDes: string;
      };
      agNoc: {
        nameAgNoc: string;
        codAgNoc: string;
        dscAgNoc?: string;
        tpAval?: TpAvalEnum;
        intConc?: number;
        limTol?: number;
        unMed?: typeof UnMedEnum[keyof typeof UnMedEnum];
        tecMedicao?: string;
        epcEpi?: {
          utilizEPC: utileEpiEpcEnum;
          eficEpc?: YesNoEnum;
          utilizEPI: utileEpiEpcEnum;
          eficEpi?: YesNoEnum;
          epi?: {
            docAval: string;
          }[];
          epiCompl?: {
            medProtecao?: YesNoEnum;
            condFuncto?: YesNoEnum;
            usoInint?: YesNoEnum;
            przValid?: YesNoEnum;
            periodicTroca?: YesNoEnum;
            higienizacao?: YesNoEnum;
          };
        };
      }[];
      respReg: {
        cpfResp: string;
        ideOC?: IdeOCEnum;
        dscOC?: string;
        nrOC?: string;
        ufOC?: string;
      }[];
      obs?: { obsCompl: string };
    };
  };
}

export type IPriorRiskData = { riskData: RiskFactorDataEntity; riskFactor: RiskFactorsEntity };

export interface IBreakPointPPP {
  environments?: {
    isOwner: boolean;
    sectorName: string;
    cnpj: string;
  }[];
  responsible?: Partial<ProfessionalEntity>;
  risks?: IPriorRiskData[];
  desc?: string;
  riskData?: RiskFactorDataEntity[];
  date: Date;
}

export type IEmployee2240Data = EmployeeEntity & { actualPPPHistory?: IBreakPointPPP[]; sectorHierarchy?: Partial<HierarchyEntity> };
