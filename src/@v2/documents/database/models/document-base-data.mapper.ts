import { DocumentData } from '@prisma/client';
import { DocumentBaseDataVO } from '../../domain/values-object/document-base-data.vo';

export type IDocumentBaseDataMapper = DocumentData

export class DocumentBaseDataMapper {
  static toVO(data: IDocumentBaseDataMapper): DocumentBaseDataVO {
    const documentData = data.json as unknown as DocumentBaseDataVO | null;

    return new DocumentBaseDataVO({
      isQ5: documentData?.isQ5,
      hasEmergencyPlan: documentData?.hasEmergencyPlan,
      complementarySystems: documentData?.complementarySystems,
      source: documentData?.source,
      visitDate: documentData?.visitDate,
      months_period_level_2: documentData?.months_period_level_2,
      months_period_level_3: documentData?.months_period_level_3,
      months_period_level_4: documentData?.months_period_level_4,
      months_period_level_5: documentData?.months_period_level_5,
    })
  }
}