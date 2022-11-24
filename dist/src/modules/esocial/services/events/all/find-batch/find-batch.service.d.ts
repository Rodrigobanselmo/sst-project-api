import { ESocialBatchRepository } from './../../../../repositories/implementations/ESocialBatchRepository';
import { FindESocialBatchDto } from './../../../../dto/esocial-batch.dto';
import { UserPayloadDto } from './../../../../../../shared/dto/user-payload.dto';
export declare class FindESocialBatchService {
    private readonly eSocialBatchRepository;
    constructor(eSocialBatchRepository: ESocialBatchRepository);
    execute({ skip, take, ...query }: FindESocialBatchDto, user: UserPayloadDto): Promise<{
        data: import("../../../../entities/employeeEsocialBatch.entity").EmployeeESocialBatchEntity[];
        count: number;
    }>;
}
