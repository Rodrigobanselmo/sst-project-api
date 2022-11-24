import { NotificationRepository } from './../../../../../../notifications/repositories/implementations/NotificationRepository';
import { EmployeeEntity } from '../../../../../../../modules/company/entities/employee.entity';
import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { EmployeeRepository } from '../../../../../repositories/implementations/EmployeeRepository';
import { CreateEmployeeHierarchyHistoryService } from '../../hierarchy/create/create.service';
import { CreateEmployeeExamHistoryDto } from './../../../../../dto/employee-exam-history';
import { EmployeeExamsHistoryRepository } from './../../../../../repositories/implementations/EmployeeExamsHistoryRepository';
export declare class CreateEmployeeExamHistoryService {
    private readonly employeeExamHistoryRepository;
    private readonly employeeRepository;
    private readonly createEmployeeHierarchyHistoryService;
    private readonly notificationRepository;
    constructor(employeeExamHistoryRepository: EmployeeExamsHistoryRepository, employeeRepository: EmployeeRepository, createEmployeeHierarchyHistoryService: CreateEmployeeHierarchyHistoryService, notificationRepository: NotificationRepository);
    execute(dataDto: CreateEmployeeExamHistoryDto, user: UserPayloadDto): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getUser(dataDto: CreateEmployeeExamHistoryDto, user: UserPayloadDto): {
        userScheduleId: number;
        userDoneId: number;
    };
    checkOtherSchedulesAndCancel(dataDto: CreateEmployeeExamHistoryDto, employee: EmployeeEntity): Promise<void>;
    changeHierarchy(dataDto: CreateEmployeeExamHistoryDto, user: UserPayloadDto): Promise<void>;
}
