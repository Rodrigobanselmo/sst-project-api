import { StatusEnum } from '@prisma/client';
import { RiskFactorGroupData } from '.prisma/client';
import { CompanyEntity } from 'src/modules/company/entities/company.entity';
import { RiskFactorDataEntity } from './riskData.entity';
export declare class RiskFactorGroupDataEntity implements RiskFactorGroupData {
    id: string;
    name: string;
    companyId: string;
    status: StatusEnum;
    created_at: Date;
    data?: Partial<RiskFactorDataEntity>[];
    company?: Partial<CompanyEntity>;
    source: string | null;
    elaboratedBy: string | null;
    approvedBy: string | null;
    revisionBy: string | null;
    documentDate: Date | null;
    visitDate: Date | null;
    constructor(partial: Partial<RiskFactorGroupDataEntity>);
}
