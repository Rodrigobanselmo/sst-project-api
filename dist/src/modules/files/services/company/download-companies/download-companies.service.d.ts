import { CompanyRepository } from '../../../../../modules/company/repositories/implementations/CompanyRepository';
import { DownloadExcelProvider } from '../../../../../modules/files/providers/donwlodExcelProvider';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
export declare class DownloadCompaniesService {
    private readonly excelProvider;
    private readonly companyRepository;
    private readonly downloadExcelProvider;
    constructor(excelProvider: ExcelProvider, companyRepository: CompanyRepository, downloadExcelProvider: DownloadExcelProvider);
    execute(userPayloadDto: UserPayloadDto): Promise<{
        workbook: import("exceljs").Workbook;
        filename: string;
    }>;
}
