import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateRiskDto, UpdateRiskDto } from '../../dto/risk.dto';
import { CreateRiskService } from '../../services/risk/create-risk/create-risk.service';
import { FindAllAvailableRiskService } from '../../services/risk/find-all-available-risk/find-all-available-risk.service';
import { UpdateRiskService } from '../../services/risk/update-risk/update-risk.service';
export declare class RiskController {
    private readonly createRiskService;
    private readonly updateRiskService;
    private readonly findAllAvailableRiskService;
    constructor(createRiskService: CreateRiskService, updateRiskService: UpdateRiskService, findAllAvailableRiskService: FindAllAvailableRiskService);
    create(userPayloadDto: UserPayloadDto, createRiskDto: CreateRiskDto): Promise<import("../../entities/risk.entity").RiskFactorsEntity>;
    update(riskId: string, userPayloadDto: UserPayloadDto, updateRiskDto: UpdateRiskDto): Promise<import("../../entities/risk.entity").RiskFactorsEntity>;
    findAllAvailable(userPayloadDto: UserPayloadDto): Promise<import("../../entities/risk.entity").RiskFactorsEntity[]>;
}
