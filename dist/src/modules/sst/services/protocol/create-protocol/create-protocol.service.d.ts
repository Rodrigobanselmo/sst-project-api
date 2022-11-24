import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CreateProtocolDto } from '../../../dto/protocol.dto';
import { ProtocolRepository } from '../../../repositories/implementations/ProtocolRepository';
export declare class CreateProtocolsService {
    private readonly protocolRepository;
    constructor(protocolRepository: ProtocolRepository);
    execute(UpsertProtocolsDto: CreateProtocolDto, user: UserPayloadDto): Promise<import("../../../entities/protocol.entity").ProtocolEntity>;
}
