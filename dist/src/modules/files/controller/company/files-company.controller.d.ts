/// <reference types="multer" />
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { DownloadCompaniesService } from '../../services/company/download-companies/download-companies.service';
import { DownloadEmployeesService } from '../../services/company/download-employees/download-employees.service';
import { DownloadUniqueCompanyService } from '../../services/company/download-unique-company/download-unique-company.service';
import { UploadCompaniesService } from '../../services/company/upload-companies/upload-companies.service';
import { UploadEmployeesService } from '../../services/company/upload-employees/upload-employees.service';
import { UploadUniqueCompanyService } from '../../services/company/upload-unique-company/upload-unique-company.service';
export declare class FilesCompanyController {
    private readonly downloadCompaniesService;
    private readonly uploadCompaniesService;
    private readonly downloadUniqueCompanyService;
    private readonly uploadUniqueCompanyService;
    private readonly uploadEmployeesService;
    private readonly downloadEmployeesService;
    constructor(downloadCompaniesService: DownloadCompaniesService, uploadCompaniesService: UploadCompaniesService, downloadUniqueCompanyService: DownloadUniqueCompanyService, uploadUniqueCompanyService: UploadUniqueCompanyService, uploadEmployeesService: UploadEmployeesService, downloadEmployeesService: DownloadEmployeesService);
    uploadCompanyFile(file: Express.Multer.File, userPayloadDto: UserPayloadDto, res: any): Promise<void>;
    uploadEmployeesFile(file: Express.Multer.File, userPayloadDto: UserPayloadDto, res: any): Promise<void>;
    uploadFile(file: Express.Multer.File, userPayloadDto: UserPayloadDto, res: any): Promise<void>;
    download(userPayloadDto: UserPayloadDto, res: any): Promise<void>;
    downloadUnique(userPayloadDto: UserPayloadDto, res: any): Promise<void>;
    downloadEmployees(userPayloadDto: UserPayloadDto, res: any): Promise<void>;
}
