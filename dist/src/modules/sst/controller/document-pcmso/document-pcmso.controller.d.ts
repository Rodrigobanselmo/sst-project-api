import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { UpsertDocumentPCMSODto } from '../../dto/document-pcmso.dto';
import { FindByIdDocumentPCMSOService } from '../../services/documentPcmso/find-by-id/find-by-id.service';
import { UpsertDocumentPCMSOService } from '../../services/documentPcmso/upsert-document-pcmso/upsert-document-pcmso.service';
export declare class DocumentPCMSOController {
    private readonly upsertDocumentPCMSOService;
    private readonly findByIdService;
    constructor(upsertDocumentPCMSOService: UpsertDocumentPCMSOService, findByIdService: FindByIdDocumentPCMSOService);
    upsert(dto: UpsertDocumentPCMSODto): Promise<import("../../entities/documentPCMSO.entity").DocumentPCMSOEntity>;
    findById(userPayloadDto: UserPayloadDto): Promise<import("../../entities/documentPCMSO.entity").DocumentPCMSOEntity>;
}
