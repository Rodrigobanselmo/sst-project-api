import { DocumentData, HierarchyEnum } from '@prisma/client';
import { DocumentBaseDataVO } from '../../domain/values-object/document-base-data.vo';
import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';

export type IDocumentBaseDataMapper = DocumentData;
export type IDocumentBaseDataJson = {
  isQ5?: boolean;
  isHideOriginColumn?: boolean;
  aprTypeSeparation?: HierarchyEnum;
  isHideCA?: boolean;
  hasEmergencyPlan?: boolean;
  source?: string;
  visitDate?: Date;
  complementaryDocs?: string[];
  complementarySystems?: string[];
  months_period_level_2?: number;
  months_period_level_3?: number;
  months_period_level_4?: number;
  months_period_level_5?: number;
};

export class DocumentBaseDataMapper {
  static toVO(data: IDocumentBaseDataMapper): DocumentBaseDataVO {
    const documentData = data.json as unknown as IDocumentBaseDataJson | null;

    return new DocumentBaseDataVO({
      isQ5: documentData?.isQ5,
      aprTypeSeparation: documentData?.aprTypeSeparation ? HierarchyTypeEnum[documentData.aprTypeSeparation] : undefined,
      isHideOriginColumn: documentData?.isHideOriginColumn,
      isHideCA: documentData?.isHideCA,
      hasEmergencyPlan: documentData?.hasEmergencyPlan,
      complementarySystems: documentData?.complementarySystems,
      source: documentData?.source,
      visitDate: documentData?.visitDate,
      monthsPeriodLevel_2: documentData?.months_period_level_2,
      monthsPeriodLevel_3: documentData?.months_period_level_3,
      monthsPeriodLevel_4: documentData?.months_period_level_4,
      monthsPeriodLevel_5: documentData?.months_period_level_5,
    });
  }
}
