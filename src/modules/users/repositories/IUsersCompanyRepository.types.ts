import { UserCompanyEntity } from '../entities/userCompany.entity';

interface IUsersCompanyRepository {
  findByUserIdAndCompanyId(
    userId: number,
    companyId: number,
  ): Promise<UserCompanyEntity | undefined>;
}
export { IUsersCompanyRepository };
