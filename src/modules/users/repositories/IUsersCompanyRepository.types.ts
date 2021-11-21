import { UserCompanyEntity } from '../entities/userCompany.entity';

interface IUsersCompanyRepository {
  findByUserIdAndCompanyId(
    userId: number,
    companyId: string,
  ): Promise<UserCompanyEntity | undefined>;
}
export { IUsersCompanyRepository };
