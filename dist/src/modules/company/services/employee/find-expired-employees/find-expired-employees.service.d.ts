import { FindEmployeeDto } from '../../../dto/employee.dto';
import { EmployeeRepository } from '../../../repositories/implementations/EmployeeRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class FindAllAvailableEmployeesService {
    private readonly employeeRepository;
    constructor(employeeRepository: EmployeeRepository);
    execute({ skip, take, ...query }: FindEmployeeDto, user: UserPayloadDto): Promise<{
        data: import("../../../entities/employee.entity").EmployeeEntity[];
        count: number;
    }>;
}
