import { FindEvents2220ESocialService } from '../../../../../modules/esocial/services/events/2220/find-events/find-events.service';
import { UserPayloadDto } from './../../../../../shared/dto/user-payload.dto';
import { Event2220Dto, FindEvents2220Dto } from './../../../dto/event.dto';
import { SendEvents2220ESocialService } from './../../../services/events/2220/send-events/send-events.service';
export declare class ESocialEvent2220Controller {
    private readonly sendEvents2220ESocialService;
    private readonly findEvents2220ESocialService;
    constructor(sendEvents2220ESocialService: SendEvents2220ESocialService, findEvents2220ESocialService: FindEvents2220ESocialService);
    find(query: FindEvents2220Dto, userPayloadDto: UserPayloadDto): Promise<{
        data: any[];
        count: number;
        error: {
            message: string;
        };
    } | {
        data: {
            company: import("../../../../company/entities/company.entity").CompanyEntity;
            doneDate: Date;
            examType: import(".prisma/client").ExamHistoryTypeEnum;
            evaluationType: import(".prisma/client").ExamHistoryEvaluationEnum;
            errors: {
                message: string;
            }[];
            employee: import("../../../../company/entities/employee.entity").EmployeeEntity;
            type: import("../../../../../shared/constants/enum/esocial").ESocialSendEnum;
            xml: string;
        }[];
        count: number;
        error?: undefined;
    }>;
    sendBatch(res: any, body: Event2220Dto, userPayloadDto: UserPayloadDto): Promise<any>;
}
