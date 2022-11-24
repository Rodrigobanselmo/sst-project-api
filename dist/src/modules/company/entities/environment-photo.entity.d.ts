import { CompanyCharacterizationPhoto } from '@prisma/client';
export declare class EnvironmentPhotoEntity implements CompanyCharacterizationPhoto {
    id: string;
    companyCharacterizationId: string;
    name: string;
    photoUrl: string | null;
    created_at: Date;
    isVertical: boolean;
    deleted_at: Date;
    updated_at: Date;
    order: number;
    constructor(partial: Partial<EnvironmentPhotoEntity>);
}
