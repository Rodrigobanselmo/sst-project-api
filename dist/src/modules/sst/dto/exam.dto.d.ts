import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { ExamTypeEnum, StatusEnum } from '@prisma/client';
export declare class CreateExamDto {
    name: string;
    companyId: string;
    analyses?: string;
    instruction?: string;
    material?: string;
    esocial27Code?: string;
    isAttendance?: boolean;
    type?: ExamTypeEnum;
    status?: StatusEnum;
}
declare const UpdateExamDto_base: import("@nestjs/common").Type<Partial<CreateExamDto>>;
export declare class UpdateExamDto extends UpdateExamDto_base {
}
export declare class UpsertExamDto extends CreateExamDto {
    id: number;
}
export declare class FindExamDto extends PaginationQueryDto {
    name?: string;
    search?: string;
    companyId?: string;
    status?: StatusEnum;
}
export declare class FindExamHierarchyDto {
    hierarchyId?: string;
    employeeId?: number;
    isPendingExams?: boolean;
    onlyAttendance?: boolean;
    isOffice?: boolean;
    isPeriodic?: boolean;
    isChange?: boolean;
    isAdmission?: boolean;
    isReturn?: boolean;
    isDismissal?: boolean;
}
export {};
