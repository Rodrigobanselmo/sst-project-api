import { UpsertDocumentPCMSODto } from '../../../dto/document-pcmso.dto';
import { DocumentPCMSORepository } from '../../../repositories/implementations/DocumentPCMSORepository';
export declare class UpsertDocumentPCMSOService {
    private readonly documentPCMSORepository;
    constructor(documentPCMSORepository: DocumentPCMSORepository);
    execute(dto: UpsertDocumentPCMSODto): Promise<import("../../../entities/documentPCMSO.entity").DocumentPCMSOEntity>;
}
