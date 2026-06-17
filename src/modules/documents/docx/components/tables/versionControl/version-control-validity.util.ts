import { DocumentSectionChildrenTypeEnum, IParagraph, ISectionChildrenType } from '../../../builders/pgr/types/elements.types';
import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';

export function shouldSkipVersionControlValiditySpacer(
  child: ISectionChildrenType,
  previousChild?: ISectionChildrenType,
): boolean {
  if (previousChild?.type !== DocumentSectionChildrenTypeEnum.TABLE_VERSION_CONTROL) {
    return false;
  }

  if (child.type !== DocumentSectionChildrenTypeEnum.PARAGRAPH) {
    return false;
  }

  const paragraph = child as IParagraph;
  return !paragraph.text?.trim() && !!paragraph.shading?.fill;
}

export function shouldSkipVersionControlValidityParagraph(
  child: ISectionChildrenType,
  previousChild?: ISectionChildrenType,
  previousPreviousChild?: ISectionChildrenType,
): boolean {
  if (child.type !== DocumentSectionChildrenTypeEnum.PARAGRAPH) {
    return false;
  }

  const paragraph = child as IParagraph;
  const text = paragraph.text || '';
  const isValidity =
    text.includes('VIGÊNCIA') || text.includes(VariablesPGREnum.DOC_VALIDITY);

  if (!isValidity) {
    return false;
  }

  const afterTable =
    previousChild?.type === DocumentSectionChildrenTypeEnum.TABLE_VERSION_CONTROL;
  const afterSpacer =
    !!previousChild &&
    shouldSkipVersionControlValiditySpacer(previousChild, previousPreviousChild);

  return afterTable || afterSpacer;
}
