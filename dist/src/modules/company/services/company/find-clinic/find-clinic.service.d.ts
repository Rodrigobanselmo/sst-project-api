import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class FindClinicService {
    private readonly companyRepository;
    constructor(companyRepository: CompanyRepository);
    execute(clinicId: string, user: UserPayloadDto): Promise<import("../../../entities/company.entity").CompanyEntity>;
}
