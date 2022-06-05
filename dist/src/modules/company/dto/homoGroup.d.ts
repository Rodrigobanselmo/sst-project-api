import { StatusEnum } from '@prisma/client';
export declare class HierarchyOnHomoDto {
    workspaceId: string;
    id: string;
}
export declare class CreateHomoGroupDto {
    name: string;
    description: string;
    status?: StatusEnum;
    companyId: string;
}
export declare class UpdateHomoGroupDto {
    id?: string;
    description?: string;
    name: string;
    readonly hierarchies?: HierarchyOnHomoDto[];
}
