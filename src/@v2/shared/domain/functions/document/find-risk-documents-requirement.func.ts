import { RiskDocumentsRequirementVO } from "../../values-object/document/risk-documents-requirement.vo";
import { orderRiskDocumentsRequirements } from "./order-risk-documents-requirements.func";

type IFindRiskDocumentsRequirement = {
  companyId: string;
  requirements: RiskDocumentsRequirementVO[];
  hierarchyId?: string;
}

export const findRiskDocumentsRequirement = ({ companyId, requirements, hierarchyId }: IFindRiskDocumentsRequirement) => {
  const requirementsPriority = orderRiskDocumentsRequirements({ requirements, companyId })
  const requirement = requirementsPriority.find((requirement) => {
    if (hierarchyId && requirement.hierarchyId === hierarchyId) return true
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
