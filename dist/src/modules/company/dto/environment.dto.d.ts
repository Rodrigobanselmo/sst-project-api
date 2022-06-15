import { CompanyEnvironmentTypesEnum } from '@prisma/client';
export declare class UpsertEnvironmentDto {
    id?: string;
    name?: string;
    type?: CompanyEnvironmentTypesEnum;
    description?: string;
    photos?: string[];
    parentEnvironmentId?: string;
    hierarchyIds?: string[];
}
export declare class AddPhotoEnvironmentDto {
    companyEnvironmentId: string;
    name: string;
}
