import { IDocVariables } from '../../../builders/pgr/types/IDocumentPGRSectionGroups';
import { isOdd } from '../../../../../../shared/utils/isOdd';

export const replaceAllVariables = (text: string, variables: IDocVariables) => {
  if (text) {
    return text
      .split('??')
      .map((variable, index) => {
        if (isOdd(index)) {
          return variables[variable];
        }

        return variable;
      })
      .join('');
  }

  return text;
};
