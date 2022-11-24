import { ESocialEventRepository } from '../../../../repositories/implementations/ESocialEventRepository';
import { FindESocialEventDto } from '../../../../dto/esocial-event.dto';
import { UserPayloadDto } from '../../../../../../shared/dto/user-payload.dto';
export declare class FindESocialEventService {
    private readonly eSocialEventRepository;
    constructor(eSocialEventRepository: ESocialEventRepository);
    execute({ skip, take, ...query }: FindESocialEventDto, user: UserPayloadDto): Promise<{
        data: import("../../../../entities/employeeEsocialEvent.entity").EmployeeESocialEventEntity[];
        count: number;
    }>;
}
