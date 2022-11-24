import { UserPayloadDto } from '../../../shared/dto/user-payload.dto';
import { UpsertDocumentDto } from '../dto/pgr.dto';
import { PgrActionPlanUploadTableService } from '../services/pgr/action-plan/upload-action-plan-table.service';
import { AddQueueDocumentService } from '../services/pgr/document/add-queue-doc.service';
import { DownloadAttachmentsService } from '../services/pgr/document/download-attachment-doc.service';
import { DownloadDocumentService } from '../services/pgr/document/download-doc.service';
import { PgrUploadService } from '../services/pgr/document/upload-pgr-doc.service';
import { PgrUploadTableService } from '../services/pgr/tables/upload-pgr-table.service';
export declare class DocumentsBaseController {
    private readonly pgrDownloadAttachmentsService;
    private readonly pgrUploadService;
    private readonly pgrActionPlanUploadTableService;
    private readonly pgrDownloadDocService;
    private readonly pgrUploadDocService;
    private readonly addQueuePGRDocumentService;
    constructor(pgrDownloadAttachmentsService: DownloadAttachmentsService, pgrUploadService: PgrUploadTableService, pgrActionPlanUploadTableService: PgrActionPlanUploadTableService, pgrDownloadDocService: DownloadDocumentService, pgrUploadDocService: PgrUploadService, addQueuePGRDocumentService: AddQueueDocumentService);
    downloadAttachment(res: any, userPayloadDto: UserPayloadDto, docId: string, attachmentId: string): Promise<void>;
    downloadPGR(res: any, userPayloadDto: UserPayloadDto, docId: string): Promise<void>;
    addQueuePGRDoc(userPayloadDto: UserPayloadDto, upsertPgrDto: UpsertDocumentDto): Promise<import("../../sst/entities/riskDocument.entity").RiskDocumentEntity>;
}
