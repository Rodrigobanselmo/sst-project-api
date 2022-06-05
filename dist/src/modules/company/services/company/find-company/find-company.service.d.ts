import { CompanyRepository } from '../../../../../modules/company/repositories/implementations/CompanyRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class FindCompanyService {
    private readonly companyRepository;
    constructor(companyRepository: CompanyRepository);
    execute(user: UserPayloadDto): Promise<import("../../../entities/company.entity").CompanyEntity>;
}
