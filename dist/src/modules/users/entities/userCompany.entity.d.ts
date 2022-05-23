import { UserCompany } from '.prisma/client';
import { StatusEnum } from '@prisma/client';
export declare class UserCompanyEntity implements UserCompany {
    userId: number;
    companyId: string;
    roles: string[];
    permissions: string[];
    updated_at: Date;
    created_at: Date;
    status: StatusEnum;
    constructor(partial: Partial<UserCompanyEntity>);
}
