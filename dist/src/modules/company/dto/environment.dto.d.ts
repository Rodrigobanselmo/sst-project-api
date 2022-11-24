import { CharacterizationTypeEnum } from '@prisma/client';
export declare class UpsertEnvironmentDto {
    id?: string;
    name?: string;
    type?: CharacterizationTypeEnum;
    description?: string;
    photos?: string[];
    order?: number;
    hierarchyIds?: string[];
    considerations?: string[];
    activities?: string[];
    noiseValue?: string;
    temperature?: string;
    moisturePercentage?: string;
    luminosity?: string;
    profileName: string;
    profileParentId: string;
}
export declare class AddPhotoEnvironmentDto {
    companyCharacterizationId: string;
    name: string;
}
export declare class UpdatePhotoEnvironmentDto {
    id?: string;
    order: number;
    name: string;
}
