import { HierarchyEntity } from './../../../../company/entities/hierarchy.entity';
import { FindAllRiskDataByEmployeeService } from './../../../../sst/services/risk-data/find-by-employee/find-by-employee.service';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { EmployeeEntity } from '../../../../company/entities/employee.entity';
import { EmployeeRepository } from '../../../../company/repositories/implementations/EmployeeRepository';
import { IPdfProntuarioData, IProntuarioQuestion } from './types/IProntuarioData.type';
export declare class PdfProntuarioDataService {
    private readonly employeeRepository;
    private readonly findAllRiskDataByEmployeeService;
    constructor(employeeRepository: EmployeeRepository, findAllRiskDataByEmployeeService: FindAllRiskDataByEmployeeService);
    execute(employeeId: number, userPayloadDto: UserPayloadDto): Promise<IPdfProntuarioData>;
    getQuestions(employee: EmployeeEntity, companyId: string): Promise<IProntuarioQuestion[]>;
    getExamination(employee: EmployeeEntity, companyId: string): Promise<IProntuarioQuestion[]>;
    onGetSector(hierarchy: Partial<HierarchyEntity>): HierarchyEntity;
}
