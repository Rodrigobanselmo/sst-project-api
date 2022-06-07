import { UpdateUserCompanyDto } from '../../../dto/update-user-company.dto';
import { UsersCompanyRepository } from '../../../repositories/implementations/UsersCompanyRepository';
export declare class UpdatePermissionsRolesService {
    private readonly usersCompanyRepository;
    constructor(usersCompanyRepository: UsersCompanyRepository);
    execute(updateUserCompanyDto: UpdateUserCompanyDto): Promise<import("../../../entities/userCompany.entity").UserCompanyEntity>;
}
