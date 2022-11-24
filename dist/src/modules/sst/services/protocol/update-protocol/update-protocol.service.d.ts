import { UpdateProtocolDto } from '../../../dto/protocol.dto';
import { ProtocolRepository } from '../../../repositories/implementations/ProtocolRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class UpdateProtocolsService {
    private readonly protocolRepository;
    constructor(protocolRepository: ProtocolRepository);
    execute(UpsertProtocolsDto: UpdateProtocolDto, user: UserPayloadDto): Promise<import("../../../entities/protocol.entity").ProtocolEntity>;
}
