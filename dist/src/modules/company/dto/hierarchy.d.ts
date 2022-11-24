import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { HierarchyEnum, StatusEnum } from '@prisma/client';
export declare class CreateHierarchyDto {
    name: string;
    status: StatusEnum;
    type: HierarchyEnum;
    companyId: string;
    ghoName: string;
    description?: string;
    realDescription?: string;
    workspaceIds?: string[];
    employeesIds?: number[];
    parentId?: string;
    readonly children?: CreateHierarchyDto[];
}
declare const UpdateHierarchyDto_base: import("@nestjs/common").Type<Partial<CreateHierarchyDto>>;
export declare class UpdateHierarchyDto extends UpdateHierarchyDto_base {
    id?: string;
}
export declare class UpsertHierarchyDto {
    id?: string;
    name?: string;
    employeesIds?: number[];
    status?: StatusEnum;
    type?: HierarchyEnum;
    companyId?: string;
    refName?: string;
    workspaceIds?: string[];
    parentId?: string;
    description?: string;
    realDescription?: string;
}
export declare class UpsertManyHierarchyDto {
    readonly data: UpsertHierarchyDto[];
}
export declare class UpdateSimpleHierarchyDto {
    id: string;
    refName?: string;
}
export declare class UpdateSimpleManyHierarchyDto {
    readonly data: UpdateSimpleHierarchyDto[];
}
export declare class CreateSubHierarchyDto {
    id: string;
    name: string;
    realDescription: string;
    status: StatusEnum;
    companyId: string;
    employeesIds?: number[];
    parentId?: string;
}
export declare class FindHierarchyDto extends PaginationQueryDto {
    search?: string;
    name?: string;
    companyId?: string;
    hierarchyId?: string;
    homogeneousGroupId?: string;
    endDate: Date;
}
export {};
