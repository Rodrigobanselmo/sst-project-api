import { FirebaseProvider } from '../../../../../shared/providers/FirebaseProvider/FirebaseProvider';
import { UsersRepository } from '../../../../users/repositories/implementations/UsersRepository';
import { LoginGoogleUserDto } from '../../../dto/login-user.dto';
export declare class VerifyGoogleLoginService {
    private readonly usersRepository;
    private readonly firebaseProvider;
    constructor(usersRepository: UsersRepository, firebaseProvider: FirebaseProvider);
    execute({ token }: LoginGoogleUserDto): Promise<import("../../../../users/entities/user.entity").UserEntity>;
}
