import { PgrUploadService } from '../../services/pgr/document/upload-pgr-doc.service';
import { PcmsoUploadService } from '../../services/pgr/document/upload-pcmso-doc.service';
export declare class PgrConsumer {
    private readonly pgrUploadDocService;
    private readonly pcmsoUploadService;
    constructor(pgrUploadDocService: PgrUploadService, pcmsoUploadService: PcmsoUploadService);
    private consume;
}
