import { FindProtocolToRiskDto } from './../../../dto/protocol-to-risk.dto';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ProtocolToRiskRepository } from './../../../repositories/implementations/ProtocolRiskRepository';
export declare class FindProtocolToRiskService {
    private readonly protocolToRiskRepository;
    constructor(protocolToRiskRepository: ProtocolToRiskRepository);
    execute({ skip, take, ...query }: FindProtocolToRiskDto, user: UserPayloadDto): Promise<{
        data: import("../../../entities/protocol.entity").ProtocolToRiskEntity[];
        count: number;
    }>;
}
