import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateProtocolDto, FindProtocolDto, UpdateProtocolDto } from '../../dto/protocol.dto';
import { CreateProtocolsService } from '../../services/protocol/create-protocol/create-protocol.service';
import { DeleteSoftProtocolsService } from '../../services/protocol/delete-protocol/delete-protocol.service';
import { FindProtocolsService } from '../../services/protocol/find-protocol/find-protocol.service';
import { UpdateProtocolsService } from '../../services/protocol/update-protocol/update-protocol.service';
import { UpdateRiskProtocolsService } from '../../services/protocol/update-risk-protocol/update-risk-protocol.service';
export declare class ProtocolController {
    private readonly updateProtocolsService;
    private readonly createProtocolsService;
    private readonly findAvailableProtocolsService;
    private readonly deleteSoftExamService;
    private readonly updateRiskProtocolsService;
    constructor(updateProtocolsService: UpdateProtocolsService, createProtocolsService: CreateProtocolsService, findAvailableProtocolsService: FindProtocolsService, deleteSoftExamService: DeleteSoftProtocolsService, updateRiskProtocolsService: UpdateRiskProtocolsService);
    find(userPayloadDto: UserPayloadDto, query: FindProtocolDto): Promise<{
        data: import("../../entities/protocol.entity").ProtocolEntity[];
        count: number;
    }>;
    create(upsertAccessGroupDto: CreateProtocolDto, userPayloadDto: UserPayloadDto): Promise<import("../../entities/protocol.entity").ProtocolEntity>;
    update(upsertAccessGroupDto: UpdateProtocolDto, userPayloadDto: UserPayloadDto, id: number): Promise<import("../../entities/protocol.entity").ProtocolEntity>;
    deleteSoft(userPayloadDto: UserPayloadDto, id: number): Promise<import("../../entities/protocol.entity").ProtocolEntity>;
}
