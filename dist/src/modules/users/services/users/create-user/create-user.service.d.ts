import { ProfessionalRepository } from './../../../repositories/implementations/ProfessionalRepository';
import { InviteUsersRepository } from '../../../../../modules/users/repositories/implementations/InviteUsersRepository';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { HashProvider } from '../../../../../shared/providers/HashProvider/implementations/HashProvider';
import { CreateUserDto } from '../../../dto/create-user.dto';
import { UserCompanyDto } from '../../../dto/user-company.dto';
import { UsersRepository } from '../../../repositories/implementations/UsersRepository';
import { FindByTokenService } from '../../invites/find-by-token/find-by-token.service';
export declare class CreateUserService {
    private readonly userRepository;
    private readonly professionalRepository;
    private readonly findByTokenService;
    private readonly dateProvider;
    private readonly hashProvider;
    private readonly inviteUsersRepository;
    constructor(userRepository: UsersRepository, professionalRepository: ProfessionalRepository, findByTokenService: FindByTokenService, dateProvider: DayJSProvider, hashProvider: HashProvider, inviteUsersRepository: InviteUsersRepository);
    execute({ token, password, ...restCreateUserDto }: CreateUserDto): Promise<import("../../../entities/user.entity").UserEntity>;
}
export declare const getCompanyPermissionByToken: (token: string, findByTokenService: FindByTokenService, dateProvider: DayJSProvider) => Promise<{
    companies: any[];
    companyId?: undefined;
    invite?: undefined;
} | {
    companies: UserCompanyDto[];
    companyId: string;
    invite: import("../../../entities/invite-users.entity").InviteUsersEntity;
}>;
