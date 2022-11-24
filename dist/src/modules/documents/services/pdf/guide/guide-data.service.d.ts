import { HierarchyRepository } from './../../../../company/repositories/implementations/HierarchyRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CompanyRepository } from '../../../../company/repositories/implementations/CompanyRepository';
import { EmployeeRepository } from '../../../../company/repositories/implementations/EmployeeRepository';
import { IPdfGuideData } from './types/IGuideData.type';
export declare class PdfGuideDataService {
    private readonly employeeRepository;
    private readonly companyRepository;
    private readonly hierarchyRepository;
    constructor(employeeRepository: EmployeeRepository, companyRepository: CompanyRepository, hierarchyRepository: HierarchyRepository);
    execute(employeeId: number, userPayloadDto: UserPayloadDto): Promise<IPdfGuideData>;
}
