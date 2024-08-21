import { Paragraph, Table } from 'docx';

import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { ISectionChildrenType } from '../../../../../../domain/types/elements.types';
import { DocumentSectionChildrenTypeEnum } from '@/@v2/documents/domain/types/DocumentSectionChildrenTypeEnum';
import { IDocVariables } from '../../../../../../domain/types/section.types';
import { ComplementaryDocsConverter } from './complementaryDocs.converter';

export const complementaryDocsIterable = (
  complementaryDocs: string[],
  convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[],
) => {
  if (!complementaryDocs?.length) return [];

  const complementaryDocsVarArray = ComplementaryDocsConverter(complementaryDocs);

  const iterableSections = complementaryDocsVarArray
    .map((variables) => {
      return convertToDocx(
        [
          {
            type: DocumentSectionChildrenTypeEnum.BULLET,
            text: `**??${VariablesPGREnum.DOCUMENT_COMPLEMENTARY_DOCS}??**`,
            level: 0,
          },
        ],
        variables,
      );
    })
    .reduce((acc, curr) => {
      return [...acc, ...curr];
    }, []);

  return iterableSections;
};
