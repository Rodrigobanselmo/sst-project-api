import { RefreshTokensRepository } from '../../../../auth/repositories/implementations/RefreshTokensRepository';
import { HashProvider } from '../../../../../shared/providers/HashProvider/implementations/HashProvider';
import { ResetPasswordDto } from '../../../dto/reset-pass';
import { UsersRepository } from '../../../repositories/implementations/UsersRepository';
export declare class ResetPasswordService {
    private readonly userRepository;
    private readonly refreshTokensRepository;
    private readonly hashProvider;
    constructor(userRepository: UsersRepository, refreshTokensRepository: RefreshTokensRepository, hashProvider: HashProvider);
    execute({ tokenId, password }: ResetPasswordDto): Promise<import("../../../entities/user.entity").UserEntity>;
}
