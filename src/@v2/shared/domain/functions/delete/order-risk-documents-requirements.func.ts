import { RiskDocumentsRequirementVO } from "../../values-object/document/risk-documents-requirement.vo";

type IOrderRiskDocumentsRequirements = {
  requirements: RiskDocumentsRequirementVO[];
  companyId: string;
}

export const orderRiskDocumentsRequirements = ({ requirements, companyId }: IOrderRiskDocumentsRequirements) => {
  const requirementsHierarchy = [] as RiskDocumentsRequirementVO[]
  const requirementsCompany = [] as RiskDocumentsRequirementVO[]
  const requirementsConsultant = [] as RiskDocumentsRequirementVO[]
  const requirementsRisk = [] as RiskDocumentsRequirementVO[]

  requirements.forEach((requirement) => {
    const isRequirementFromHierarchy = requirement.hierarchyId && requirement.companyId == companyId;
    if (isRequirementFromHierarchy) {
      requirementsHierarchy.push(requirement)
      return;
    }

    const isRequirementFromCompany = !requirement.hierarchyId && requirement.companyId == companyId;
    if (isRequirementFromCompany) {
      requirementsCompany.push(requirement)
      return;
    }

    const isRequirementFromConsultant = !requirement.hierarchyId && requirement.companyId != companyId;
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
}
