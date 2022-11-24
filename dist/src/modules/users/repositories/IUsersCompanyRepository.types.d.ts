import { UpdateUserCompanyDto } from '../dto/update-user-company.dto';
import { UserCompanyEntity } from '../entities/userCompany.entity';
interface IUsersCompanyRepository {
    update(updateUserCompanyDto: UpdateUserCompanyDto): Promise<UserCompanyEntity>;
    findByUserIdAndCompanyId(userId: number, companyId: string): Promise<UserCompanyEntity | undefined>;
}
export { IUsersCompanyRepository };
