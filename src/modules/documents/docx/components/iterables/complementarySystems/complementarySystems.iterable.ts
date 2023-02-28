import { Paragraph, Table } from 'docx';

import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { ISectionChildrenType, DocumentSectionChildrenTypeEnum } from '../../../builders/pgr/types/elements.types';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { complementarySystemsConverter } from './complementarySystems.converter';

export const complementarySystemsIterable = (
  complementarySystems: string[],
  convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[],
) => {
  if (!complementarySystems?.length)
    return convertToDocx([
      {
        type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
        text: `Não há um sistema de gestão “normatizado” implantado na unidade.`,
      },
    ]);

  const complementarySystemsVarArray = complementarySystemsConverter(complementarySystems);

  const iterableSections = complementarySystemsVarArray
    .map((variables) => {
      return convertToDocx(
        [
          {
            type: DocumentSectionChildrenTypeEnum.BULLET,
            text: `**??${VariablesPGREnum.DOCUMENT_COMPLEMENTARY_SYSTEMS}??**`,
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
