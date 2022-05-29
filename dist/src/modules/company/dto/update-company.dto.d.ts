import { CreateCompanyDto } from './create-company.dto';
import { UpdateEmployeeDto } from './employee.dto';
import { UserCompanyEditDto } from './update-user-company.dto';
declare const UpdateCompanyDto_base: import("@nestjs/common").Type<Partial<CreateCompanyDto>>;
export declare class UpdateCompanyDto extends UpdateCompanyDto_base {
    id?: string;
    companyId: string;
    users: UserCompanyEditDto[];
    employees: UpdateEmployeeDto[];
}
export {};
