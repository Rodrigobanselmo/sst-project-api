import { CreateCompanyDto } from '../../../dto/create-company.dto';
import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';
export declare class CreateCompanyService {
    private readonly companyRepository;
    constructor(companyRepository: CompanyRepository);
    execute(createCompanyDto: CreateCompanyDto): Promise<import("../../../entities/company.entity").CompanyEntity>;
}
