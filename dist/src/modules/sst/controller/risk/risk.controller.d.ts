import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateRiskDto, FindRiskDto, UpdateRiskDto } from '../../dto/risk.dto';
import { CreateRiskService } from '../../services/risk/create-risk/create-risk.service';
import { DeleteSoftRiskService } from '../../services/risk/delete-soft-risk/delete-soft-risk.service';
import { FindAllAvailableRiskService } from '../../services/risk/find-all-available-risk/find-all-available-risk.service';
import { UpdateRiskService } from '../../services/risk/update-risk/update-risk.service';
import { FindRisksByCompanyService } from '../../services/risk/find-by-company/find-by-company.service';
import { FindRiskService } from '../../services/risk/find/find.service';
export declare class RiskController {
    private readonly createRiskService;
    private readonly updateRiskService;
    private readonly findAllAvailableRiskService;
    private readonly findRisksByCompanyService;
    private readonly findRiskService;
    private readonly deleteSoftRiskService;
    constructor(createRiskService: CreateRiskService, updateRiskService: UpdateRiskService, findAllAvailableRiskService: FindAllAvailableRiskService, findRisksByCompanyService: FindRisksByCompanyService, findRiskService: FindRiskService, deleteSoftRiskService: DeleteSoftRiskService);
    create(userPayloadDto: UserPayloadDto, createRiskDto: CreateRiskDto): Promise<import("../../entities/risk.entity").RiskFactorsEntity>;
    update(riskId: string, userPayloadDto: UserPayloadDto, updateRiskDto: UpdateRiskDto): Promise<import("../../entities/risk.entity").RiskFactorsEntity>;
    findByCompany(userPayloadDto: UserPayloadDto, query: FindRiskDto): Promise<{
        data: import("../../entities/risk.entity").RiskFactorsEntity[];
        count: number;
    }>;
    findAllAvailable(userPayloadDto: UserPayloadDto): Promise<import("../../entities/risk.entity").RiskFactorsEntity[]>;
    find(userPayloadDto: UserPayloadDto, query: FindRiskDto): Promise<{
        data: import("../../entities/risk.entity").RiskFactorsEntity[];
        count: number;
    }>;
    deleteSoft(riskId: string, userPayloadDto: UserPayloadDto): Promise<import("../../entities/risk.entity").RiskFactorsEntity>;
}
