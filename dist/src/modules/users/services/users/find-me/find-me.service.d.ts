import { UsersRepository } from '../../../repositories/implementations/UsersRepository';
export declare class FindMeService {
    private readonly userRepository;
    constructor(userRepository: UsersRepository);
    execute(id: number, companyId?: string): Promise<{
        companyId: string;
        permissions: string[];
        roles: string[];
        id: number;
        email: string;
        password: string;
        updated_at: Date;
        created_at: Date;
        companies?: import("../../../entities/userCompany.entity").UserCompanyEntity[];
    }>;
}
