import { CreateRiskDto, UpsertRiskDto } from '../dto/create-risk.dto';
import { RiskFactorsEntity } from '../entities/risk.entity';

interface IRiskRepository {
  create(
    createRiskDto: CreateRiskDto,
    system: boolean,
  ): Promise<RiskFactorsEntity | undefined>;

  upsert(
    upsertRiskDto: UpsertRiskDto,
    system: boolean,
    companyId: string,
  ): Promise<RiskFactorsEntity>;

  upsertMany(
    upsertRiskDtoMany: UpsertRiskDto[],
    system: boolean,
    companyId: string,
  ): Promise<RiskFactorsEntity[]>;

  findById(
    id: number,
    companyId: string,
    include?: {
      company?: boolean;
      recMed?: boolean;
    },
  ): Promise<RiskFactorsEntity>;

  findAllByCompanyId(
    companyId: string,
    include?: {
      company?: boolean;
      recMed?: boolean;
    },
  ): Promise<RiskFactorsEntity[]>;
}
export { IRiskRepository };
