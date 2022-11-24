import { UserEntity } from '../../../../users/entities/user.entity';
import { UsersRepository } from '../../../../users/repositories/implementations/UsersRepository';
import { HashProvider } from '../../../../../shared/providers/HashProvider/implementations/HashProvider';
import { JwtTokenProvider } from '../../../../../shared/providers/TokenProvider/implementations/JwtTokenProvider';
import { LoginUserDto } from '../../../dto/login-user.dto';
import { RefreshTokensRepository } from '../../../repositories/implementations/RefreshTokensRepository';
export declare class SessionService {
    private readonly usersRepository;
    private readonly refreshTokensRepository;
    private readonly hashProvider;
    private readonly jwtTokenProvider;
    constructor(usersRepository: UsersRepository, refreshTokensRepository: RefreshTokensRepository, hashProvider: HashProvider, jwtTokenProvider: JwtTokenProvider);
    execute({ email, password, userEntity }: LoginUserDto & {
        userEntity?: UserEntity;
    }): Promise<{
        companyId: string;
        permissions: string[];
        roles: string[];
        token: string;
        refresh_token: string;
        user: UserEntity;
    }>;
    validateUser(email: string, password: string): Promise<UserEntity>;
}
