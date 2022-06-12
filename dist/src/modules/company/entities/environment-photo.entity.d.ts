import { CompanyEnvironmentPhoto } from '@prisma/client';
export declare class EnvironmentPhotoEntity implements CompanyEnvironmentPhoto {
    id: string;
    companyEnvironmentId: string;
    name: string;
    photoUrl: string | null;
    created_at: Date;
    deleted_at: Date;
    updated_at: Date;
    constructor(partial: Partial<EnvironmentPhotoEntity>);
}
