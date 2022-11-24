/// <reference types="node" />
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { RiskDocumentRepository } from '../../../../sst/repositories/implementations/RiskDocumentRepository';
import { RiskGroupDataRepository } from '../../../../sst/repositories/implementations/RiskGroupDataRepository';
import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { UploadPgrActionPlanDto } from '../../../dto/pgr.dto';
export declare class PgrActionPlanUploadTableService {
    private readonly riskGroupDataRepository;
    private readonly riskDocumentRepository;
    private readonly amazonStorageProvider;
    private readonly hierarchyRepository;
    constructor(riskGroupDataRepository: RiskGroupDataRepository, riskDocumentRepository: RiskDocumentRepository, amazonStorageProvider: AmazonStorageProvider, hierarchyRepository: HierarchyRepository);
    execute(upsertPgrDto: UploadPgrActionPlanDto, userPayloadDto: UserPayloadDto): Promise<{
        buffer: Buffer;
        fileName: string;
    }>;
    private upload;
}
