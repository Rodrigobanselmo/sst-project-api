import { CompanyEnvironmentTypesEnum } from '@prisma/client';
export declare class UpsertEnvironmentDto {
    id?: string;
    name?: string;
    type?: CompanyEnvironmentTypesEnum;
    description?: string;
    parentEnvironmentId?: string;
    hierarchyIds?: string[];
}
export declare class UpsertPhotoEnvironmentDto {
    id: string;
    name: string;
}
