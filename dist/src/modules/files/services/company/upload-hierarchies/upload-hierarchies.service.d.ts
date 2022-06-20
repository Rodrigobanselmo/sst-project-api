/// <reference types="multer" />
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { CompanyRepository } from '../../../../company/repositories/implementations/CompanyRepository';
import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { WorkspaceRepository } from '../../../../company/repositories/implementations/WorkspaceRepository';
import { UploadExcelProvider } from '../../../providers/uploadExcelProvider';
import { DatabaseTableRepository } from '../../../repositories/implementations/DatabaseTableRepository';
export declare type HierarchyOnHomogeneous = {
    hierarchyId: string;
    homogeneousGroupId: string;
    workspaceId: string;
};
export declare class UploadHierarchiesService {
    private readonly excelProvider;
    private readonly companyRepository;
    private readonly workspaceRepository;
    private readonly databaseTableRepository;
    private readonly uploadExcelProvider;
    private readonly hierarchyRepository;
    constructor(excelProvider: ExcelProvider, companyRepository: CompanyRepository, workspaceRepository: WorkspaceRepository, databaseTableRepository: DatabaseTableRepository, uploadExcelProvider: UploadExcelProvider, hierarchyRepository: HierarchyRepository);
    execute(file: Express.Multer.File, userPayloadDto: UserPayloadDto): Promise<void>;
}
