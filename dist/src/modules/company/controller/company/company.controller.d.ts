/// <reference types="multer" />
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { FindActivityDto } from '../../dto/activity.dto';
import { SetCompanyClinicDto } from '../../dto/company-clinic.dto';
import { CreateCompanyDto, FindCompaniesDto } from '../../dto/create-company.dto';
import { UpdateCompanyDto } from '../../dto/update-company.dto';
import { AddCompanyPhotoService } from '../../services/company/add-company-photo/add-company-photo.service';
import { CopyCompanyService } from '../../services/company/copy-company/copy-company.service';
import { CreateCompanyService } from '../../services/company/create-company/create-company.service';
import { CreateContractService } from '../../services/company/create-contract/create-contract.service';
import { FindAllCompaniesService } from '../../services/company/find-all-companies/find-all-companies.service';
import { FindAllUserCompaniesService } from '../../services/company/find-all-user-companies /find-all-companies.service';
import { FindCepService } from '../../services/company/find-cep/find-cep.service';
import { FindClinicService } from '../../services/company/find-clinic/find-clinic.service';
import { FindCnaeService } from '../../services/company/find-cnae/find-cnae.service';
import { FindCnpjService } from '../../services/company/find-cnpj/find-cnpj.service';
import { FindCompanyService } from '../../services/company/find-company/find-company.service';
import { SetCompanyClinicsService } from '../../services/company/set-company-clinics/set-company-clinics.service';
import { UpdateCompanyService } from '../../services/company/update-company/update-company.service';
import { UpdateAllCompaniesService } from '../../services/report/update-all-companies/update-all-companies.service';
import { FindCompanyDashDto } from '../../dto/dashboard.dto';
import { DashboardCompanyService } from '../../services/report/dashboard-company/dashboard-company.service';
export declare class CompanyController {
    private readonly createCompanyService;
    private readonly createContractService;
    private readonly addCompanyPhotoService;
    private readonly updateCompanyService;
    private readonly findAllCompaniesService;
    private readonly findAllUserCompaniesService;
    private readonly findCompanyService;
    private readonly findCnpjService;
    private readonly findCepService;
    private readonly findCnaeService;
    private readonly copyCompanyService;
    private readonly setCompanyClinicsService;
    private readonly findClinicService;
    private readonly dashboardCompanyService;
    private readonly updateAllCompaniesService;
    constructor(createCompanyService: CreateCompanyService, createContractService: CreateContractService, addCompanyPhotoService: AddCompanyPhotoService, updateCompanyService: UpdateCompanyService, findAllCompaniesService: FindAllCompaniesService, findAllUserCompaniesService: FindAllUserCompaniesService, findCompanyService: FindCompanyService, findCnpjService: FindCnpjService, findCepService: FindCepService, findCnaeService: FindCnaeService, copyCompanyService: CopyCompanyService, setCompanyClinicsService: SetCompanyClinicsService, findClinicService: FindClinicService, dashboardCompanyService: DashboardCompanyService, updateAllCompaniesService: UpdateAllCompaniesService);
    dashboard(userPayloadDto: UserPayloadDto, query: FindCompanyDashDto): Promise<import("../../entities/report.entity").CompanyReportEntity>;
    findAll(userPayloadDto: UserPayloadDto, query: FindCompaniesDto): Promise<{
        data: import("../../entities/company.entity").CompanyEntity[];
        count: number;
    }>;
    findAllByUser(userPayloadDto: UserPayloadDto, query: FindCompaniesDto): Promise<{
        data: import("../../entities/company.entity").CompanyEntity[];
        count: number;
    }>;
    findCNAE(query: FindActivityDto): Promise<{
        data: import("../../entities/activity.entity").ActivityEntity[];
        count: number;
    }>;
    findOne(userPayloadDto: UserPayloadDto): Promise<import("../../entities/company.entity").CompanyEntity>;
    findClinicOne(clinicId: string, userPayloadDto: UserPayloadDto): Promise<import("../../entities/company.entity").CompanyEntity>;
    findCNPJ(cnpj: string): Promise<import("../../interfaces/cnpj").ICnpjResponse>;
    findCEP(cep: string): Promise<import("../../interfaces/cep.types").ICepResponse>;
    create(createCompanyDto: CreateCompanyDto, userPayloadDto: UserPayloadDto): Promise<import("../../entities/company.entity").CompanyEntity>;
    createClinic(createCompanyDto: CreateCompanyDto, userPayloadDto: UserPayloadDto): Promise<import("../../entities/company.entity").CompanyEntity>;
    uploadRiskFile(file: Express.Multer.File, userPayloadDto: UserPayloadDto): Promise<import("../../entities/company.entity").CompanyEntity | (import(".prisma/client").Company & {
        users: import(".prisma/client").UserCompany[];
        group: import(".prisma/client").CompanyGroup;
        employees: import(".prisma/client").Employee[];
        license: import(".prisma/client").License;
        primary_activity: import(".prisma/client").Activity[];
        secondary_activity: import(".prisma/client").Activity[];
        workspace: import(".prisma/client").Workspace[];
        doctorResponsible: import(".prisma/client").ProfessionalCouncil & {
            professional: import(".prisma/client").Professional;
        };
        tecResponsible: import(".prisma/client").ProfessionalCouncil & {
            professional: import(".prisma/client").Professional;
        };
    })>;
    update(updateCompanyDto: UpdateCompanyDto): Promise<import("../../entities/company.entity").CompanyEntity | (import(".prisma/client").Company & {
        users: import(".prisma/client").UserCompany[];
        group: import(".prisma/client").CompanyGroup;
        employees: import(".prisma/client").Employee[];
        license: import(".prisma/client").License;
        primary_activity: import(".prisma/client").Activity[];
        secondary_activity: import(".prisma/client").Activity[];
        workspace: import(".prisma/client").Workspace[];
        doctorResponsible: import(".prisma/client").ProfessionalCouncil & {
            professional: import(".prisma/client").Professional;
        };
        tecResponsible: import(".prisma/client").ProfessionalCouncil & {
            professional: import(".prisma/client").Professional;
        };
    })>;
    copy(copyFromCompanyId: string, riskGroupId: string, userPayloadDto: UserPayloadDto): Promise<{}>;
    setClinics(setCompanyClinicDto: SetCompanyClinicDto, userPayloadDto: UserPayloadDto): Promise<void>;
}
