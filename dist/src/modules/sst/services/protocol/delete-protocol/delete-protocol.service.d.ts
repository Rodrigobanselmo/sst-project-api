import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ProtocolRepository } from '../../../repositories/implementations/ProtocolRepository';
export declare class DeleteSoftProtocolsService {
    private readonly protocolRepository;
    constructor(protocolRepository: ProtocolRepository);
    execute(id: number, user: UserPayloadDto): Promise<import("../../../entities/protocol.entity").ProtocolEntity>;
}
