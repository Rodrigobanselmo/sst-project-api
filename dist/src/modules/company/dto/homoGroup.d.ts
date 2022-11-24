import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
import { HomoTypeEnum, StatusEnum } from '@prisma/client';
export declare class HierarchyOnHomoDto {
    workspaceId: string;
    id: string;
}
export declare class CreateHomoGroupDto {
    id?: string;
    name: string;
    type?: HomoTypeEnum;
    description: string;
    status?: StatusEnum;
    companyId: string;
    startDate?: Date;
    endDate?: Date;
    readonly hierarchies?: HierarchyOnHomoDto[];
}
export declare class UpdateHomoGroupDto {
    id?: string;
    type?: HomoTypeEnum;
    description?: string;
    name: string;
    startDate?: Date;
    endDate?: Date;
    readonly hierarchies?: HierarchyOnHomoDto[];
}
export declare class UpdateHierarchyHomoGroupDto {
    ids: number[];
    startDate?: Date;
    endDate?: Date;
    workspaceId: string;
}
export declare class CopyHomogeneousGroupDto {
    actualGroupId: string;
    riskGroupId: string;
    copyFromHomoGroupId: string;
    companyIdFrom: string;
    riskGroupIdFrom: string;
    type?: HomoTypeEnum;
    workspaceId?: string;
    hierarchyId?: string;
}
export declare class FindHomogeneousGroupDto extends PaginationQueryDto {
    search?: string;
    name?: string;
    companyId?: string;
    type?: HomoTypeEnum[];
}
