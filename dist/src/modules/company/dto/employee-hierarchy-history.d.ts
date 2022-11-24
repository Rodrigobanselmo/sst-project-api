import { EmployeeHierarchyMotiveTypeEnum } from '@prisma/client';
import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
export declare class CreateEmployeeHierarchyHistoryDto {
    employeeId: number;
    hierarchyId: string;
    subOfficeId?: string;
    startDate: Date;
    motive: EmployeeHierarchyMotiveTypeEnum;
}
declare const UpdateEmployeeHierarchyHistoryDto_base: import("@nestjs/common").Type<Partial<CreateEmployeeHierarchyHistoryDto>>;
export declare class UpdateEmployeeHierarchyHistoryDto extends UpdateEmployeeHierarchyHistoryDto_base {
    id: number;
}
export declare class FindEmployeeHierarchyHistoryDto extends PaginationQueryDto {
    companyId?: string;
    hierarchyId?: string;
    employeeId?: number;
}
export {};
