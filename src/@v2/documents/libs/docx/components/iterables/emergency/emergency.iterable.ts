import { Paragraph, Table } from 'docx';

import { DocumentChildrenTypeEnum as DocumentSectionChildrenTypeEnum } from '@/@v2/documents/domain/enums/document-children-type.enum';
import { ISectionChildrenType } from '../../../../../domain/types/elements.types';
import { IDocVariables } from '../../../builders/pgr/types/documet-section-groups.types';
import { IRiskGroupDataConverter } from '../../../converter/hierarchy.converter';
import { emergencyConverter } from './emergency.converter';
import { removeDuplicate } from '@/@v2/shared/utils/helpers/remove-duplicate';

export const emergencyIterable = (riskData: IRiskGroupDataConverter[], convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[]) => {
  const emergencyVarArray = emergencyConverter(riskData);

  const iterableSections = removeDuplicate(emergencyVarArray)
    .map((risk) => {
      if (!risk) return;

      return convertToDocx([
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: risk,
          size: 10,
        },
      ]);
    })
    .filter((i) => i)
    .reduce((acc, curr) => {
      return [...(acc || []), ...(curr || [])];
    }, []);

  if (iterableSections) return iterableSections;
  return [];
};
