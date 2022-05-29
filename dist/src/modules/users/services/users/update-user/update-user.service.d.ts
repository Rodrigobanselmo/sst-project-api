import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { HashProvider } from '../../../../../shared/providers/HashProvider/implementations/HashProvider';
import { UpdateUserDto } from '../../../dto/update-user.dto';
import { UsersRepository } from '../../../repositories/implementations/UsersRepository';
import { FindByTokenService } from '../../invites/find-by-token/find-by-token.service';
export declare class UpdateUserService {
    private readonly userRepository;
    private readonly hashProvider;
    private readonly dateProvider;
    private readonly findByTokenService;
    constructor(userRepository: UsersRepository, hashProvider: HashProvider, dateProvider: DayJSProvider, findByTokenService: FindByTokenService);
    execute(id: number, { password, oldPassword, token, ...restUpdateUserDto }: UpdateUserDto): Promise<import("../../../entities/user.entity").UserEntity>;
}