export declare class ExamsRiskDataDto {
    examId?: number;
    riskFactorDataId?: string;
    isMale?: boolean;
    isFemale: boolean;
    isPeriodic: boolean;
    isChange: boolean;
    isAdmission: boolean;
    isReturn: boolean;
    isDismissal: boolean;
    validityInMonths: number;
    lowValidityInMonths: number;
    considerBetweenDays: number;
    fromAge: number;
    toAge: number;
}
