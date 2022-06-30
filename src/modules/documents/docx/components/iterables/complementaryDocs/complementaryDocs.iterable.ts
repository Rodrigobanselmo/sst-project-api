import { Paragraph, Table } from 'docx';

import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import {
  ISectionChildrenType,
  PGRSectionChildrenTypeEnum,
} from '../../../builders/pgr/types/elements.types';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { ComplementaryDocsConverter } from './complementaryDocs.converter';

export const complementaryDocsIterable = (
  complementaryDocs: string[],
  convertToDocx: (
    data: ISectionChildrenType[],
    variables?: IDocVariables,
  ) => (Paragraph | Table)[],
) => {
  if (!complementaryDocs?.length)
    return convertToDocx([
      {
        type: PGRSectionChildrenTypeEnum.PARAGRAPH,
        text: `Não há documentos complementares na elaboração do PGR.`,
      },
    ]);

  const complementaryDocsVarArray =
    ComplementaryDocsConverter(complementaryDocs);

  const iterableSections = complementaryDocsVarArray
    .map((variables) => {
      return convertToDocx(
        [
          {
            type: PGRSectionChildrenTypeEnum.BULLET,
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