import { HierarchyEntity } from './../../../../company/entities/hierarchy.entity';
import { HierarchyRepository } from './../../../../company/repositories/implementations/HierarchyRepository';
import { ExamHistoryTypeEnum } from '@prisma/client';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { IPriorRiskData } from '../../../../../shared/utils/onGetRisks';
import { EmployeeEntity } from '../../../../company/entities/employee.entity';
import { EmployeeExamsHistoryRepository } from '../../../../company/repositories/implementations/EmployeeExamsHistoryRepository';
import { ExamEntity } from '../../../../sst/entities/exam.entity';
import { ExamRiskEntity } from '../../../../sst/entities/examRisk.entity';
import { ExamRiskDataEntity } from '../../../../sst/entities/examRiskData.entity';
import { FindExamByHierarchyService } from '../../../../sst/services/exam/find-by-hierarchy /find-exam-by-hierarchy.service';
import { FindAllRiskDataByEmployeeService } from '../../../../sst/services/risk-data/find-by-employee/find-by-employee.service';
import { IPdfAsoData } from './types/IAsoData.type';
export declare const checkExamType: (exam: ExamRiskDataEntity | ExamRiskEntity, examType: ExamHistoryTypeEnum) => boolean;
export declare class PdfAsoDataService {
    private readonly employeeExamsHistoryRepository;
    private readonly hierarchyRepository;
    private readonly findAllRiskDataByEmployeeService;
    private readonly findExamByHierarchyService;
    constructor(employeeExamsHistoryRepository: EmployeeExamsHistoryRepository, hierarchyRepository: HierarchyRepository, findAllRiskDataByEmployeeService: FindAllRiskDataByEmployeeService, findExamByHierarchyService: FindExamByHierarchyService);
    execute(employeeId: number, userPayloadDto: UserPayloadDto, asoId?: number): Promise<IPdfAsoData>;
    onGetAllExamsData(employee: EmployeeEntity, asoRisk: IPriorRiskData[], examRepresentAll: ExamEntity[], examType: ExamHistoryTypeEnum): (ExamRiskEntity | ExamRiskDataEntity)[];
    onGetSector(hierarchy: Partial<HierarchyEntity>): HierarchyEntity;
}
