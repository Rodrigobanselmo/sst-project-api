import { ESocialSendEnum } from '../../../../../../shared/constants/enum/esocial';
import { UserPayloadDto } from '../../../../../../shared/dto/user-payload.dto';
import { ESocialEventProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider';
import { ESocialMethodsProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialMethodsProvider';
import { CompanyRepository } from '../../../../../company/repositories/implementations/CompanyRepository';
import { EmployeeRepository } from '../../../../../company/repositories/implementations/EmployeeRepository';
import { FindEvents2220Dto } from './../../../../dto/event.dto';
export declare class FindEvents2220ESocialService {
    private readonly eSocialEventProvider;
    private readonly eSocialMethodsProvider;
    private readonly employeeRepository;
    private readonly companyRepository;
    constructor(eSocialEventProvider: ESocialEventProvider, eSocialMethodsProvider: ESocialMethodsProvider, employeeRepository: EmployeeRepository, companyRepository: CompanyRepository);
    execute({ skip, take, ...query }: FindEvents2220Dto, user: UserPayloadDto): Promise<{
        data: any[];
        count: number;
        error: {
            message: string;
        };
    } | {
        data: {
            company: import("../../../../../company/entities/company.entity").CompanyEntity;
            doneDate: Date;
            examType: import(".prisma/client").ExamHistoryTypeEnum;
            evaluationType: import(".prisma/client").ExamHistoryEvaluationEnum;
            errors: {
                message: string;
            }[];
            employee: import("../../../../../company/entities/employee.entity").EmployeeEntity;
            type: ESocialSendEnum;
            xml: string;
        }[];
        count: number;
        error?: undefined;
    }>;
}
