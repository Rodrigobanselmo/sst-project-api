import { Paragraph, Table } from 'docx';

import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { ISectionChildrenType } from '../../../../../../domain/types/elements.types';
import { DocumentSectionChildrenTypeEnum } from '@/@v2/documents/domain/types/DocumentSectionChildrenTypeEnum';
import { IDocVariables } from '../../../../../../domain/types/section.types';
import { BulletTextConverter } from './bullets.converter';

export const bulletTextIterable = (
  bulletText: string[],
  convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[],
) => {
  const bulletTextVarArray = BulletTextConverter(bulletText);

  const iterableSections = bulletTextVarArray
    .map((variables) => {
      return convertToDocx(
        [
          {
            type: DocumentSectionChildrenTypeEnum.BULLET,
            text: `??${VariablesPGREnum.BULLET_TEXT}??`,
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
