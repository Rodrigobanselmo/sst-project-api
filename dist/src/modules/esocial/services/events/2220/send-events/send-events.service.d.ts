import { Cache } from 'cache-manager';
import { CompanyReportRepository } from '../../../../../../modules/company/repositories/implementations/CompanyReportRepository';
import { UserPayloadDto } from '../../../../../../shared/dto/user-payload.dto';
import { DayJSProvider } from '../../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { ESocialEventProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider';
import { ESocialMethodsProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialMethodsProvider';
import { CompanyRepository } from '../../../../../company/repositories/implementations/CompanyRepository';
import { EmployeeExamsHistoryRepository } from '../../../../../company/repositories/implementations/EmployeeExamsHistoryRepository';
import { EmployeeRepository } from '../../../../../company/repositories/implementations/EmployeeRepository';
import { UpdateESocialReportService } from './../../../../../company/services/report/update-esocial-report/update-esocial-report.service';
import { Event2220Dto } from './../../../../dto/event.dto';
import { ESocialBatchRepository } from './../../../../repositories/implementations/ESocialBatchRepository';
export declare class SendEvents2220ESocialService {
    private cacheManager;
    private readonly eSocialEventProvider;
    private readonly eSocialMethodsProvider;
    private readonly employeeExamHistoryRepository;
    private readonly employeeRepository;
    private readonly companyRepository;
    private readonly companyReportRepository;
    private readonly updateESocialReportService;
    private readonly eSocialBatchRepository;
    private readonly dayJSProvider;
    constructor(cacheManager: Cache, eSocialEventProvider: ESocialEventProvider, eSocialMethodsProvider: ESocialMethodsProvider, employeeExamHistoryRepository: EmployeeExamsHistoryRepository, employeeRepository: EmployeeRepository, companyRepository: CompanyRepository, companyReportRepository: CompanyReportRepository, updateESocialReportService: UpdateESocialReportService, eSocialBatchRepository: ESocialBatchRepository, dayJSProvider: DayJSProvider);
    execute(body: Event2220Dto, user: UserPayloadDto): Promise<{
        fileStream: any;
        fileName: string;
    }>;
}
