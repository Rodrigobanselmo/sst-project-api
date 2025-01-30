import { isOdd } from '@/@v2/shared/utils/helpers/is-odd';
import { IDocVariables } from '../types/documet-section-groups.types';

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
