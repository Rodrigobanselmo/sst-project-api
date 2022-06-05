import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { UsersRepository } from '../../../repositories/implementations/UsersRepository';
export declare class FindAllByCompanyService {
    private readonly userRepository;
    constructor(userRepository: UsersRepository);
    execute(user: UserPayloadDto): Promise<import("../../../entities/user.entity").UserEntity[]>;
}
