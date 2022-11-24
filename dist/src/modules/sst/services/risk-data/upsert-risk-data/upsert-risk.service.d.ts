import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { HomoGroupRepository } from '../../../../company/repositories/implementations/HomoGroupRepository';
import { UpsertRiskDataDto } from '../../../dto/risk-data.dto';
import { RiskDataRepository } from '../../../repositories/implementations/RiskDataRepository';
import { EmployeePPPHistoryRepository } from './../../../../company/repositories/implementations/EmployeePPPHistoryRepository';
export declare class UpsertRiskDataService {
    private readonly riskDataRepository;
    private readonly homoGroupRepository;
    private readonly hierarchyRepository;
    private readonly employeePPPHistoryRepository;
    constructor(riskDataRepository: RiskDataRepository, homoGroupRepository: HomoGroupRepository, hierarchyRepository: HierarchyRepository, employeePPPHistoryRepository: EmployeePPPHistoryRepository);
    execute(upsertRiskDataDto: UpsertRiskDataDto): Promise<string | import("../../../entities/riskData.entity").RiskFactorDataEntity>;
}
export declare const hierarchyCreateHomo: ({ homoGroupRepository, hierarchyRepository, type, workspaceId, homogeneousGroupId, companyId, }: {
    homoGroupRepository: HomoGroupRepository;
    hierarchyRepository: HierarchyRepository;
    type: 'HIERARCHY';
    workspaceId: string;
    homogeneousGroupId: string;
    companyId: string;
}) => Promise<void>;
