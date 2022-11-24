import { CompanyReportRepository } from './../../../repositories/implementations/CompanyReportRepository';
import { DocumentRepository } from '../../../repositories/implementations/DocumentRepository';
import { FindExamByHierarchyService } from '../../../../sst/services/exam/find-by-hierarchy /find-exam-by-hierarchy.service';
import { FindCompanyDashDto } from '../../../dto/dashboard.dto';
import { EmployeeRepository } from '../../../repositories/implementations/EmployeeRepository';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class DashboardCompanyService {
    private readonly employeeRepository;
    private readonly findExamByHierarchyService;
    private readonly documentRepository;
    private readonly companyReportRepository;
    private readonly dayjs;
    constructor(employeeRepository: EmployeeRepository, findExamByHierarchyService: FindExamByHierarchyService, documentRepository: DocumentRepository, companyReportRepository: CompanyReportRepository, dayjs: DayJSProvider);
    execute(findDto: FindCompanyDashDto, user: UserPayloadDto): Promise<import("../../../entities/report.entity").CompanyReportEntity>;
}
