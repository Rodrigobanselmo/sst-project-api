import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';
import { SetCompanyClinicDto } from './../../../dto/company-clinic.dto';
import { CompanyClinicRepository } from './../../../repositories/implementations/CompanyClinicRepository';
export declare class SetCompanyClinicsService {
    private readonly companyRepository;
    private readonly companyClinicRepository;
    constructor(companyRepository: CompanyRepository, companyClinicRepository: CompanyClinicRepository);
    execute(setCompanyClinicDto: SetCompanyClinicDto, user: UserPayloadDto): Promise<void>;
}
