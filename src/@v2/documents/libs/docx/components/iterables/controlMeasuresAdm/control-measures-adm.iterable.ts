import { Paragraph, Table } from 'docx';

import { DocumentChildrenTypeEnum as DocumentSectionChildrenTypeEnum } from '@/@v2/documents/domain/enums/document-children-type.enum';
import { DocumentPGRModel } from '@/@v2/documents/domain/models/document-pgr.model';
import { ISectionChildrenType } from '../../../../../domain/types/elements.types';
import { IDocVariables } from '../../../builders/pgr/types/documet-section-groups.types';

export const controlMeasuresAdmIterable = (data: DocumentPGRModel, convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[]) => {
  const iterableSections = [] as (Paragraph | Table)[];

  data.administrativeMeasures.forEach((measure) => {
    if (measure.isNotAnMeasure) return;

    iterableSections.push(
      ...convertToDocx([
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: measure.name,
        },
      ]),
    );
  });

  return iterableSections;
};
