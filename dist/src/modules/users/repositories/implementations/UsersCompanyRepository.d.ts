import { PrismaService } from '../../../../prisma/prisma.service';
import { UpdateUserCompanyDto } from '../../dto/update-user-company.dto';
import { UserCompanyEntity } from '../../entities/userCompany.entity';
import { IUsersCompanyRepository } from '../IUsersCompanyRepository.types';
export declare class UsersCompanyRepository implements IUsersCompanyRepository {
    private prisma;
    constructor(prisma: PrismaService);
    update({ userId, companyId, ...updateUserCompanyDto }: UpdateUserCompanyDto): Promise<UserCompanyEntity>;
    findByUserIdAndCompanyId(userId: number, companyId: string): Promise<UserCompanyEntity>;
}
