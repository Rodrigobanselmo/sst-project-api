import { RiskFactorDocument, StatusEnum } from '@prisma/client';
import { CompanyEntity } from 'src/modules/company/entities/company.entity';
export declare class RiskDocumentEntity implements RiskFactorDocument {
    id: string;
    name: string;
    companyId: string;
    status: StatusEnum;
    created_at: Date;
    company?: Partial<CompanyEntity>;
    fileUrl: string;
    description: string;
    version: string;
    riskGroupId: string;
    updated_at: Date;
    constructor(partial: Partial<RiskDocumentEntity>);
}
