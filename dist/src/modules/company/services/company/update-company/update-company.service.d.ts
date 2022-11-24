import { WorkspaceRepository } from '../../../../../modules/company/repositories/implementations/WorkspaceRepository';
import { UpdateCompanyDto } from '../../../dto/update-company.dto';
import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';
export declare class UpdateCompanyService {
    private readonly companyRepository;
    private readonly workspaceRepository;
    constructor(companyRepository: CompanyRepository, workspaceRepository: WorkspaceRepository);
    execute(updateCompanyDto: UpdateCompanyDto): Promise<import("../../../entities/company.entity").CompanyEntity | (import(".prisma/client").Company & {
        group: import(".prisma/client").CompanyGroup;
        workspace: import(".prisma/client").Workspace[];
        employees: import(".prisma/client").Employee[];
        users: import(".prisma/client").UserCompany[];
        doctorResponsible: import(".prisma/client").ProfessionalCouncil & {
            professional: import(".prisma/client").Professional;
        };
        tecResponsible: import(".prisma/client").ProfessionalCouncil & {
            professional: import(".prisma/client").Professional;
        };
        license: import(".prisma/client").License;
        primary_activity: import(".prisma/client").Activity[];
        secondary_activity: import(".prisma/client").Activity[];
    })>;
}
