import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { IDocVariables } from '../../../builders/pgr/types/IDocumentPGRSectionGroups';

export const ComplementaryDocsConverter = (complementaryDocs: string[]): IDocVariables[] => {
  return complementaryDocs.map((doc) => ({
    [VariablesPGREnum.DOCUMENT_COMPLEMENTARY_DOCS]: doc || '',
  }));
};
