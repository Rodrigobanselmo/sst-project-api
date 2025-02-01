import { Paragraph, Table } from 'docx';

import { DocumentChildrenTypeEnum as DocumentSectionChildrenTypeEnum } from '@/@v2/documents/domain/enums/document-children-type.enum';
import { DocumentPGRModel } from '@/@v2/documents/domain/models/document-pgr.model';
import { ISectionChildrenType } from '../../../../../domain/types/elements.types';
import { IDocVariables } from '../../../builders/pgr/types/documet-section-groups.types';
import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';

export const controlMeasuresEpiIterable = (data: DocumentPGRModel, variables: IDocVariables, convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[]) => {
  const iterableSections = [] as (Paragraph | Table)[];
  const isHideCA = variables[VariablesPGREnum.IS_HIDE_CA];

  data.epis.forEach((measure) => {
    if (measure.isNotAnEpi) return;

    convertToDocx([
      {
        type: DocumentSectionChildrenTypeEnum.BULLET,
        text: isHideCA ? measure.equipment : measure.name,
      },
    ]);
  });

  return iterableSections;
};
