import { IRiskDocumentsRequirementVO } from "../../values-object/document/risk-documents-requirement.vo";

export type IDocumentsRequirementKeys = keyof Pick<IRiskDocumentsRequirementVO, 'isAso' | 'isPCMSO' | 'isPGR' | 'isPPP'>