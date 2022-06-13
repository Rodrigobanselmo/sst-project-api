import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateCompanyDto } from '../../dto/create-company.dto';
import { UpdateCompanyDto } from '../../dto/update-company.dto';
import { CreateCompanyService } from '../../services/company/create-company/create-company.service';
import { CreateContractService } from '../../services/company/create-contract/create-contract.service';
import { FindAllCompaniesService } from '../../services/company/find-all-companies/find-all-companies.service';
import { FindCepService } from '../../services/company/find-cep/find-cep.service';
import { FindCnpjService } from '../../services/company/find-cnpj/find-cnpj.service';
import { FindCompanyService } from '../../services/company/find-company/find-company.service';
import { UpdateCompanyService } from '../../services/company/update-company/update-company.service';
export declare class CompanyController {
    private readonly createCompanyService;
    private readonly createContractService;
    private readonly updateCompanyService;
    private readonly findAllCompaniesService;
    private readonly findCompanyService;
    private readonly findCnpjService;
    private readonly findCepService;
    constructor(createCompanyService: CreateCompanyService, createContractService: CreateContractService, updateCompanyService: UpdateCompanyService, findAllCompaniesService: FindAllCompaniesService, findCompanyService: FindCompanyService, findCnpjService: FindCnpjService, findCepService: FindCepService);
    findOne(userPayloadDto: UserPayloadDto): Promise<import("../../entities/company.entity").CompanyEntity>;
    findAll(userPayloadDto: UserPayloadDto): Promise<import("../../entities/company.entity").CompanyEntity[]>;
    findCNPJ(cnpj: string): Promise<import("../../interfaces/cnpj").ICnpjResponse>;
    findCEP(cep: string): Promise<import("../../interfaces/cep.types").ICepResponse>;
    create(createCompanyDto: CreateCompanyDto, userPayloadDto: UserPayloadDto): Promise<import("../../entities/company.entity").CompanyEntity>;
    update(updateCompanyDto: UpdateCompanyDto): Promise<import("../../entities/company.entity").CompanyEntity | (import(".prisma/client").Company & {
        license: import(".prisma/client").License;
        employees: import(".prisma/client").Employee[];
        workspace: import(".prisma/client").Workspace[];
        users: import(".prisma/client").UserCompany[];
        primary_activity: import(".prisma/client").Activity[];
        secondary_activity: import(".prisma/client").Activity[];
    })>;
}
