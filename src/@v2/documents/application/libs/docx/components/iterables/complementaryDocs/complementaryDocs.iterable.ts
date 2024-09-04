import { Paragraph, Table } from 'docx';

import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { ISectionChildrenType } from '../../../../../../domain/types/elements.types';
import { ComplementaryDocsConverter } from './complementaryDocs.converter';
import { IDocVariables } from '../../../builders/pgr/types/IDocumentPGRSectionGroups';
import { DocumentChildrenTypeEnum } from '@/@v2/documents/domain/enums/document-children-type.enum';

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
            type: DocumentChildrenTypeEnum.BULLET,
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
