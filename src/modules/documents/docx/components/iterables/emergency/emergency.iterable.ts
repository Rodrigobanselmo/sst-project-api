import { Paragraph, Table } from 'docx';

import {
  ISectionChildrenType,
  PGRSectionChildrenTypeEnum,
} from '../../../builders/pgr/types/elements.types';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { RiskFactorDataEntity } from '../../../../../checklist/entities/riskData.entity';
import { emergencyConverter } from './emergency.converter';
import { removeDuplicate } from 'src/shared/utils/removeDuplicate';

export const emergencyIterable = (
  riskData: Partial<RiskFactorDataEntity>[],
  convertToDocx: (
    data: ISectionChildrenType[],
    variables?: IDocVariables,
  ) => (Paragraph | Table)[],
) => {
  const emergencyVarArray = emergencyConverter(riskData);

  const iterableSections = removeDuplicate(emergencyVarArray, {
    simpleCompare: true,
  })
    .map((risk) => {
      if (!risk) return;

      return convertToDocx([
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: risk,
          size: 8,
        },
      ]);
    })
    .filter((i) => i)
    .reduce((acc, curr) => {
      return [...acc, ...curr];
    }, []);

  return iterableSections;
};
