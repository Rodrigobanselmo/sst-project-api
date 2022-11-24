import { RiskDocumentRepository } from '../../../repositories/implementations/RiskDocumentRepository';
export declare class FindByIdDocumentsService {
    private readonly riskDocumentRepository;
    constructor(riskDocumentRepository: RiskDocumentRepository);
    execute(id: string, companyId: string): Promise<import("../../../entities/riskDocument.entity").RiskDocumentEntity>;
}
