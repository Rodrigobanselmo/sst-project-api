import { ProtocolToRiskRepository } from './../../../repositories/implementations/ProtocolRiskRepository';
import { CreateProtocolToRiskDto } from './../../../dto/protocol-to-risk.dto';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class CreateProtocolToRiskService {
    private readonly protocolToRiskRepository;
    constructor(protocolToRiskRepository: ProtocolToRiskRepository);
    execute(createExamDto: CreateProtocolToRiskDto, user: UserPayloadDto): Promise<import("../../../entities/protocol.entity").ProtocolToRiskEntity>;
}
