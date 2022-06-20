import { UserPayloadDto } from '../../../shared/dto/user-payload.dto';
import { UpsertPgrDto } from '../dto/pgr.dto';
import { PgrDownloadTableService } from '../services/pgr/tables/download-pgr-table.service';
import { PgrUploadTableService } from '../services/pgr/tables/upload-pgr-table.service';
export declare class DocumentsController {
    private readonly pgrDownloadService;
    private readonly pgrUploadService;
    constructor(pgrDownloadService: PgrDownloadTableService, pgrUploadService: PgrUploadTableService);
    downloadPGR(res: any, userPayloadDto: UserPayloadDto, docId: string): Promise<void>;
    uploadPGR(res: any, userPayloadDto: UserPayloadDto, upsertPgrDto: UpsertPgrDto): Promise<void>;
}
