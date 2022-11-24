import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
export declare class CreateExamsRiskDto {
    examId: number;
    riskId: string;
    companyId: string;
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
    minRiskDegree: number;
    minRiskDegreeQuantity: number;
    startDate: Date;
    endDate: Date;
}
declare const UpdateExamRiskDto_base: import("@nestjs/common").Type<Partial<CreateExamsRiskDto>>;
export declare class UpdateExamRiskDto extends UpdateExamRiskDto_base {
    id?: number;
}
export declare class CopyExamsRiskDto {
    fromCompanyId: string;
    companyId: string;
    overwrite?: boolean;
}
export declare class UpsertManyExamsRiskDto {
    data: UpdateExamRiskDto[];
    companyId: string;
}
export declare class FindExamRiskDto extends PaginationQueryDto {
    search?: string;
    companyId?: string;
}
export {};
