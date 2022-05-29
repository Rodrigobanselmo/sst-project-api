import { EmployeeRepository } from '../../../../../modules/company/repositories/implementations/EmployeeRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class FindEmployeeService {
    private readonly employeeRepository;
    constructor(employeeRepository: EmployeeRepository);
    execute(id: number, user: UserPayloadDto): Promise<import("../../../entities/employee.entity").EmployeeEntity>;
}
