import { elementTypeMap } from '../constants/elementTypeMap';
import { ISectionChildrenType } from '../types/elements.types';
import { IDocVariables } from '../types/section.types';
import { replaceAllVariables } from './replaceAllVariables';

export const convertToDocx = (
  data: ISectionChildrenType[],
  variables: IDocVariables[],
) => {
  return data.map((child) => {
    if ('text' in child) {
      child.text = replaceAllVariables(child.text, variables);
    }

    return elementTypeMap[child.type](child, variables);
  });
};
