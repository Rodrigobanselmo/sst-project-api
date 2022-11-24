import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { UpdateProtocolRiskDto } from '../../../dto/protocol.dto';
import { ProtocolRepository } from '../../../repositories/implementations/ProtocolRepository';
export declare class UpdateRiskProtocolsService {
    private readonly protocolRepository;
    constructor(protocolRepository: ProtocolRepository);
    execute(UpsertProtocolsDto: UpdateProtocolRiskDto, user: UserPayloadDto): Promise<import("../../../entities/protocol.entity").ProtocolEntity[]>;
}
