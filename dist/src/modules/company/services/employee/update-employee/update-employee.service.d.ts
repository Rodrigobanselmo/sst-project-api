import { UpdateEmployeeDto } from '../../../../../modules/company/dto/employee.dto';
import { EmployeeRepository } from '../../../../../modules/company/repositories/implementations/EmployeeRepository';
export declare class UpdateEmployeeService {
    private readonly employeeRepository;
    constructor(employeeRepository: EmployeeRepository);
    execute(updateEmployeeDto: UpdateEmployeeDto): Promise<import("../../../entities/employee.entity").EmployeeEntity>;
}
