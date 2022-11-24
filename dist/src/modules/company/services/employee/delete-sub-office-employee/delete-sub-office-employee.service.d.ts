import { DeleteSubOfficeEmployeeDto } from '../../../dto/employee.dto';
import { EmployeeRepository } from '../../../repositories/implementations/EmployeeRepository';
export declare class DeleteSubOfficeEmployeeService {
    private readonly employeeRepository;
    constructor(employeeRepository: EmployeeRepository);
    execute({ companyId, id, subOfficeId }: DeleteSubOfficeEmployeeDto): Promise<import("../../../entities/employee.entity").EmployeeEntity>;
}
