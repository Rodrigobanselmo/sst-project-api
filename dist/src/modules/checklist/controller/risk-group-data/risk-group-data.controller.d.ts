import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { UpsertRiskGroupDataDto } from '../../dto/risk-group-data.dto';
import { FindAllByCompanyService } from '../../services/risk-group-data/find-by-company/find-by-company.service';
import { FindByIdService } from '../../services/risk-group-data/find-by-id/find-by-id.service';
import { FindDocumentsService } from '../../services/risk-group-data/find-documents/find-documents.service';
import { UpsertRiskGroupDataService } from '../../services/risk-group-data/upsert-risk-group-data/upsert-risk-group-data.service';
export declare class RiskGroupDataController {
    private readonly upsertRiskGroupDataService;
    private readonly findAllByCompanyService;
    private readonly findByIdService;
    private readonly findDocumentsService;
    constructor(upsertRiskGroupDataService: UpsertRiskGroupDataService, findAllByCompanyService: FindAllByCompanyService, findByIdService: FindByIdService, findDocumentsService: FindDocumentsService);
    upsert(upsertRiskGroupDataDto: UpsertRiskGroupDataDto): Promise<import("../../entities/riskGroupData.entity").RiskFactorGroupDataEntity>;
    findAllAvailable(userPayloadDto: UserPayloadDto): Promise<import("../../entities/riskGroupData.entity").RiskFactorGroupDataEntity[]>;
    findById(id: string, userPayloadDto: UserPayloadDto): Promise<import("../../entities/riskGroupData.entity").RiskFactorGroupDataEntity>;
    findDocuments(riskGroupId: string, userPayloadDto: UserPayloadDto): Promise<import("../../entities/riskDocument.entity").RiskDocumentEntity[]>;
}
