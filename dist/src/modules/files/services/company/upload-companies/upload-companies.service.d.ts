/// <reference types="multer" />
import { CompanyRepository } from '../../../../../modules/company/repositories/implementations/CompanyRepository';
import { UploadExcelProvider } from '../../../../../modules/files/providers/uploadExcelProvider';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { DatabaseTableRepository } from '../../../repositories/implementations/DatabaseTableRepository';
export declare class UploadCompaniesService {
    private readonly excelProvider;
    private readonly companyRepository;
    private readonly databaseTableRepository;
    private readonly uploadExcelProvider;
    constructor(excelProvider: ExcelProvider, companyRepository: CompanyRepository, databaseTableRepository: DatabaseTableRepository, uploadExcelProvider: UploadExcelProvider);
    execute(file: Express.Multer.File, userPayloadDto: UserPayloadDto): Promise<{
        workbook: import("exceljs").Workbook;
        filename: string;
    }>;
}
