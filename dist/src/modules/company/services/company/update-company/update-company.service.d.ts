import { WorkspaceRepository } from '../../../../../modules/company/repositories/implementations/WorkspaceRepository';
import { UpdateCompanyDto } from '../../../dto/update-company.dto';
import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';
export declare class UpdateCompanyService {
    private readonly companyRepository;
    private readonly workspaceRepository;
    constructor(companyRepository: CompanyRepository, workspaceRepository: WorkspaceRepository);
    execute(updateCompanyDto: UpdateCompanyDto): Promise<import("../../../entities/company.entity").CompanyEntity | (import(".prisma/client").Company & {
        workspace: import(".prisma/client").Workspace[];
        primary_activity: import(".prisma/client").Activity[];
        secondary_activity: import(".prisma/client").Activity[];
        license: import(".prisma/client").License;
        users: import(".prisma/client").UserCompany[];
        employees: import(".prisma/client").Employee[];
    })>;
}
