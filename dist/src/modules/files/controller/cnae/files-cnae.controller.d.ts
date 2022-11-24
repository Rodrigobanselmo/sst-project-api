/// <reference types="multer" />
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { DownloadCnaeService } from '../../services/cnae/download-cnae/download-cnae.service';
import { UploadCnaeDataService } from '../../services/cnae/upload-cnae/upload-cnae.service';
export declare class FilesCnaeController {
    private readonly downloadCnaeService;
    private readonly uploadCnaeService;
    constructor(downloadCnaeService: DownloadCnaeService, uploadCnaeService: UploadCnaeDataService);
    uploadCnaeFile(file: Express.Multer.File, userPayloadDto: UserPayloadDto, res: any): Promise<void>;
    download(userPayloadDto: UserPayloadDto, res: any): Promise<void>;
}
