import { Cache } from 'cache-manager';
import { EmployeePPPHistoryRepository } from '../../../../../../modules/company/repositories/implementations/EmployeePPPHistoryRepository';
import { UserPayloadDto } from '../../../../../../shared/dto/user-payload.dto';
import { DayJSProvider } from '../../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { ESocialEventProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider';
import { ESocialMethodsProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialMethodsProvider';
import { CompanyReportRepository } from '../../../../../company/repositories/implementations/CompanyReportRepository';
import { CompanyRepository } from '../../../../../company/repositories/implementations/CompanyRepository';
import { EmployeeRepository } from '../../../../../company/repositories/implementations/EmployeeRepository';
import { UpdateESocialReportService } from '../../../../../company/services/report/update-esocial-report/update-esocial-report.service';
import { Event2240Dto } from '../../../../dto/event.dto';
import { ESocialBatchRepository } from '../../../../repositories/implementations/ESocialBatchRepository';
import { FindEvents2240ESocialService } from '../find-events/find-events.service';
export declare class SendEvents2240ESocialService {
    private cacheManager;
    private readonly eSocialEventProvider;
    private readonly eSocialMethodsProvider;
    private readonly employeePPPHistoryRepository;
    private readonly employeeRepository;
    private readonly companyRepository;
    private readonly companyReportRepository;
    private readonly updateESocialReportService;
    private readonly eSocialBatchRepository;
    private readonly dayJSProvider;
    private readonly findEvents2240ESocialService;
    constructor(cacheManager: Cache, eSocialEventProvider: ESocialEventProvider, eSocialMethodsProvider: ESocialMethodsProvider, employeePPPHistoryRepository: EmployeePPPHistoryRepository, employeeRepository: EmployeeRepository, companyRepository: CompanyRepository, companyReportRepository: CompanyReportRepository, updateESocialReportService: UpdateESocialReportService, eSocialBatchRepository: ESocialBatchRepository, dayJSProvider: DayJSProvider, findEvents2240ESocialService: FindEvents2240ESocialService);
    execute(body: Event2240Dto, user: UserPayloadDto): Promise<{
        fileStream: any;
        fileName: string;
    }>;
}
