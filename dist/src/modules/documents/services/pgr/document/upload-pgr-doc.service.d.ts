import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { RiskDocumentRepository } from '../../../../checklist/repositories/implementations/RiskDocumentRepository';
import { RiskGroupDataRepository } from '../../../../checklist/repositories/implementations/RiskGroupDataRepository';
import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { UpsertPgrDto } from '../../../dto/pgr.dto';
export declare class PgrUploadService {
    private readonly riskGroupDataRepository;
    private readonly riskDocumentRepository;
    private readonly amazonStorageProvider;
    private readonly hierarchyRepository;
    constructor(riskGroupDataRepository: RiskGroupDataRepository, riskDocumentRepository: RiskDocumentRepository, amazonStorageProvider: AmazonStorageProvider, hierarchyRepository: HierarchyRepository);
    execute(upsertPgrDto: UpsertPgrDto, userPayloadDto: UserPayloadDto): Promise<{
        buffer: Buffer;
        fileName: string;
    }>;
    private upload;
}
