import { CompanyRepository } from '../../../../company/repositories/implementations/CompanyRepository';
import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { DownloadExcelProvider } from '../../../providers/donwlodExcelProvider';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { WorkspaceRepository } from 'src/modules/company/repositories/implementations/WorkspaceRepository';
export declare class DownloadEmployeesService {
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
