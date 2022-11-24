import { ESocialEventProvider } from '../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider';
import { IESocialPropsDto } from '../../../dto/company-report.dto';
import { CompanyEntity } from '../../../entities/company.entity';
import { CompanyReportRepository } from '../../../repositories/implementations/CompanyReportRepository';
import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';
import { EmployeeRepository } from '../../../repositories/implementations/EmployeeRepository';
export declare class UpdateESocialReportService {
    private readonly employeeRepository;
    private readonly companyRepository;
    private readonly eSocialEventProvider;
    private readonly companyReportRepository;
    constructor(employeeRepository: EmployeeRepository, companyRepository: CompanyRepository, eSocialEventProvider: ESocialEventProvider, companyReportRepository: CompanyReportRepository);
    execute({ companyId }: {
        companyId: string;
    }): Promise<import("../../../entities/report.entity").CompanyReportEntity>;
    addCompanyEsocial(company: CompanyEntity): Promise<IESocialPropsDto>;
}
