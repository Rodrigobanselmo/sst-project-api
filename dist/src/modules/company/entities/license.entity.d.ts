import { CompanyEntity } from './company.entity';
import { License } from '.prisma/client';
import { StatusEnum } from '@prisma/client';
export declare class LicenseEntity implements License {
    id: number;
    companyId: string;
    status: StatusEnum;
    created_at: Date;
    companies?: CompanyEntity[];
    constructor(partial: Partial<License>);
}