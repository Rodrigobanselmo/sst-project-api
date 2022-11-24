import { PrismaService } from './../../../../../../prisma/prisma.service';
import { Cache } from 'cache-manager';
import { ESocialEventRepository } from '../../../../../../modules/esocial/repositories/implementations/ESocialEventRepository';
import { ESocialEventProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider';
import { EmployeeExamsHistoryRepository } from '../../../../../company/repositories/implementations/EmployeeExamsHistoryRepository';
import { ESocialBatchRepository } from '../../../../repositories/implementations/ESocialBatchRepository';
import { UpdateESocialReportService } from './../../../../../company/services/report/update-esocial-report/update-esocial-report.service';
export declare class FetchESocialBatchEventsService {
    private cacheManager;
    private readonly eSocialEventProvider;
    private readonly employeeExamHistoryRepository;
    private readonly eSocialBatchRepository;
    private readonly eSocialEventRepository;
    private readonly updateESocialReportService;
    private prisma;
    constructor(cacheManager: Cache, eSocialEventProvider: ESocialEventProvider, employeeExamHistoryRepository: EmployeeExamsHistoryRepository, eSocialBatchRepository: ESocialBatchRepository, eSocialEventRepository: ESocialEventRepository, updateESocialReportService: UpdateESocialReportService, prisma: PrismaService);
    execute(): Promise<void>;
}
