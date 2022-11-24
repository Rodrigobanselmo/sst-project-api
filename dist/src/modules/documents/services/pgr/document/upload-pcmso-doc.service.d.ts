import { RiskFactorsEntity } from '../../../../../modules/sst/entities/risk.entity';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { RiskDocumentRepository } from '../../../../sst/repositories/implementations/RiskDocumentRepository';
import { RiskGroupDataRepository } from '../../../../sst/repositories/implementations/RiskGroupDataRepository';
import { CompanyRepository } from '../../../../company/repositories/implementations/CompanyRepository';
import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { WorkspaceRepository } from '../../../../company/repositories/implementations/WorkspaceRepository';
import { ProfessionalRepository } from '../../../../users/repositories/implementations/ProfessionalRepository';
import { UpsertPcmsoDocumentDto } from '../../../dto/pgr.dto';
export declare const getRiskDoc: (risk: RiskFactorsEntity, { companyId, hierarchyId }: {
    companyId?: string;
    hierarchyId?: string;
}) => RiskFactorsEntity | import("../../../../sst/entities/riskDocInfo.entity").RiskDocInfoEntity;
export declare class PcmsoUploadService {
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
    execute(upsertPgrDto: UpsertPcmsoDocumentDto): Promise<{
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
