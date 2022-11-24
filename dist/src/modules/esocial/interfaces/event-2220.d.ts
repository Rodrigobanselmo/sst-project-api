import { ExamHistoryEvaluationEnum, ExamHistoryTypeEnum } from '@prisma/client';
import { IEventProps } from './event-batch';
export declare enum EnumTpExameOcup {
    ADMI = 0,
    PERI = 1,
    RETU = 2,
    CHAN = 3,
    EVAL = 4,
    DEMI = 9
}
export declare enum EnumResAso {
    APT = 1,
    INAPT = 2
}
export declare const mapTpExameOcup: Record<ExamHistoryEvaluationEnum, EnumResAso | null>;
export declare const mapInverseTpExameOcup: Record<EnumResAso, ExamHistoryEvaluationEnum>;
export declare const mapResAso: Record<ExamHistoryTypeEnum, EnumTpExameOcup | null>;
export declare const mapInverseResAso: Record<EnumTpExameOcup, ExamHistoryTypeEnum | null>;
export declare const requiredOrdExams: string[];
export declare const requiredObsProc: string[];
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
