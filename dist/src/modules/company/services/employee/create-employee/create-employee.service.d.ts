import { CreateEmployeeDto } from '../../../../../modules/company/dto/employee.dto';
import { EmployeeRepository } from '../../../../../modules/company/repositories/implementations/EmployeeRepository';
export declare class CreateEmployeeService {
    private readonly employeeRepository;
    constructor(employeeRepository: EmployeeRepository);
    execute(createEmployeeDto: CreateEmployeeDto): Promise<import("../../../entities/employee.entity").EmployeeEntity>;
}
