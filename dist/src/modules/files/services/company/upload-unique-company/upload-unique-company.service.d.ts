/// <reference types="multer" />
import { WorkspaceRepository } from '../../../../../modules/company/repositories/implementations/WorkspaceRepository';
import { CompanyRepository } from '../../../../../modules/company/repositories/implementations/CompanyRepository';
import { HierarchyRepository } from '../../../../../modules/company/repositories/implementations/HierarchyRepository';
import { UploadExcelProvider } from '../../../../../modules/files/providers/uploadExcelProvider';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { DatabaseTableRepository } from '../../../repositories/implementations/DatabaseTableRepository';
export declare class UploadUniqueCompanyService {
    private readonly excelProvider;
    private readonly companyRepository;
    private readonly workspaceRepository;
    private readonly databaseTableRepository;
    private readonly uploadExcelProvider;
    private readonly hierarchyRepository;
    constructor(excelProvider: ExcelProvider, companyRepository: CompanyRepository, workspaceRepository: WorkspaceRepository, databaseTableRepository: DatabaseTableRepository, uploadExcelProvider: UploadExcelProvider, hierarchyRepository: HierarchyRepository);
    execute(file: Express.Multer.File, userPayloadDto: UserPayloadDto): Promise<{
        workbook: import("exceljs").Workbook;
        filename: string;
    }>;
}
