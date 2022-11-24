/// <reference types="node" />
import { RiskDocumentRepository } from '../../../../sst/repositories/implementations/RiskDocumentRepository';
import { RiskGroupDataRepository } from '../../../../sst/repositories/implementations/RiskGroupDataRepository';
import { HierarchyRepository } from '../../../../../modules/company/repositories/implementations/HierarchyRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { UpsertDocumentDto } from '../../../dto/pgr.dto';
export declare class PgrUploadTableService {
    private readonly riskGroupDataRepository;
    private readonly riskDocumentRepository;
    private readonly amazonStorageProvider;
    private readonly hierarchyRepository;
    constructor(riskGroupDataRepository: RiskGroupDataRepository, riskDocumentRepository: RiskDocumentRepository, amazonStorageProvider: AmazonStorageProvider, hierarchyRepository: HierarchyRepository);
    execute(upsertPgrDto: UpsertDocumentDto, userPayloadDto: UserPayloadDto): Promise<{
        buffer: Buffer;
        fileName: string;
    }>;
    private upload;
}
