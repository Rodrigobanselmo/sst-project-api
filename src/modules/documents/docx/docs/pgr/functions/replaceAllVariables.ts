import { IDocVariables } from '../types/section.types';

export const replaceAllVariables = (
  text: string,
  variables: IDocVariables[],
) => {
  let textReplacement = text;

  if (text)
    variables.forEach((variable) => {
      textReplacement = textReplacement.replaceAll(
        `??${variable.placeholder}??`,
        variable.value,
      );
    });

  return textReplacement;
};
