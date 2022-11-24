import { UpdateProtocolToRiskDto } from './../../../dto/protocol-to-risk.dto';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ProtocolToRiskRepository } from './../../../repositories/implementations/ProtocolRiskRepository';
export declare class UpdateProtocolToRiskService {
    private readonly protocolToRiskRepository;
    constructor(protocolToRiskRepository: ProtocolToRiskRepository);
    execute(id: number, updateDto: UpdateProtocolToRiskDto, user: UserPayloadDto): Promise<import("../../../entities/protocol.entity").ProtocolToRiskEntity>;
}
