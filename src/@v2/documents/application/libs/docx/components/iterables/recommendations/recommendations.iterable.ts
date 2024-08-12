import { Paragraph, Table } from 'docx';

import { ISectionChildrenType, DocumentSectionChildrenTypeEnum } from '../../../builders/pgr/types/elements.types';
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
          type: DocumentSectionChildrenTypeEnum.H2,
          text: title,
        },
        ...data.map(
          (rec): ISectionChildrenType => ({
            type: DocumentSectionChildrenTypeEnum.BULLET,
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
