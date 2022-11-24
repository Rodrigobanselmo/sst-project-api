import { StatusEnum } from '@prisma/client';
import { CompanyEntity } from '../../company/entities/company.entity';
import { ProfessionalEntity } from '../../users/entities/professional.entity';
import { RiskFactorDataEntity } from './riskData.entity';
import { ProfessionalPCMSOEntity } from './usersRiskGroup';
import { DocumentPCMSO } from '.prisma/client';
export declare class DocumentPCMSOEntity implements DocumentPCMSO {
    id: string;
    name: string;
    companyId: string;
    status: StatusEnum;
    created_at: Date;
    data?: Partial<RiskFactorDataEntity>[];
    workspaceId?: string;
    elaboratedBy: string | null;
    approvedBy: string | null;
    revisionBy: string | null;
    documentDate: Date | null;
    visitDate: Date | null;
    validity: string;
    coordinatorBy: string;
    validityEnd: Date;
    validityStart: Date;
    company?: Partial<CompanyEntity>;
    professionals?: ProfessionalEntity[];
    professionalsSignatures?: ProfessionalPCMSOEntity[];
    constructor(partial: Partial<DocumentPCMSOEntity>);
}
