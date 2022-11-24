import { EmployeeEntity } from './../../company/entities/employee.entity';
import { ExamHistoryEvaluationEnum } from '@prisma/client';
import { RiskFactorsEntity } from './../../sst/entities/risk.entity';
import { RiskFactorDataEntity } from './../../sst/entities/riskData.entity';
import { ProfessionalEntity } from './../../users/entities/professional.entity';
import { IEventProps } from './event-batch';
import { IdeOCEnum } from './esocial';
export declare enum LocalAmbEnum {
    OWNER = 1,
    NOT_OWNER = 2
}
export declare enum TpAvalEnum {
    QUANTITY = 1,
    QUALITY = 2
}
export declare enum TpInscEnum {
    CNPJ = 1,
    CAEPF = 3,
    CNO = 4
}
export declare enum YesNoEnum {
    YES = "S",
    NO = "N"
}
export declare enum utileEpiEpcEnum {
    NOT_APT = 0,
    NOT_IMPLEMENTED = 1,
    IMPLEMENTED = 2
}
export declare const UnMedEnum: {
    "dose di\u00E1ria de ru\u00EDdo": number;
    "dB (linear)": number;
    "dB(C)": number;
    "dB(A)": number;
    "m/s2": number;
    "m/s1,75": number;
    ppm: number;
    "mg/m3": number;
    "f/cm3": number;
    ºC: number;
    "m/s": number;
    "%": number;
    lx: number;
    "ufc/m3": number;
    "dose di\u00E1ria": number;
    "dose mensal": number;
    "dose trimestral": number;
    "dose anual": number;
    "W/m2": number;
    "A/m": number;
    mT: number;
    μT: number;
    mA: number;
    "kV/m": number;
    "V/m": number;
    "J/m2": number;
    "mJ/cm2": number;
    mSv: number;
    mppdc: number;
    "UR (%)": number;
};
export declare enum EnumResAso {
    APT = 1,
    INAPT = 2
}
export declare const mapTpExameOcup: Record<ExamHistoryEvaluationEnum, EnumResAso | null>;
export declare const mapInverseTpExameOcup: Record<EnumResAso, ExamHistoryEvaluationEnum>;
export declare const requiredLimTol: string[];
export declare const requiredTpAval: string[];
export declare const requiredDescAg: string[];
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
            obs?: {
                obsCompl: string;
            };
        };
    };
}
export declare type IPriorRiskData = {
    riskData: RiskFactorDataEntity;
    riskFactor: RiskFactorsEntity;
};
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
export declare type IEmployee2240Data = EmployeeEntity & {
    actualPPPHistory?: IBreakPointPPP[];
};
