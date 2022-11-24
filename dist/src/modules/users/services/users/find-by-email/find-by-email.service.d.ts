import { UsersRepository } from '../../../repositories/implementations/UsersRepository';
export declare class FindByEmailService {
    private readonly userRepository;
    constructor(userRepository: UsersRepository);
    execute(email: string): Promise<import("../../../entities/user.entity").UserEntity>;
}
