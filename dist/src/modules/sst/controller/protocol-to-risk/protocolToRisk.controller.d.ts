import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CopyProtocolToRiskDto, CreateProtocolToRiskDto, FindProtocolToRiskDto, UpdateProtocolToRiskDto } from '../../dto/protocol-to-risk.dto';
import { CopyProtocolToRiskService } from '../../services/protocolToRisk/copy-protocol/copy-protocol.service';
import { CreateProtocolToRiskService } from '../../services/protocolToRisk/create-protocol/create-protocol.service';
import { FindProtocolToRiskService } from '../../services/protocolToRisk/find-protocol/find-protocol.service';
import { UpdateProtocolToRiskService } from '../../services/protocolToRisk/update-protocol/update-protocol.service';
export declare class ProtocolToRiskController {
    private readonly createProtocolToService;
    private readonly findProtocolToService;
    private readonly updateProtocolToService;
    private readonly copyProtocolToRiskService;
    constructor(createProtocolToService: CreateProtocolToRiskService, findProtocolToService: FindProtocolToRiskService, updateProtocolToService: UpdateProtocolToRiskService, copyProtocolToRiskService: CopyProtocolToRiskService);
    create(userPayloadDto: UserPayloadDto, createProtocolToDto: CreateProtocolToRiskDto): Promise<import("../../entities/protocol.entity").ProtocolToRiskEntity>;
    copy(userPayloadDto: UserPayloadDto, createProtocolToDto: CopyProtocolToRiskDto): Promise<void>;
    update(id: number, userPayloadDto: UserPayloadDto, updateRiskDto: UpdateProtocolToRiskDto): Promise<import("../../entities/protocol.entity").ProtocolToRiskEntity>;
    findAllAvailable(userPayloadDto: UserPayloadDto, query: FindProtocolToRiskDto): Promise<{
        data: import("../../entities/protocol.entity").ProtocolToRiskEntity[];
        count: number;
    }>;
}
