import { CreateRiskDto } from '../dto/create-risk.dto';
import { RiskFactorsEntity } from '../entities/risk.entity';

interface IRiskRepository {
  create(
    createRiskDto: CreateRiskDto,
    system: boolean,
  ): Promise<RiskFactorsEntity | undefined>;
}
export { IRiskRepository };
