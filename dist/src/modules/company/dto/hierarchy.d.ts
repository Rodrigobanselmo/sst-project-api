import { HierarchyEnum, StatusEnum } from '@prisma/client';
export declare class CreateHierarchyDto {
    name: string;
    status: StatusEnum;
    type: HierarchyEnum;
    companyId: string;
    description?: string;
    workspaceIds?: string[];
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
    status?: StatusEnum;
    type?: HierarchyEnum;
    companyId?: string;
    workspaceIds?: string[];
    parentId?: string;
}
export declare class UpsertManyHierarchyDto {
    readonly data: UpsertHierarchyDto[];
}
export {};
