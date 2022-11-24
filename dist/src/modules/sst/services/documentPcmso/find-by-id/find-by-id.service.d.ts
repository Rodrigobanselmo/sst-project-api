import { DocumentPCMSORepository } from '../../../repositories/implementations/DocumentPCMSORepository';
export declare class FindByIdDocumentPCMSOService {
    private readonly documentPCMSORepository;
    constructor(documentPCMSORepository: DocumentPCMSORepository);
    execute(companyId: string): Promise<import("../../../entities/documentPCMSO.entity").DocumentPCMSOEntity>;
}
