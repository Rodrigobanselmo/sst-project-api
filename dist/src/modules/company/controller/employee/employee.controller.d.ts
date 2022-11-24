import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateEmployeeDto, FindEmployeeDto, UpdateEmployeeDto } from '../../dto/employee.dto';
import { CreateEmployeeService } from '../../services/employee/create-employee/create-employee.service';
import { DeleteSubOfficeEmployeeService } from '../../services/employee/delete-sub-office-employee/delete-sub-office-employee.service';
import { FindAllAvailableEmployeesService } from '../../services/employee/find-all-available-employees/find-all-available-employees.service';
import { FindEmployeeService } from '../../services/employee/find-employee/find-employee.service';
import { UpdateEmployeeService } from '../../services/employee/update-employee/update-employee.service';
export declare class EmployeeController {
    private readonly createEmployeeService;
    private readonly updateEmployeeService;
    private readonly findEmployeeService;
    private readonly findAllAvailableEmployeesService;
    private readonly deleteSubOfficeEmployeeService;
    constructor(createEmployeeService: CreateEmployeeService, updateEmployeeService: UpdateEmployeeService, findEmployeeService: FindEmployeeService, findAllAvailableEmployeesService: FindAllAvailableEmployeesService, deleteSubOfficeEmployeeService: DeleteSubOfficeEmployeeService);
    create(createEmployeeDto: CreateEmployeeDto): Promise<import("../../entities/employee.entity").EmployeeEntity>;
    deleteSubOffice(employeeId: number, companyId: string, subOfficeId: string): Promise<import("../../entities/employee.entity").EmployeeEntity>;
    update(updateEmployee: UpdateEmployeeDto): Promise<import("../../entities/employee.entity").EmployeeEntity>;
    FindAllAvailable(userPayloadDto: UserPayloadDto, query: FindEmployeeDto): Promise<{
        data: import("../../entities/employee.entity").EmployeeEntity[];
        count: number;
    }>;
    findOne(userPayloadDto: UserPayloadDto, employeeId: number): Promise<import("../../entities/employee.entity").EmployeeEntity>;
}
