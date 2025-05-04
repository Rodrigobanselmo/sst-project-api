import { AlignmentType } from 'docx';

import { EPIModel } from '@/@v2/documents/domain/models/epis.model';
import { borderNoneStyle } from '../../elements/body';

export const dataConverter = (epis: EPIModel[], isHideCA: boolean) => {
  return [
    {
      text: epis.map((epi) => (isHideCA ? epi.equipment : epi.name)).join(', '),
      alignment: AlignmentType.CENTER,
      borders: borderNoneStyle,
    },
  ];
};
