import { LicenseRepository } from '../../../repositories/implementations/LicenseRepository';
import { CreateContractDto } from '../../../dto/create-contract.dto';
import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';
export declare class CreateContractService {
    private readonly companyRepository;
    private readonly licenseRepository;
    constructor(companyRepository: CompanyRepository, licenseRepository: LicenseRepository);
    execute({ ...createContractDto }: CreateContractDto): Promise<import("../../../entities/company.entity").CompanyEntity>;
}
