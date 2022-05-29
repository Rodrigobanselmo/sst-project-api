import { UsersRepository } from '../../../repositories/implementations/UsersRepository';
export declare class FindByIdService {
    private readonly userRepository;
    constructor(userRepository: UsersRepository);
    execute(id: number): Promise<import("../../../entities/user.entity").UserEntity>;
}
