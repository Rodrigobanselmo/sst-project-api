import { IDocumentsRequirementKeys } from "../../types/document/document-types.type";
import { RiskDocumentsRequirementVO } from "../document/risk-documents-requirement.vo";

namespace GetRiskDocumentsRequirements {
  export type Params = { requirements: RiskDocumentsRequirementVO[]; companyId: string; };
  export type GetPriorityOrderParams = { requirements: RiskDocumentsRequirementVO[]; companyId: string; };
  export type GetRequirementParams = { hierarchyId?: string; };
  export type CheckExistsOnCompanyParams = { documentType: IDocumentsRequirementKeys; };
}


class GetRiskDocumentsRequirements {
  #companyId: string;
  #requirements: RiskDocumentsRequirementVO[];

  constructor(params: GetRiskDocumentsRequirements.Params) {
    this.#requirements = params.requirements;
    this.#companyId = params.companyId;
  }

  private get requirements() {
    const requirementsHierarchy = [] as RiskDocumentsRequirementVO[]
    const requirementsCompany = [] as RiskDocumentsRequirementVO[]
    const requirementsConsultant = [] as RiskDocumentsRequirementVO[]
    const requirementsRisk = [] as RiskDocumentsRequirementVO[]

    this.#requirements.forEach((requirement) => {
      const isRequirementFromHierarchy = requirement.hierarchyId && requirement.companyId == this.#companyId;
      if (isRequirementFromHierarchy) {
        requirementsHierarchy.push(requirement)
        return;
      }

      const isRequirementFromCompany = !requirement.hierarchyId && requirement.companyId == this.#companyId;
      if (isRequirementFromCompany) {
        requirementsCompany.push(requirement)
        return;
      }

      const isRequirementFromConsultant = !requirement.hierarchyId && requirement.companyId != this.#companyId;
      if (isRequirementFromConsultant) {
        requirementsConsultant.push(requirement)
        return;
      }

      const isRequirementFromRisk = !requirement.hierarchyId && !requirement.companyId;
      if (isRequirementFromRisk) {
        requirementsRisk.push(requirement)
        return;
      }
    });

    const requirementsPriority = [...requirementsHierarchy, ...requirementsCompany, ...requirementsConsultant, ...requirementsRisk]
    return requirementsPriority
  };

  getPriorityRequirement = (props?: GetRiskDocumentsRequirements.GetRequirementParams): RiskDocumentsRequirementVO => {
    const requirement = this.requirements.find((requirement) => {
      if (props?.hierarchyId && requirement.hierarchyId === props?.hierarchyId) return true
      if (!requirement.hierarchyId) return true
      return false
    })

    if (!requirement) {
      return new RiskDocumentsRequirementVO({
        isAso: false,
        isPGR: false,
        isPCMSO: false,
        isPPP: false,
        companyId: null,
        hierarchyId: null,
      });
    }

    return requirement
  }

  checkIfExistAny = ({ documentType }: GetRiskDocumentsRequirements.CheckExistsOnCompanyParams) => {
    const requirement = this.requirements.find((requirement) => {
      if (requirement[documentType]) return true
      if (!requirement.hierarchyId) return true
      return false
    })

    if (!requirement) return false

    return requirement[documentType]
  }
}

export const getRiskDocumentsRequirements = ({ requirements, companyId }: GetRiskDocumentsRequirements.GetPriorityOrderParams) => {
  return new GetRiskDocumentsRequirements({ requirements, companyId })
}
