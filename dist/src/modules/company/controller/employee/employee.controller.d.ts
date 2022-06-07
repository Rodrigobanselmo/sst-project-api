import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateEmployeeDto } from '../../dto/employee.dto';
import { CreateEmployeeService } from '../../services/employee/create-employee/create-employee.service';
import { FindAllAvailableEmployeesService } from '../../services/employee/find-all-available-employees/find-all-available-employees.service';
import { FindEmployeeService } from '../../services/employee/find-employee/find-employee.service';
export declare class EmployeeController {
    private readonly createEmployeeService;
    private readonly findEmployeeService;
    private readonly findAllAvailableEmployeesService;
    constructor(createEmployeeService: CreateEmployeeService, findEmployeeService: FindEmployeeService, findAllAvailableEmployeesService: FindAllAvailableEmployeesService);
    create(createEmployeeDto: CreateEmployeeDto): Promise<import("../../entities/employee.entity").EmployeeEntity>;
    FindAllAvailable(userPayloadDto: UserPayloadDto): Promise<import("../../entities/employee.entity").EmployeeEntity[]>;
    findOne(userPayloadDto: UserPayloadDto, employeeId: number): Promise<import("../../entities/employee.entity").EmployeeEntity>;
}
