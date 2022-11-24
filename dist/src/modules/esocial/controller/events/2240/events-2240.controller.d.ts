import { FindEvents2240ESocialService } from '../../../services/events/2240/find-events/find-events.service';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { Event2240Dto, FindEvents2240Dto } from '../../../dto/event.dto';
import { SendEvents2240ESocialService } from '../../../services/events/2240/send-events/send-events.service';
export declare class ESocialEvent2240Controller {
    private readonly sendEvents2240ESocialService;
    private readonly findEvents2240ESocialService;
    constructor(sendEvents2240ESocialService: SendEvents2240ESocialService, findEvents2240ESocialService: FindEvents2240ESocialService);
    find(query: FindEvents2240Dto, userPayloadDto: UserPayloadDto): Promise<{
        data: any[];
        count: number;
        error: {
            message: string;
        };
    } | {
        data: {
            doneDate: Date;
            errors: {
                message: string;
            }[];
            employee: import("../../../../company/entities/employee.entity").EmployeeEntity;
            type: import("../../../../../shared/constants/enum/esocial").ESocialSendEnum;
            risks: string[];
            xml: string;
        }[];
        count: number;
        error?: undefined;
    }>;
    sendBatch(res: any, body: Event2240Dto, userPayloadDto: UserPayloadDto): Promise<any>;
}
