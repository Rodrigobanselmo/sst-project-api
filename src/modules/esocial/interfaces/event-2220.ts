import { ExamHistoryEvaluationEnum, ExamHistoryTypeEnum } from '@prisma/client';
import { ElementCompact } from 'xml-js';
import { IEventProps } from './event-batch';

export enum EnumTpExameOcup {
  ADMI = 0,
  PERI = 1,
  RETU = 2,
  CHAN = 3,
  EVAL = 4,
  DEMI = 9,
}

export enum EnumResAso {
  APT = 1,
  INAPT = 2,
}

export const mapTpExameOcup: Record<
  ExamHistoryEvaluationEnum,
  EnumResAso | null
> = {
  [ExamHistoryEvaluationEnum.APTO]: EnumResAso.APT,
  [ExamHistoryEvaluationEnum.INAPT]: EnumResAso.INAPT,
  [ExamHistoryEvaluationEnum.NONE]: null,
  [ExamHistoryEvaluationEnum.INCONCLUSIVE]: null,
};

export const mapInverseTpExameOcup: Record<
  EnumResAso,
  ExamHistoryEvaluationEnum
> = {
  [EnumResAso.APT]: ExamHistoryEvaluationEnum.APTO,
  [EnumResAso.INAPT]: ExamHistoryEvaluationEnum.INAPT,
};

export const mapResAso: Record<ExamHistoryTypeEnum, EnumTpExameOcup | null> = {
  [ExamHistoryTypeEnum.ADMI]: EnumTpExameOcup.ADMI,
  [ExamHistoryTypeEnum.PERI]: EnumTpExameOcup.PERI,
  [ExamHistoryTypeEnum.RETU]: EnumTpExameOcup.RETU,
  [ExamHistoryTypeEnum.CHAN]: EnumTpExameOcup.CHAN,
  [ExamHistoryTypeEnum.OFFI]: EnumTpExameOcup.CHAN,
  [ExamHistoryTypeEnum.EVAL]: EnumTpExameOcup.EVAL,
  [ExamHistoryTypeEnum.DEMI]: EnumTpExameOcup.DEMI,
};

export const mapInverseResAso: Record<
  EnumTpExameOcup,
  ExamHistoryTypeEnum | null
> = {
  [EnumTpExameOcup.ADMI]: ExamHistoryTypeEnum.ADMI,
  [EnumTpExameOcup.PERI]: ExamHistoryTypeEnum.PERI,
  [EnumTpExameOcup.RETU]: ExamHistoryTypeEnum.RETU,
  [EnumTpExameOcup.CHAN]: ExamHistoryTypeEnum.CHAN,
  [EnumTpExameOcup.EVAL]: ExamHistoryTypeEnum.EVAL,
  [EnumTpExameOcup.DEMI]: ExamHistoryTypeEnum.DEMI,
};

export const requiredOrdExams = ['0281'];
// eslint-disable-next-line prettier/prettier
export const requiredObsProc =["0583", "0998", "0999", "1128", "1230", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "9999"]

export interface IEvent2220Props extends IEventProps {
  id: string;
  exMedOcup: {
    tpExameOcup: EnumTpExameOcup;
    aso: {
      dtAso: Date;
      resAso: EnumResAso;
      medico: {
        nmMed: string;
        nrCRM: string;
        ufCRM: string;
      };
      exame: {
        examName: string;
        dtExm: Date;
        procRealizado: string;
        obsProc?: string;
        ordExame?: number;
        indResult?: number;
      }[];
    };
    respMonit?: {
      cpfResp?: string;
      nmResp?: string;
      nrCRM?: string;
      ufCRM?: string;
    };
  };
}

// export interface IEvent2220 extends ElementCompact {
//   eSocial: {
//     ['_attributes']: {
//       xmlns: string;
//     };
//     evtMonit: {
//       ['_attributes']: {
//         Id: string;
//       };
//       ideEvento: {
//         indRetif: {
//           ['_text']: 1 | 2;
//         };
//         tpAmb: {
//           ['_text']: 1 | 2 | 7 | 8 | 9;
//         };
//         procEmi: {
//           ['_text']: 1 | 2 | 3 | 4 | 22;
//         };
//         verProc: {
//           ['_text']: string;
//         };
//         nrRecibo?: {
//           ['_text']: string;
//         };
//       };
//     };
//   };
// }

// export interface IEvent2220 extends ElementCompact {
//   ['elements']: [
//     {
//       eSocial: {
//         ['attributes']: {
//           xmlns: string;
//         };
//         ['elements']: [
//           {
//             evtMonit: {
//               ['attributes']: {
//                 Id: string;
//               };
//             };
//           },
//         ];
//       };
//     },
//   ];
// }

// const eventJs: IEvent2220 = {
//   ['_elements']: [
//     {
//       eSocial: {
//         ['_elements']: [
//           {
//             evtMonit: {
//               ['_attributes']: {
//                 Id: id[0],
//               },
//             },
//           },
//         ],
//         ['_attributes']: {
//           xmlns:
//             'http://www.esocial.gov.br/schema/evt/evtMonit/v_S_01_00_00',
//         },
//       },
//     },
//   ],
// };
