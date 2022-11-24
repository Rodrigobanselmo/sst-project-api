/// <reference types="multer" />
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { DownloadRiskDataService } from '../../services/checklist/download-risk-data/download-risk-data.service';
import { UploadChecklistDataService } from '../../services/checklist/upload-risk-data/upload-risk-data.service';
import { UploadEpiDataService } from '../../services/checklist/upload-epi-data/upload-epi-data.service';
export declare class FilesChecklistController {
    private readonly uploadEpiDataService;
    private readonly uploadRiskService;
    private readonly downloadRiskService;
    constructor(uploadEpiDataService: UploadEpiDataService, uploadRiskService: UploadChecklistDataService, downloadRiskService: DownloadRiskDataService);
    uploadRiskFile(file: Express.Multer.File, userPayloadDto: UserPayloadDto, res: any): Promise<void>;
    downloadRisks(userPayloadDto: UserPayloadDto, res: any): Promise<void>;
    uploadEpiFile(file: Express.Multer.File, userPayloadDto: UserPayloadDto, res: any): Promise<void>;
}
