import { InviteUsers } from '.prisma/client';
import { ProfessionalEntity } from './professional.entity';
export declare class InviteUsersEntity implements InviteUsers {
    id: string;
    email: string;
    roles: string[];
    permissions: string[];
    expires_date: Date;
    companyId: string;
    companyName?: string;
    logo?: string;
    constructor(partial: Partial<InviteUsersEntity>);
    companiesIds: string[];
    groupId: number;
    professional: ProfessionalEntity;
}
