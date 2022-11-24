import { RiskDocInfoEntity } from './../../../../sst/entities/riskDocInfo.entity';
import { CompanyRepository } from '../../../../company/repositories/implementations/CompanyRepository';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { RiskDocumentRepository } from '../../../../sst/repositories/implementations/RiskDocumentRepository';
import { RiskGroupDataRepository } from '../../../../sst/repositories/implementations/RiskGroupDataRepository';
import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { ProfessionalRepository } from '../../../../users/repositories/implementations/ProfessionalRepository';
import { UpsertPgrDocumentDto } from '../../../dto/pgr.dto';
import { WorkspaceRepository } from '../../../../company/repositories/implementations/WorkspaceRepository';
import { RiskFactorsEntity } from '../../../../../modules/sst/entities/risk.entity';
import { RiskFactorDataEntity } from '../../../../../modules/sst/entities/riskData.entity';
export declare const checkRiskDataDoc: (riskData: RiskFactorDataEntity[], { companyId, docType }: {
    companyId: string;
    docType: keyof RiskDocInfoEntity;
}) => RiskFactorDataEntity[];
export declare const getRiskDoc: (risk: RiskFactorsEntity, { companyId, hierarchyId }: {
    companyId?: string;
    hierarchyId?: string;
}) => RiskFactorsEntity | RiskDocInfoEntity;
export declare class PgrUploadService {
    private readonly riskGroupDataRepository;
    private readonly riskDocumentRepository;
    private readonly workspaceRepository;
    private readonly companyRepository;
    private readonly amazonStorageProvider;
    private readonly hierarchyRepository;
    private readonly professionalRepository;
    private readonly dayJSProvider;
    private attachments_remove;
    constructor(riskGroupDataRepository: RiskGroupDataRepository, riskDocumentRepository: RiskDocumentRepository, workspaceRepository: WorkspaceRepository, companyRepository: CompanyRepository, amazonStorageProvider: AmazonStorageProvider, hierarchyRepository: HierarchyRepository, professionalRepository: ProfessionalRepository, dayJSProvider: DayJSProvider);
    execute(upsertPgrDto: UpsertPgrDocumentDto): Promise<{
        buffer: Buffer;
        fileName: string;
    }>;
    private upload;
    private downloadPhotos;
    private generateAttachment;
    private getFileName;
    private save;
    private unlinkFiles;
}
