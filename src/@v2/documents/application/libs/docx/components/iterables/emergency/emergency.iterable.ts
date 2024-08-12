import { Paragraph, Table } from 'docx';

import { ISectionChildrenType, DocumentSectionChildrenTypeEnum } from '../../../builders/pgr/types/elements.types';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { RiskFactorDataEntity } from '../../../../../sst/entities/riskData.entity';
import { emergencyConverter } from './emergency.converter';
import { removeDuplicate } from '../../../../../../shared/utils/removeDuplicate';

export const emergencyIterable = (
  riskData: Partial<RiskFactorDataEntity>[],
  convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[],
) => {
  const emergencyVarArray = emergencyConverter(riskData);

  const iterableSections = removeDuplicate(emergencyVarArray, {
    simpleCompare: true,
  })
    .map((risk) => {
      if (!risk) return;

      return convertToDocx([
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: risk,
          size: 10,
        },
      ]);
    })
    .filter((i) => i)
    .reduce((acc, curr) => {
      return [...acc, ...curr];
    }, []);

  return iterableSections;
};
