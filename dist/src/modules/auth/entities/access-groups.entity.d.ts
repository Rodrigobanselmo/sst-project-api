import { AccessGroups } from '.prisma/client';
export declare class AccessGroupsEntity implements AccessGroups {
    id: number;
    created_at: Date;
    roles: string[];
    permissions: string[];
    companyId: string;
    system: boolean;
    name: string;
    description: string;
    constructor(partial: Partial<AccessGroupsEntity>);
}
