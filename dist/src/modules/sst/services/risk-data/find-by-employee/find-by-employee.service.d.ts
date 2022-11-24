import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { EmployeeRepository } from '../../../../company/repositories/implementations/EmployeeRepository';
import { RiskRepository } from '../../../repositories/implementations/RiskRepository';
import { RiskFactorDataEntity } from '../../../entities/riskData.entity';
export declare class FindAllRiskDataByEmployeeService {
    private readonly riskRepository;
    private readonly employeeRepository;
    private readonly hierarchyRepository;
    constructor(riskRepository: RiskRepository, employeeRepository: EmployeeRepository, hierarchyRepository: HierarchyRepository);
    execute(employeeId: number, companyId?: string, options?: {
        fromExam?: boolean;
        filterDate?: boolean;
    }): Promise<RiskFactorDataEntity[]>;
    getRiskData(employeeId: number, companyId?: string, options?: {
        fromExam?: boolean;
        filterDate?: boolean;
        hierarchyData?: boolean;
    }): Promise<{
        risk: RiskFactorDataEntity[];
        employee: import("../../../../company/entities/employee.entity").EmployeeEntity;
    }>;
}
