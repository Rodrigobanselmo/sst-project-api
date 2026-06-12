import { FormModule } from '@/@v2/forms/forms.module';
import { ActionPlanModule } from '@/@v2/security/action-plan/action-plan.module';
import { SharedModule } from '@/@v2/shared/shared.module';
import { Module, forwardRef } from '@nestjs/common';
import { BrowseWorkspaceController } from './application/workspace/browse-all-workspaces/controllers/browse-all-workspaces.controller';
import { BrowseWorkspaceUseCase } from './application/workspace/browse-all-workspaces/use-cases/browse-all-workspaces.usecase';
import { DeleteWorkspaceController } from './application/workspace/delete-workspace/controllers/delete-workspace.controller';
import { DeleteWorkspaceUseCase } from './application/workspace/delete-workspace/use-cases/delete-workspace.usecase';
import { ConvertWorkspaceToCompanyController } from './application/workspace/convert-to-company/controllers/convert-workspace-to-company.controller';
import { RepairHybridFormApplicationsController } from './application/workspace/convert-to-company/controllers/repair-hybrid-form-applications.controller';
import { PreviewConvertWorkspaceToCompanyUseCase } from './application/workspace/convert-to-company/use-cases/preview-convert-workspace-to-company.usecase';
import { ConvertWorkspaceToCompanyUseCase } from './application/workspace/convert-to-company/use-cases/convert-workspace-to-company.usecase';
import { WorkspaceConvertService } from './application/workspace/convert-to-company/services/workspace-convert.service';
import { WorkspaceOperationalDataCloneService } from './application/workspace/convert-to-company/services/workspace-operational-data-clone.service';
import { ReadVisualIdentityController } from './application/visual-identity/read-visual-identity/controllers/read-visual-identity.controller';
import { ReadVisualIdentityUseCase } from './application/visual-identity/read-visual-identity/use-cases/read-visual-identity.usecase';
import { WorkspaceDAO } from './database/dao/workspace/workspace.dao';
import { VisualIdentityDAO } from './database/dao/visual-identity/visual-identity.dao';
import { CompanyGroupHomeSummaryController } from './application/company-group/home-summary/controllers/company-group-home-summary.controller';
import { CompanyGroupHomeSummaryUseCase } from './application/company-group/home-summary/use-cases/company-group-home-summary.usecase';
import { CompanyGroupHomeSummaryDAO } from './database/dao/company-group/company-group-home-summary.dao';
import { AccessibleGroupCompaniesService } from './application/shared/services/accessible-group-companies.service';
import { CompanyGroupActionPlanSummaryService } from './application/company-group/home-summary/services/company-group-action-plan-summary.service';
import { CompanyGroupConsolidatedViewEligibilityController } from './application/company-group/consolidated-view/controllers/company-group-consolidated-view-eligibility.controller';
import { CompanyGroupConsolidatedViewSummaryController } from './application/company-group/consolidated-view/controllers/company-group-consolidated-view-summary.controller';
import { CompanyGroupConsolidatedViewParticipantsController } from './application/company-group/consolidated-view/controllers/company-group-consolidated-view-participants.controller';
import { CompanyGroupConsolidatedViewEligibilityUseCase } from './application/company-group/consolidated-view/use-cases/company-group-consolidated-view-eligibility.usecase';
import { CompanyGroupConsolidatedViewSummaryUseCase } from './application/company-group/consolidated-view/use-cases/company-group-consolidated-view-summary.usecase';
import { CompanyGroupConsolidatedViewParticipantsUseCase } from './application/company-group/consolidated-view/use-cases/company-group-consolidated-view-participants.usecase';
import { CompanyGroupConsolidatedViewEligibilityService } from './application/company-group/consolidated-view/services/company-group-consolidated-view-eligibility.service';
import { CompanyGroupConsolidatedViewMetricsService } from './application/company-group/consolidated-view/services/company-group-consolidated-view-metrics.service';
import { CompanyGroupConsolidatedViewContextService } from './application/company-group/consolidated-view/services/company-group-consolidated-view-context.service';
import { CompanyGroupConsolidatedViewParticipantsService } from './application/company-group/consolidated-view/services/company-group-consolidated-view-participants.service';
import { FormApplicationStructureFingerprintService } from './application/company-group/consolidated-view/services/form-application-structure-fingerprint.service';

@Module({
  imports: [SharedModule, ActionPlanModule, forwardRef(() => FormModule)],
  controllers: [
    BrowseWorkspaceController,
    DeleteWorkspaceController,
    ConvertWorkspaceToCompanyController,
    RepairHybridFormApplicationsController,
    ReadVisualIdentityController,
    CompanyGroupHomeSummaryController,
    CompanyGroupConsolidatedViewEligibilityController,
    CompanyGroupConsolidatedViewSummaryController,
    CompanyGroupConsolidatedViewParticipantsController,
  ],
  providers: [
    // Database
    WorkspaceDAO,
    VisualIdentityDAO,
    CompanyGroupHomeSummaryDAO,

    // Use Cases
    BrowseWorkspaceUseCase,
    DeleteWorkspaceUseCase,
    PreviewConvertWorkspaceToCompanyUseCase,
    ConvertWorkspaceToCompanyUseCase,
    WorkspaceConvertService,
    WorkspaceOperationalDataCloneService,
    ReadVisualIdentityUseCase,
    CompanyGroupHomeSummaryUseCase,
    AccessibleGroupCompaniesService,
    CompanyGroupActionPlanSummaryService,
    CompanyGroupConsolidatedViewEligibilityUseCase,
    CompanyGroupConsolidatedViewSummaryUseCase,
    CompanyGroupConsolidatedViewParticipantsUseCase,
    CompanyGroupConsolidatedViewEligibilityService,
    CompanyGroupConsolidatedViewMetricsService,
    CompanyGroupConsolidatedViewContextService,
    CompanyGroupConsolidatedViewParticipantsService,
    FormApplicationStructureFingerprintService,
  ],
  exports: [AccessibleGroupCompaniesService],
})
export class CompanyModule {}
