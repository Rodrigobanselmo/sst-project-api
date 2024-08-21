import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { IDocVariables } from '../../../../../../domain/types/section.types';

export const ComplementaryDocsConverter = (complementaryDocs: string[]): IDocVariables[] => {
  return complementaryDocs.map((doc) => ({
    [VariablesPGREnum.DOCUMENT_COMPLEMENTARY_DOCS]: doc || '',
  }));
};
