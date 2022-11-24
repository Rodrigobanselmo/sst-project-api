import { FindProtocolDto } from './../../../dto/protocol.dto';
import { ProtocolRepository } from '../../../repositories/implementations/ProtocolRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class FindProtocolsService {
    private readonly protocolRepository;
    constructor(protocolRepository: ProtocolRepository);
    execute({ skip, take, ...query }: FindProtocolDto, user: UserPayloadDto): Promise<{
        data: import("../../../entities/protocol.entity").ProtocolEntity[];
        count: number;
    }>;
}
