import { EmployeePPPHistoryRepository } from './../../../../company/repositories/implementations/EmployeePPPHistoryRepository';
import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { HomoGroupRepository } from '../../../../company/repositories/implementations/HomoGroupRepository';
import { UpsertManyRiskDataDto } from '../../../dto/risk-data.dto';
import { RiskDataRepository } from '../../../repositories/implementations/RiskDataRepository';
export declare class UpsertManyRiskDataService {
    private readonly riskDataRepository;
    private readonly homoGroupRepository;
    private readonly hierarchyRepository;
    private readonly employeePPPHistoryRepository;
    constructor(riskDataRepository: RiskDataRepository, homoGroupRepository: HomoGroupRepository, hierarchyRepository: HierarchyRepository, employeePPPHistoryRepository: EmployeePPPHistoryRepository);
    execute(upsertRiskDataDto: UpsertManyRiskDataDto): Promise<import("../../../entities/riskData.entity").RiskFactorDataEntity[][]>;
}
