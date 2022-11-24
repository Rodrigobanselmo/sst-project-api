import { NotificationRepository } from './../../../../../../notifications/repositories/implementations/NotificationRepository';
import { DayJSProvider } from '../../../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { UpdateManyScheduleExamDto } from '../../../../../dto/employee-exam-history';
import { EmployeeExamsHistoryRepository } from '../../../../../repositories/implementations/EmployeeExamsHistoryRepository';
import { EmployeeRepository } from '../../../../../repositories/implementations/EmployeeRepository';
import { CreateEmployeeHierarchyHistoryService } from '../../hierarchy/create/create.service';
import { UserPayloadDto } from './../../../../../../../shared/dto/user-payload.dto';
import { EmployeeEntity } from './../../../../../entities/employee.entity';
export declare class UpdateManyScheduleExamHistoryService {
    private readonly employeeExamHistoryRepository;
    private readonly employeeRepository;
    private readonly createEmployeeHierarchyHistoryService;
    private readonly dayJSProvider;
    private readonly notificationRepository;
    constructor(employeeExamHistoryRepository: EmployeeExamsHistoryRepository, employeeRepository: EmployeeRepository, createEmployeeHierarchyHistoryService: CreateEmployeeHierarchyHistoryService, dayJSProvider: DayJSProvider, notificationRepository: NotificationRepository);
    execute({ data, isClinic, ...dataDto }: UpdateManyScheduleExamDto, user: UserPayloadDto): Promise<import("../../../../../entities/employee-exam-history.entity").EmployeeExamsHistoryEntity[]>;
    changeHierarchy(dataDto: UpdateManyScheduleExamDto, user: UserPayloadDto, employee: EmployeeEntity): Promise<void>;
    sendNotification(dataDto: UpdateManyScheduleExamDto, user: UserPayloadDto, employee: EmployeeEntity): Promise<void>;
}
