import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { ClinicScheduleTypeEnum, Prisma, StatusEnum } from '@prisma/client';
export declare class UpsertExamToClinicDto {
    id?: number;
    examId: number;
    companyId: string;
    groupId?: string;
    dueInDays?: number;
    isScheduled?: boolean;
    observation?: string;
    price?: number;
    scheduleRange?: Prisma.JsonValue;
    examMinDuration?: number;
    isPeriodic?: boolean;
    isChange?: boolean;
    isAdmission?: boolean;
    isReturn?: boolean;
    isDismissal?: boolean;
    scheduleType?: ClinicScheduleTypeEnum;
    startDate: Date;
    endDate: Date;
    status?: StatusEnum;
}
export declare class UpsertManyExamToClinicDto {
    data: UpsertExamToClinicDto[];
    companyId: string;
}
export declare class CopyExamsToClinicDto {
    fromCompanyId: string;
    companyId: string;
    overwrite?: boolean;
}
export declare class FindExamToClinicDto extends PaginationQueryDto {
    name?: string;
    search?: string;
    companyId?: string;
    examId?: number;
    endDate: Date | null;
    orderBy?: string;
    groupId?: string;
    orderByDirection?: 'asc' | 'desc';
}
