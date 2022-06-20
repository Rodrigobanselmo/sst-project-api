import { UserPayloadDto } from '../../../shared/dto/user-payload.dto';
import { UpsertPgrDto } from '../dto/pgr.dto';
import { PgrDownloadService } from '../services/pgr/document/download-pgr-doc.service';
import { PgrUploadService } from '../services/pgr/document/upload-pgr-doc.service';
import { PgrDownloadTableService } from '../services/pgr/tables/download-pgr-table.service';
import { PgrUploadTableService } from '../services/pgr/tables/upload-pgr-table.service';
export declare class DocumentsController {
    private readonly pgrDownloadService;
    private readonly pgrUploadService;
    private readonly pgrDownloadDocService;
    private readonly pgrUploadDocService;
    constructor(pgrDownloadService: PgrDownloadTableService, pgrUploadService: PgrUploadTableService, pgrDownloadDocService: PgrDownloadService, pgrUploadDocService: PgrUploadService);
    downloadPGR(res: any, userPayloadDto: UserPayloadDto, docId: string): Promise<void>;
    uploadPGR(res: any, userPayloadDto: UserPayloadDto, upsertPgrDto: UpsertPgrDto): Promise<void>;
    uploadPGRDoc(res: any, userPayloadDto: UserPayloadDto, upsertPgrDto: UpsertPgrDto): Promise<void>;
}
