import { CompanyClinics } from '@prisma/client';
import { CompanyEntity } from './company.entity';
export declare class CompanyClinicsEntity implements CompanyClinics {
    companyId: string;
    clinicId: string;
    created_at: Date;
    company?: CompanyEntity;
    clinic?: CompanyEntity;
    constructor(partial: Partial<CompanyClinicsEntity>);
}
