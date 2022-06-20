import { CompanyEnvironment, CompanyEnvironmentTypesEnum } from '@prisma/client';
import { EnvironmentPhotoEntity } from './environment-photo.entity';
import { WorkspaceEntity } from './workspace.entity';
export declare class EnvironmentEntity implements CompanyEnvironment {
    id: string;
    name: string;
    description: string | null;
    created_at: Date;
    type: CompanyEnvironmentTypesEnum;
    parentEnvironmentId: string;
    workspace?: WorkspaceEntity;
    photos?: EnvironmentPhotoEntity[];
    constructor(partial: Partial<EnvironmentEntity>);
    vision: string;
    deleted_at: Date;
    updated_at: Date;
    workspaceId: string;
    companyId: string;
}
