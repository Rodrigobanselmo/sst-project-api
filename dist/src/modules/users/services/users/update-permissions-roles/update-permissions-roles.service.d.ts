import { CompanyRepository } from './../../../../company/repositories/implementations/CompanyRepository';
import { AuthGroupRepository } from './../../../../auth/repositories/implementations/AuthGroupRepository';
import { UserPayloadDto } from './../../../../../shared/dto/user-payload.dto';
import { UpdateUserCompanyDto } from '../../../dto/update-user-company.dto';
import { UsersCompanyRepository } from '../../../repositories/implementations/UsersCompanyRepository';
export declare class UpdatePermissionsRolesService {
    private readonly usersCompanyRepository;
    private readonly authGroupRepository;
    private readonly companyRepository;
    constructor(usersCompanyRepository: UsersCompanyRepository, authGroupRepository: AuthGroupRepository, companyRepository: CompanyRepository);
    execute(updateUserCompanyDto: UpdateUserCompanyDto, userPayloadDto: UserPayloadDto): Promise<void>;
}
