import { RiskDocumentsRequirementVO } from "../document/risk-documents-requirement.vo";

namespace RiskDocumentsRequirementsVO {
  export type Params = { requirements: RiskDocumentsRequirementVO[]; companyId: string; };
  export type GetPriorityOrderParams = { requirements: RiskDocumentsRequirementVO[]; companyId: string; };
  export type GetRequirementParams = { hierarchyId?: string; };
}


export class RiskDocumentsRequirementsVO {
  #companyId: string;
  #requirements: RiskDocumentsRequirementVO[];

  constructor(params: RiskDocumentsRequirementsVO.Params) {
    this.#requirements = params.requirements;
    this.#companyId = params.companyId;
  }

  get requirements() {
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

  getRequirement = ({ hierarchyId }: RiskDocumentsRequirementsVO.GetRequirementParams): RiskDocumentsRequirementVO => {
    const requirement = this.requirements.find((requirement) => requirement.hierarchyId === hierarchyId || !requirement.hierarchyId)

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

  static factory = ({ requirements, companyId }: RiskDocumentsRequirementsVO.GetPriorityOrderParams): RiskDocumentsRequirementVO => {
    return new RiskDocumentsRequirementsVO({ requirements, companyId }).getRequirement({})
  }

}




