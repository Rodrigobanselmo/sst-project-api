/// <reference types="multer" />
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { DownloadCidService } from '../../services/cid/download-cid/download-cid.service';
import { UploadCidDataService } from '../../services/cid/upload-cid/upload-cid.service';
export declare class FilesCidController {
    private readonly downloadCidService;
    private readonly uploadCidService;
    constructor(downloadCidService: DownloadCidService, uploadCidService: UploadCidDataService);
    uploadCidFile(file: Express.Multer.File, userPayloadDto: UserPayloadDto, res: any): Promise<void>;
    download(userPayloadDto: UserPayloadDto, res: any): Promise<void>;
}
