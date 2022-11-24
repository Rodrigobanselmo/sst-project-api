import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
import { ClinicScheduleTypeEnum, ExamHistoryConclusionEnum, ExamHistoryEvaluationEnum, ExamHistoryTypeEnum, SexTypeEnum, StatusEnum } from '@prisma/client';
export declare class EmployeeComplementaryExamHistoryDto {
    examId: number;
    validityInMonths: number;
    clinicId: string;
    time: string;
    doneDate: Date;
    status: StatusEnum;
    scheduleType: ClinicScheduleTypeEnum;
}
export declare class CreateEmployeeExamHistoryDto {
    examId: number;
    employeeId: number;
    time: string;
    obs: string;
    clinicObs: string;
    validityInMonths: number;
    doctorId: number;
    clinicId: string;
    doneDate: Date;
    examType: ExamHistoryTypeEnum;
    evaluationType: ExamHistoryEvaluationEnum;
    conclusion: ExamHistoryConclusionEnum;
    status: StatusEnum;
    scheduleType?: ClinicScheduleTypeEnum;
    changeHierarchyDate?: Date;
    changeHierarchyAnyway?: boolean;
    hierarchyId?: string;
    subOfficeId?: string;
    examsData?: EmployeeComplementaryExamHistoryDto[];
}
declare const UpdateEmployeeExamHistoryDto_base: import("@nestjs/common").Type<Partial<CreateEmployeeExamHistoryDto>>;
export declare class UpdateEmployeeExamHistoryDto extends UpdateEmployeeExamHistoryDto_base {
    id: number;
    doctorId?: number;
    time?: string;
    evaluationType?: ExamHistoryEvaluationEnum;
    conclusion?: ExamHistoryConclusionEnum;
}
export declare class UpdateManyScheduleExamDto {
    cpf: string;
    name: string;
    phone: string;
    email: string;
    sex: SexTypeEnum;
    birthday: Date;
    isClinic: boolean;
    data?: UpdateEmployeeExamHistoryDto[];
}
export declare class UpdateFileExamDto {
    ids: number[];
}
export declare class FindEmployeeExamHistoryDto extends PaginationQueryDto {
    search?: string;
    companyId?: string;
    examId?: number;
    employeeId?: number;
    allCompanies?: boolean;
    allExams?: boolean;
    orderByCreation?: boolean;
    includeClinic?: boolean;
    status?: string[];
}
export declare class FindClinicEmployeeExamHistoryDto {
    companyId?: string;
    employeeId?: number;
    date: Date;
}
export declare class FindCompanyEmployeeExamHistoryDto extends PaginationQueryDto {
    search?: string;
    companyId?: string;
}
export {};
