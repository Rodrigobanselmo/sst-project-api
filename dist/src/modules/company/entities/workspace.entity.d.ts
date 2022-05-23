import { Workspace } from '.prisma/client';
import { StatusEnum } from '@prisma/client';
import { AddressEntity } from './address.entity';
import { CompanyEntity } from './company.entity';
export declare class WorkspaceEntity implements Workspace {
    id: string;
    name: string;
    status: StatusEnum;
    created_at: Date;
    updated_at: Date;
    companyId: string;
    address?: AddressEntity;
    company?: CompanyEntity;
    description: string;
    constructor(partial: Partial<WorkspaceEntity>);
    abbreviation: string;
}
