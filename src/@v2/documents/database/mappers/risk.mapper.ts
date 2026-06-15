import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';
import { RiskDocumentsRequirementVO } from '@/@v2/shared/domain/values-object/document/risk-documents-requirement.vo';
import { RiskFactors, RiskFactorsDocInfo } from '@prisma/client';
import { RiskModel } from '../../domain/models/risk.model';

export type IRiskMapper = RiskFactors & {
  docInfo: RiskFactorsDocInfo[];
  subTypes?: {
    sub_type: {
      id: number;
      name: string;
    };
  }[];
};

export class RiskMapper {
  static toModel(data: IRiskMapper): RiskModel {
    const documentRequirement = new RiskDocumentsRequirementVO({
      isAso: data.isAso,
      isPGR: data.isPGR,
      isPCMSO: data.isPCMSO,
      isPPP: data.isPPP,
      companyId: null,
      hierarchyId: null,
    });

    return new RiskModel({
      id: data.id,
      name: data.name,
      isEmergency: data.isEmergency,
      isRepresentAll: data.representAll,
      severity: data.severity,
      type: data.type as RiskTypeEnum,
      unit: data.unit,
      carnogenicityACGIH: data.carnogenicityACGIH,
      carnogenicityLinach: data.carnogenicityLinach,
      cas: data.cas,
      healthRisk: data.risk,
      ipvs: data.ipvs,
      appendix: data.appendix,
      nr15lt: data.nr15lt,
      pe: data.pe,
      propagation: data.propagation,
      pv: data.pv,
      stel: data.stel,
      acgihCeiling: data.acgihCeiling,
      nioshRel: data.nioshRel,
      nioshStel: data.nioshStel,
      nioshCeiling: data.nioshCeiling,
      oshaPel: data.oshaPel,
      oshaStel: data.oshaStel,
      oshaCeiling: data.oshaCeiling,
      aihaWeel: data.aihaWeel,
      aihaWeelCeiling: data.aihaWeelCeiling,
      symptoms: data.symptoms,
      twa: data.twa,
      otherAppendix: data.otherAppendix,
      grauInsalubridade: data.grauInsalubridade,
      requirement: { document: documentRequirement },
      documentsRequirements: data.docInfo.map((doc) => new RiskDocumentsRequirementVO(doc)),
      subTypes: data.subTypes?.map((subType) => ({
        sub_type: {
          id: subType.sub_type.id,
          name: subType.sub_type.name,
        },
      })),
    });
  }

  static toModels(data: IRiskMapper[]): RiskModel[] {
    return data.map((RiskData) => this.toModel(RiskData));
  }
}
