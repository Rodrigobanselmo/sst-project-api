import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { IDocVariables } from '../../../builders/pgr/types/documet-section-groups.types';

export const complementarySystemsConverter = (complementarySystems: string[]): IDocVariables[] => {
  return complementarySystems.map((doc) => ({
    [VariablesPGREnum.DOCUMENT_COMPLEMENTARY_DOCS]: doc || '',
  }));
};
