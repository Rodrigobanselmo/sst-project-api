import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { HashProvider } from '../../../../../shared/providers/HashProvider/implementations/HashProvider';
import { CreateUserDto } from '../../../dto/create-user.dto';
import { UserCompanyDto } from '../../../dto/user-company.dto';
import { UsersRepository } from '../../../repositories/implementations/UsersRepository';
import { FindByTokenService } from '../../invites/find-by-token/find-by-token.service';
export declare class CreateUserService {
    private readonly userRepository;
    private readonly findByTokenService;
    private readonly dateProvider;
    private readonly hashProvider;
    constructor(userRepository: UsersRepository, findByTokenService: FindByTokenService, dateProvider: DayJSProvider, hashProvider: HashProvider);
    execute({ token, password, ...restCreateUserDto }: CreateUserDto): Promise<import("../../../entities/user.entity").UserEntity>;
}
export declare const getCompanyPermissionByToken: (token: string, email: string, findByTokenService: FindByTokenService, dateProvider: DayJSProvider) => Promise<UserCompanyDto[]>;
