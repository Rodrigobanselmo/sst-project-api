import { RiskDocumentRepository } from 'src/modules/checklist/repositories/implementations/RiskDocumentRepository';
export declare class FindDocumentsService {
    private readonly riskDocumentRepository;
    constructor(riskDocumentRepository: RiskDocumentRepository);
    execute(riskGroupId: string, companyId: string): Promise<import("../../../entities/riskDocument.entity").RiskDocumentEntity[]>;
}
