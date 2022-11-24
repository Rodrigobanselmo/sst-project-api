import { EmployeePPPHistoryRepository } from './../../../repositories/implementations/EmployeePPPHistoryRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { HomoGroupRepository } from '../../../repositories/implementations/HomoGroupRepository';
import { RiskDataRepository } from '../../../../sst/repositories/implementations/RiskDataRepository';
import { UpsertManyRiskDataService } from '../../../../sst/services/risk-data/upsert-many-risk-data/upsert-many-risk-data.service';
import { CopyHomogeneousGroupDto } from './../../../dto/homoGroup';
export declare class CopyHomoGroupService {
    private readonly employeePPPHistoryRepository;
    private readonly homoGroupRepository;
    private readonly riskDataRepository;
    private readonly upsertManyRiskDataService;
    constructor(employeePPPHistoryRepository: EmployeePPPHistoryRepository, homoGroupRepository: HomoGroupRepository, riskDataRepository: RiskDataRepository, upsertManyRiskDataService: UpsertManyRiskDataService);
    execute({ actualGroupId, riskGroupId, copyFromHomoGroupId, riskGroupIdFrom, companyIdFrom, hierarchyId, ...rest }: CopyHomogeneousGroupDto, userPayloadDto: UserPayloadDto): Promise<void>;
}
