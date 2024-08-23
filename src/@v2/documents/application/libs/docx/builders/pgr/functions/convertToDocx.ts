import { ISectionChildrenType } from '@/@v2/documents/domain/types/elements.types';
import { IDocVariables } from '../types/IDocumentPGRSectionGroups';
import { replaceAllVariables } from './replaceAllVariables';

export const convertToDocxHelper = (data: ISectionChildrenType, variables: IDocVariables) => {
  const child = { ...data };

  if ('removeWithSomeEmptyVars' in child) {
    const isEmpty = child.removeWithSomeEmptyVars?.some((variable) => !variables[variable]);
    if (isEmpty) {
      return null;
    }
  }

  if ('removeWithAllEmptyVars' in child) {
    const isEmpty = child.removeWithAllEmptyVars?.every((variable) => !variables[variable]);
    if (isEmpty) {
      return null;
    }
  }

  if ('removeWithAllValidVars' in child) {
    const isNotEmpty = child.removeWithAllValidVars?.every((variable) => variables[variable]);
    if (isNotEmpty) {
      return null;
    }
  }

  if ('addWithAllVars' in child) {
    const isNotEmpty = child.addWithAllVars?.every((variable) => variables[variable]);
    if (!isNotEmpty) {
      return null;
    }
  }

  if ('text' in child) {
    child.text = replaceAllVariables(child.text, {
      ...variables,
    });
  }

  return child;
};
