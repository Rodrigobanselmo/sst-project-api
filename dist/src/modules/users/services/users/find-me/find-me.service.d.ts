import { UsersRepository } from '../../../repositories/implementations/UsersRepository';
export declare class FindMeService {
    private readonly userRepository;
    constructor(userRepository: UsersRepository);
    execute(id: number, companyId?: string): Promise<{
        permissions: string[];
        roles: string[];
        companyId: string;
        id: number;
        email: string;
        name: string;
        password: string;
        updated_at: Date;
        created_at: Date;
        deleted_at: Date;
        companies?: import("../../../entities/userCompany.entity").UserCompanyEntity[];
        formation: string[];
        certifications: string[];
        cpf: string;
        phone: string;
        googleExternalId: string;
        facebookExternalId: string;
        councilType: string;
        councilUF: string;
        councilId: string;
        type: import(".prisma/client").ProfessionalTypeEnum;
        professional?: import("../../../entities/professional.entity").ProfessionalEntity;
        userPgrSignature?: import("../../../../sst/entities/usersRiskGroup").UsersRiskGroupEntity;
        usersPgrSignatures?: import("../../../../sst/entities/usersRiskGroup").UsersRiskGroupEntity[];
        councils?: import("../../../entities/council.entity").ProfessionalCouncilEntity[];
    }>;
}
