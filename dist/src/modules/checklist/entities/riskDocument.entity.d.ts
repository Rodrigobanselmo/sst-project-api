import { RiskFactorDocument, StatusEnum } from '@prisma/client';
import { CompanyEntity } from '../../../modules/company/entities/company.entity';
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
    workspaceName: string;
    workspaceId: string;
    constructor(partial: Partial<RiskDocumentEntity>);
}
