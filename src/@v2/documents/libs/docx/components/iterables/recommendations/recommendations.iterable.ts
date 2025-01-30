import { Paragraph, Table } from 'docx';

import { DocumentChildrenTypeEnum as DocumentSectionChildrenTypeEnum } from '@/@v2/documents/domain/enums/document-children-type.enum';
import { ISectionChildrenType } from '../../../../../domain/types/elements.types';
import { IDocVariables } from '../../../builders/pgr/types/documet-section-groups.types';
import { IRiskGroupDataConverter } from '../../../converter/hierarchy.converter';
import { recommendationsConverter } from './recommendations.converter';

export const recommendationsIterable = (riskData: IRiskGroupDataConverter[], convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[]) => {
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
    .reduce(
      (acc, curr) => {
        return [...(acc || []), ...(curr || [])];
      },
      [] as (Paragraph | Table)[],
    );

  if (iterableSections) return iterableSections;
  return [];
};
