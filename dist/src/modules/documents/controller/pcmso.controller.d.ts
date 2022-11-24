import { UserPayloadDto } from '../../../shared/dto/user-payload.dto';
import { UpsertDocumentDto, UpsertPcmsoDocumentDto } from '../dto/pgr.dto';
import { AddQueueDocumentService } from '../services/pgr/document/add-queue-doc.service';
import { DownloadAttachmentsService } from '../services/pgr/document/download-attachment-doc.service';
import { DownloadDocumentService } from '../services/pgr/document/download-doc.service';
import { PcmsoUploadService } from '../services/pgr/document/upload-pcmso-doc.service';
export declare class DocumentsPcmsoController {
    private readonly pcmsoDownloadAttachmentsService;
    private readonly pcmsoDownloadDocService;
    private readonly pcmsoUploadDocService;
    private readonly addQueuePCMSODocumentService;
    constructor(pcmsoDownloadAttachmentsService: DownloadAttachmentsService, pcmsoDownloadDocService: DownloadDocumentService, pcmsoUploadDocService: PcmsoUploadService, addQueuePCMSODocumentService: AddQueueDocumentService);
    downloadAttachment(res: any, userPayloadDto: UserPayloadDto, docId: string, attachmentId: string): Promise<void>;
    downloadPCMSO(res: any, userPayloadDto: UserPayloadDto, docId: string): Promise<void>;
    uploadPCMSODoc(res: any, userPayloadDto: UserPayloadDto, upsertPcmsoDto: UpsertPcmsoDocumentDto): Promise<void>;
    addQueuePCMSODoc(user: UserPayloadDto, dto: UpsertDocumentDto): Promise<import("../../sst/entities/riskDocument.entity").RiskDocumentEntity>;
}
