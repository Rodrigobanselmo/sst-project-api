import { CharacterizationTypeEnum } from '@prisma/client';
export declare class UpsertCharacterizationDto {
    id?: string;
    name?: string;
    type?: CharacterizationTypeEnum;
    description?: string;
    photos?: string[];
    order?: number;
    hierarchyIds?: string[];
    paragraphs?: string[];
    considerations?: string[];
    activities?: string[];
    noiseValue?: string;
    temperature?: string;
    moisturePercentage?: string;
    luminosity?: string;
    profileName?: string;
    profileParentId?: string;
    startDate?: Date;
    endDate?: Date;
}
export declare class AddPhotoCharacterizationDto {
    companyCharacterizationId: string;
    name: string;
}
export declare class UpdatePhotoCharacterizationDto {
    id?: string;
    order: number;
    name: string;
}
export declare class CopyCharacterizationDto {
    companyCopyFromId: string;
    workspaceId: string;
    characterizationIds: string[];
}
