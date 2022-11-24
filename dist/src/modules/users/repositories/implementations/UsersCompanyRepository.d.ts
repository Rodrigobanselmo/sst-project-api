import { PrismaService } from '../../../../prisma/prisma.service';
import { UpdateUserCompanyDto } from '../../dto/update-user-company.dto';
import { UserCompanyEntity } from '../../entities/userCompany.entity';
import { IUsersCompanyRepository } from '../IUsersCompanyRepository.types';
export declare class UsersCompanyRepository implements IUsersCompanyRepository {
    private prisma;
    constructor(prisma: PrismaService);
    upsertMany({ userId, companyId, companiesIds, ...updateUserCompanyDto }: UpdateUserCompanyDto): Promise<UserCompanyEntity[]>;
    update({ userId, companyId, companiesIds, ...updateUserCompanyDto }: UpdateUserCompanyDto): Promise<UserCompanyEntity>;
    findByUserIdAndCompanyId(userId: number, companyId: string): Promise<UserCompanyEntity>;
    deleteAllFromConsultant(userId: number, companyId: string): Promise<void>;
}
