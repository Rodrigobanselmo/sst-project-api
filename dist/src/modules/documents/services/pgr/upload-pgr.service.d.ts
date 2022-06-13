import { RiskDocumentRepository } from '../../../../modules/checklist/repositories/implementations/RiskDocumentRepository';
import { RiskGroupDataRepository } from '../../../../modules/checklist/repositories/implementations/RiskGroupDataRepository';
import { HierarchyRepository } from '../../../../modules/company/repositories/implementations/HierarchyRepository';
import { AmazonStorageProvider } from '../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { UpsertPgrDto } from '../../dto/pgr.dto';
export declare class PgrUploadService {
    private readonly riskGroupDataRepository;
    private readonly riskDocumentRepository;
    private readonly amazonStorageProvider;
    private readonly hierarchyRepository;
    constructor(riskGroupDataRepository: RiskGroupDataRepository, riskDocumentRepository: RiskDocumentRepository, amazonStorageProvider: AmazonStorageProvider, hierarchyRepository: HierarchyRepository);
    execute(upsertPgrDto: UpsertPgrDto, userPayloadDto: UserPayloadDto): Promise<void>;
    private upload;
}
