import { UsersRepository } from '../../../../users/repositories/implementations/UsersRepository';
import { JwtTokenProvider } from '../../../../../shared/providers/TokenProvider/implementations/JwtTokenProvider';
import { RefreshTokensRepository } from '../../../repositories/implementations/RefreshTokensRepository';
export declare class RefreshTokenService {
    private readonly usersRepository;
    private readonly refreshTokensRepository;
    private readonly jwtTokenProvider;
    constructor(usersRepository: UsersRepository, refreshTokensRepository: RefreshTokensRepository, jwtTokenProvider: JwtTokenProvider);
    execute(refresh_token: string, companyId?: string): Promise<{
        permissions: string[];
        roles: string[];
        companyId: string;
        refresh_token: string;
        token: string;
        user: import("../../../../users/entities/user.entity").UserEntity;
    }>;
}
