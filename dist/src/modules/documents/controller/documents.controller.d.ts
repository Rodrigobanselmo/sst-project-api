import { UserPayloadDto } from '../../../shared/dto/user-payload.dto';
import { UpsertPgrDto } from '../dto/pgr.dto';
import { PgrDownloadService } from '../services/pgr/download-pgr.service';
import { PgrUploadService } from '../services/pgr/upload-pgr.service';
export declare class DocumentsController {
    private readonly pgrDownloadService;
    private readonly pgrUploadService;
    constructor(pgrDownloadService: PgrDownloadService, pgrUploadService: PgrUploadService);
    downloadPGR(res: any, userPayloadDto: UserPayloadDto, docId: string): Promise<void>;
    uploadPGR(res: any, userPayloadDto: UserPayloadDto, upsertPgrDto: UpsertPgrDto): Promise<void>;
}
