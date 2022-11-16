import { Paragraph, Table } from 'docx';

import { ISectionChildrenType, PGRSectionChildrenTypeEnum } from '../../../builders/pgr/types/elements.types';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { RiskFactorDataEntity } from '../../../../../sst/entities/riskData.entity';
import { recommendationsConverter } from './recommendations.converter';

export const recommendationsIterable = (
  riskData: Partial<RiskFactorDataEntity>[],
  convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[],
) => {
  const recommendationsVarArray = recommendationsConverter(riskData);

  const iterableSections = recommendationsVarArray
    .map(({ data, title }) => {
      if (data.length == 0) return;

      return convertToDocx([
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: title,
        },
        ...data.map(
          (rec): ISectionChildrenType => ({
            type: PGRSectionChildrenTypeEnum.BULLET,
            text: rec,
            size: 8,
          }),
        ),
      ]);
    })
    .filter((i) => i)
    .reduce((acc, curr) => {
      return [...acc, ...curr];
    }, []);

  return iterableSections;
};
