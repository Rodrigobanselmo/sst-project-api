import { CreateCompanyDto } from '../dto/company.dto';
import { CompanyEntity } from '../entities/company.entity';

interface ICompanyRepository {
  create(createCompanyDto: CreateCompanyDto): Promise<CompanyEntity | undefined>;
}
export { ICompanyRepository };
