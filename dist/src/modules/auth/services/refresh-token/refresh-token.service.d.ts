import { UsersRepository } from '../../../../modules/users/repositories/implementations/UsersRepository';
import { JwtTokenProvider } from '../../../../shared/providers/TokenProvider/implementations/JwtTokenProvider';
import { RefreshTokensRepository } from '../../repositories/implementations/RefreshTokensRepository';
export declare class RefreshTokenService {
    private readonly usersRepository;
    private readonly refreshTokensRepository;
    private readonly jwtTokenProvider;
    constructor(usersRepository: UsersRepository, refreshTokensRepository: RefreshTokensRepository, jwtTokenProvider: JwtTokenProvider);
    execute(refresh_token: string): Promise<{
        companyId: string;
        permissions: string[];
        roles: string[];
        refresh_token: string;
        token: string;
        user: import("../../../users/entities/user.entity").UserEntity;
    }>;
}
