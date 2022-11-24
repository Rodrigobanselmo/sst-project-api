import { CopyProtocolToRiskDto } from './../../../dto/protocol-to-risk.dto';
import { ProtocolToRiskRepository } from './../../../repositories/implementations/ProtocolRiskRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class CopyProtocolToRiskService {
    private readonly protocolToRiskRepository;
    constructor(protocolToRiskRepository: ProtocolToRiskRepository);
    execute(copyProtocolToRiskDto: CopyProtocolToRiskDto, user: UserPayloadDto): Promise<void>;
}
