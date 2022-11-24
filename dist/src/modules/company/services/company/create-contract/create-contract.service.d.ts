import { CreateCompanyDto } from '../../../../../modules/company/dto/create-company.dto';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';
import { LicenseRepository } from '../../../repositories/implementations/LicenseRepository';
export declare class CreateContractService {
    private readonly companyRepository;
    private readonly licenseRepository;
    constructor(companyRepository: CompanyRepository, licenseRepository: LicenseRepository);
    execute(createContractDto: CreateCompanyDto, user: UserPayloadDto): Promise<import("../../../entities/company.entity").CompanyEntity>;
}
