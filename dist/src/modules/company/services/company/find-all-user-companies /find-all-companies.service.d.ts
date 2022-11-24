import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { FindCompaniesDto } from '../../../dto/create-company.dto';
export declare class FindAllUserCompaniesService {
    private readonly companyRepository;
    constructor(companyRepository: CompanyRepository);
    execute(user: UserPayloadDto, { skip, take, ...query }: FindCompaniesDto): Promise<{
        data: import("../../../entities/company.entity").CompanyEntity[];
        count: number;
    }>;
}
