"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChecklistModule = void 0;
const generate_source_controller_1 = require("./controller/generate-source/generate-source.controller");
const common_1 = require("@nestjs/common");
const risk_controller_1 = require("./controller/risk/risk.controller");
const RiskRepository_1 = require("./repositories/implementations/RiskRepository");
const create_risk_service_1 = require("./services/risk/create-risk/create-risk.service");
const create_rec_med_service_1 = require("./services/rec-med/create-rec-med/create-rec-med.service");
const create_checklist_service_1 = require("./services/checklist/create-checklist/create-checklist.service");
const rec_med_controller_1 = require("./controller/rec-med/rec-med.controller");
const checklist_controller_1 = require("./controller/checklist/checklist.controller");
const RecMedRepository_1 = require("./repositories/implementations/RecMedRepository");
const ChecklistRepository_1 = require("./repositories/implementations/ChecklistRepository");
const find_available_checklist_service_1 = require("./services/checklist/find-available-checklist/find-available-checklist.service");
const find_checklist_data_service_1 = require("./services/checklist/find-checklist-data/find-checklist-data.service");
const update_checklist_service_1 = require("./services/checklist/update-checklist/update-checklist.service");
const find_all_available_risk_service_1 = require("./services/risk/find-all-available-risk/find-all-available-risk.service");
const update_risk_service_1 = require("./services/risk/update-risk/update-risk.service");
const update_rec_med_service_1 = require("./services/rec-med/update-rec-med/update-rec-med.service");
const GenerateSourceRepository_1 = require("./repositories/implementations/GenerateSourceRepository");
const create_generate_source_service_1 = require("./services/generate-source/create-generate-source/create-generate-source.service");
const update_generate_source_service_1 = require("./services/generate-source/update-generate-source/update-generate-source.service");
const epi_controller_1 = require("./controller/epi/epi.controller");
const create_epi_service_1 = require("./services/epi/create-epi/create-epi.service");
const update_epi_service_1 = require("./services/epi/update-epi/update-epi.service");
const EpiRepository_1 = require("./repositories/implementations/EpiRepository");
const find_ca_epi_service_1 = require("./services/epi/find-ca-epi /find-ca-epi.service");
const find_epi_service_1 = require("./services/epi/find-epi/find-epi.service");
const risk_group_data_controller_1 = require("./controller/risk-group-data/risk-group-data.controller");
const risk_data_controller_1 = require("./controller/risk-data/risk-data.controller");
const RiskGroupDataRepository_1 = require("./repositories/implementations/RiskGroupDataRepository");
const RiskDataRepository_1 = require("./repositories/implementations/RiskDataRepository");
const upsert_risk_group_data_service_1 = require("./services/risk-group-data/upsert-risk-group-data/upsert-risk-group-data.service");
const find_by_company_service_1 = require("./services/risk-group-data/find-by-company/find-by-company.service");
const upsert_risk_service_1 = require("./services/risk-data/upsert-risk-data/upsert-risk.service");
const find_by_group_risk_service_1 = require("./services/risk-data/find-by-group-risk/find-by-group-risk.service");
const find_by_id_service_1 = require("./services/risk-group-data/find-by-id/find-by-id.service");
const RiskDocumentRepository_1 = require("./repositories/implementations/RiskDocumentRepository");
const find_documents_service_1 = require("./services/risk-group-data/find-documents/find-documents.service");
let ChecklistModule = class ChecklistModule {
};
ChecklistModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            risk_controller_1.RiskController,
            rec_med_controller_1.RecMedController,
            checklist_controller_1.ChecklistController,
            epi_controller_1.EpiController,
            generate_source_controller_1.GenerateSourceController,
            risk_group_data_controller_1.RiskGroupDataController,
            risk_data_controller_1.RiskDataController,
        ],
        providers: [
            create_checklist_service_1.CreateChecklistService,
            RiskRepository_1.RiskRepository,
            create_risk_service_1.CreateRiskService,
            update_risk_service_1.UpdateRiskService,
            RecMedRepository_1.RecMedRepository,
            EpiRepository_1.EpiRepository,
            create_rec_med_service_1.CreateRecMedService,
            update_rec_med_service_1.UpdateRecMedService,
            create_epi_service_1.CreateEpiService,
            update_epi_service_1.UpdateEpiService,
            GenerateSourceRepository_1.GenerateSourceRepository,
            create_generate_source_service_1.CreateGenerateSourceService,
            update_generate_source_service_1.UpdateGenerateSourceService,
            ChecklistRepository_1.ChecklistRepository,
            find_available_checklist_service_1.FindAvailableChecklistService,
            find_checklist_data_service_1.FindChecklistDataService,
            update_checklist_service_1.UpdateChecklistService,
            find_all_available_risk_service_1.FindAllAvailableRiskService,
            find_ca_epi_service_1.FindByCAEpiService,
            find_documents_service_1.FindDocumentsService,
            find_epi_service_1.FindEpiService,
            find_by_group_risk_service_1.FindAllByGroupAndRiskService,
            upsert_risk_service_1.UpsertRiskDataService,
            find_by_company_service_1.FindAllByCompanyService,
            upsert_risk_group_data_service_1.UpsertRiskGroupDataService,
            RiskDataRepository_1.RiskDataRepository,
            RiskGroupDataRepository_1.RiskGroupDataRepository,
            RiskDocumentRepository_1.RiskDocumentRepository,
            find_by_id_service_1.FindByIdService,
        ],
        exports: [RiskRepository_1.RiskRepository, RiskGroupDataRepository_1.RiskGroupDataRepository, RiskDocumentRepository_1.RiskDocumentRepository],
    })
], ChecklistModule);
exports.ChecklistModule = ChecklistModule;
//# sourceMappingURL=checklist.module.js.map