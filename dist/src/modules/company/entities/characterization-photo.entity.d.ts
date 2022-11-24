import { CompanyCharacterizationPhoto } from '@prisma/client';
export declare class CharacterizationPhotoEntity implements CompanyCharacterizationPhoto {
    id: string;
    name: string;
    photoUrl: string | null;
    created_at: Date;
    isVertical: boolean;
    order: number;
    deleted_at: Date;
    updated_at: Date;
    companyCharacterizationId: string;
    constructor(partial: Partial<CharacterizationPhotoEntity>);
}
