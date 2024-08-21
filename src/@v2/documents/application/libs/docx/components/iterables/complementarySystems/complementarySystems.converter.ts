import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { IDocVariables } from '../../../../../../domain/types/section.types';

export const complementarySystemsConverter = (complementarySystems: string[]): IDocVariables[] => {
  return complementarySystems.map((doc) => ({
    [VariablesPGREnum.DOCUMENT_COMPLEMENTARY_DOCS]: doc || '',
  }));
};
