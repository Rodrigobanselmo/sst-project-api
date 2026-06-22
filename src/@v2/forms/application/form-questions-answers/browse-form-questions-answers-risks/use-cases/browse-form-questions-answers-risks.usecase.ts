import { Injectable } from '@nestjs/common';
import { FormApplicationRiskInventoryStatusService } from '@/@v2/forms/application/shared/services/form-application-risk-inventory-status.service';
import { FormQuestionsAnswersRisksService } from '../../shared/services/form-questions-answers-risks.service';
import { IBrowseFormQuestionsAnswersRisksUseCase } from './browse-form-questions-answers-risks.types';

@Injectable()
export class BrowseFormQuestionsAnswersRisksUseCase {
  constructor(
    private readonly formQuestionsAnswersRisksService: FormQuestionsAnswersRisksService,
    private readonly formApplicationRiskInventoryStatusService: FormApplicationRiskInventoryStatusService,
  ) {}

  async execute(params: IBrowseFormQuestionsAnswersRisksUseCase.Params): Promise<IBrowseFormQuestionsAnswersRisksUseCase.Result> {
    const result = await this.formQuestionsAnswersRisksService.getFormQuestionsAnswersRisks({
      companyId: params.companyId,
      formApplicationId: params.formApplicationId,
    });

    const inventoryStatusByKey =
      await this.formApplicationRiskInventoryStatusService.buildInventoryStatusByKey({
        formApplicationId: params.formApplicationId,
        accessCompanyId: params.companyId,
        entityRiskMap: result.entityRiskMap,
      });

    return {
      entityRiskMap: result.entityRiskMap,
      riskMap: result.riskMap,
      entityMap: result.entityMap,
      eligibleEntityMap: result.eligibleEntityMap,
      groupedEntityRiskMap: result.groupedEntityRiskMap,
      groupedEntityMap: result.groupedEntityMap,
      hierarchyGroups: result.hierarchyGroups,
      entityEstablishmentMap: result.entityEstablishmentMap,
      inventoryStatusByKey,
    };
  }
}
