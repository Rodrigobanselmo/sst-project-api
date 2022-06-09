import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateRiskDto, UpdateRiskDto } from '../../dto/risk.dto';
import { CreateRiskService } from '../../services/risk/create-risk/create-risk.service';
import { DeleteSoftRiskService } from '../../services/risk/delete-soft-risk/delete-soft-risk.service';
import { FindAllAvailableRiskService } from '../../services/risk/find-all-available-risk/find-all-available-risk.service';
import { UpdateRiskService } from '../../services/risk/update-risk/update-risk.service';
export declare class RiskController {
    private readonly createRiskService;
    private readonly updateRiskService;
    private readonly findAllAvailableRiskService;
    private readonly deleteSoftRiskService;
    constructor(createRiskService: CreateRiskService, updateRiskService: UpdateRiskService, findAllAvailableRiskService: FindAllAvailableRiskService, deleteSoftRiskService: DeleteSoftRiskService);
    create(userPayloadDto: UserPayloadDto, createRiskDto: CreateRiskDto): Promise<import("../../entities/risk.entity").RiskFactorsEntity>;
    update(riskId: string, userPayloadDto: UserPayloadDto, updateRiskDto: UpdateRiskDto): Promise<import("../../entities/risk.entity").RiskFactorsEntity>;
    findAllAvailable(userPayloadDto: UserPayloadDto): Promise<import("../../entities/risk.entity").RiskFactorsEntity[]>;
    deleteSoft(riskId: string, userPayloadDto: UserPayloadDto): Promise<import("../../entities/risk.entity").RiskFactorsEntity>;
}
