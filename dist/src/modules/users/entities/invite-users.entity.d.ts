import { InviteUsers } from '.prisma/client';
export declare class InviteUsersEntity implements InviteUsers {
    id: string;
    email: string;
    roles: string[];
    permissions: string[];
    expires_date: Date;
    companyId: string;
    constructor(partial: Partial<InviteUsersEntity>);
}
