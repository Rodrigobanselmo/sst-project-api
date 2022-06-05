/// <reference types="multer" />
import { CompanyRepository } from '../../../../company/repositories/implementations/CompanyRepository';
import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { UploadExcelProvider } from '../../../providers/uploadExcelProvider';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { DatabaseTableRepository } from '../../../repositories/implementations/DatabaseTableRepository';
import { WorkspaceRepository } from '../../../../company/repositories/implementations/WorkspaceRepository';
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
