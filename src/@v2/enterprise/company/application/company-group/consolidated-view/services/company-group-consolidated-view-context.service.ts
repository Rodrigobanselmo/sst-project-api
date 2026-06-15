import { BadRequestException, Injectable } from '@nestjs/common';

import { ConsolidatedViewExclusionReasonEnum } from '@/@v2/enterprise/company/application/company-group/consolidated-view/constants/consolidated-view-exclusion-reason.enum';
import {
  CompanyGroupConsolidatedViewEligibilityService,
  ConsolidatedViewEligibleApplication,
  ConsolidatedViewEligibleSet,
} from '@/@v2/enterprise/company/application/company-group/consolidated-view/services/company-group-consolidated-view-eligibility.service';
import { AccessibleGroupCompaniesService } from '@/@v2/enterprise/company/application/shared/services/accessible-group-companies.service';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

export type ConsolidatedViewResolvedContext = {
  companyGroupId: number;
  companyGroupName: string;
  matchingSet: ConsolidatedViewEligibleSet;
  applications: ConsolidatedViewEligibleApplication[];
};

@Injectable()
export class CompanyGroupConsolidatedViewContextService {
  constructor(
    private readonly accessibleGroupCompaniesService: AccessibleGroupCompaniesService,
    private readonly eligibilityService: CompanyGroupConsolidatedViewEligibilityService,
  ) {}

  async resolve(params: {
    companyGroupId: number;
    applicationIds?: string[];
    user: UserPayloadDto;
  }): Promise<ConsolidatedViewResolvedContext> {
    const { companyGroupId, companyGroupName, includedCompanyIds } =
      await this.accessibleGroupCompaniesService.resolveAccessibleGroupMembers({
        companyGroupId: params.companyGroupId,
        user: params.user,
      });

    const evaluation = await this.eligibilityService.evaluate({
      companyGroupId,
      accessibleCompanyIds: includedCompanyIds,
      applicationIds: params.applicationIds,
    });

    const requestedApplicationIds = params.applicationIds?.length
      ? [...new Set(params.applicationIds)]
      : this.pickDefaultApplicationIds(evaluation.eligibleSets);

    if (requestedApplicationIds.length < 2) {
      throw new BadRequestException(
        'É necessário informar ao menos duas aplicações elegíveis para a visão consolidada.',
      );
    }

    const matchingSet = evaluation.eligibleSets.find((set) => {
      const eligibleIds = new Set(
        set.applications.map((application) => application.applicationId),
      );

      return requestedApplicationIds.every((applicationId) =>
        eligibleIds.has(applicationId),
      );
    });

    if (!matchingSet) {
      const exclusion = evaluation.excludedApplications.find((item) =>
        requestedApplicationIds.includes(item.applicationId),
      );

      throw new BadRequestException(
        this.getErrorMessage(exclusion?.reason),
      );
    }

    const applications = matchingSet.applications.filter((application) =>
      requestedApplicationIds.includes(application.applicationId),
    );

    if (applications.length < 2) {
      throw new BadRequestException(
        'As aplicações informadas não formam um conjunto elegível para consolidação.',
      );
    }

    return {
      companyGroupId,
      companyGroupName,
      matchingSet,
      applications,
    };
  }

  private pickDefaultApplicationIds(eligibleSets: ConsolidatedViewEligibleSet[]) {
    const largestSet = [...eligibleSets].sort(
      (left, right) => right.applications.length - left.applications.length,
    )[0];

    return (
      largestSet?.applications.map((application) => application.applicationId) ||
      []
    );
  }

  private getErrorMessage(reason?: ConsolidatedViewExclusionReasonEnum) {
    switch (reason) {
      case ConsolidatedViewExclusionReasonEnum.NO_ACCESS:
        return 'Uma ou mais aplicações não estão acessíveis para o usuário.';
      case ConsolidatedViewExclusionReasonEnum.NOT_DONE:
        return 'A consolidação exige aplicações concluídas.';
      case ConsolidatedViewExclusionReasonEnum.DIFFERENT_FORM:
        return 'As aplicações informadas não compartilham o mesmo formulário base.';
      case ConsolidatedViewExclusionReasonEnum.INCOMPATIBLE_STRUCTURE:
        return 'As aplicações informadas possuem estruturas incompatíveis.';
      case ConsolidatedViewExclusionReasonEnum.NOT_SAME_GROUP:
        return 'As aplicações informadas não pertencem ao mesmo grupo empresarial.';
      default:
        return 'As aplicações informadas não formam um conjunto elegível para consolidação.';
    }
  }
}
