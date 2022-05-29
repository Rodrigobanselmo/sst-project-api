import { WorkspaceRepository } from 'src/modules/company/repositories/implementations/WorkspaceRepository';
import { CompanyRepository } from '../../../../../modules/company/repositories/implementations/CompanyRepository';
import { HierarchyRepository } from '../../../../../modules/company/repositories/implementations/HierarchyRepository';
import { DownloadExcelProvider } from '../../../../../modules/files/providers/donwlodExcelProvider';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
export declare class DownloadUniqueCompanyService {
    private readonly excelProvider;
    private readonly companyRepository;
    private readonly workspaceRepository;
    private readonly hierarchyRepository;
    private readonly downloadExcelProvider;
    constructor(excelProvider: ExcelProvider, companyRepository: CompanyRepository, workspaceRepository: WorkspaceRepository, hierarchyRepository: HierarchyRepository, downloadExcelProvider: DownloadExcelProvider);
    execute(userPayloadDto: UserPayloadDto): Promise<{
        workbook: import("exceljs").Workbook;
        filename: string;
    }>;
}
