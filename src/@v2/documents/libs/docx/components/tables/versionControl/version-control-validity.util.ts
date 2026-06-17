import { DocumentChildrenTypeEnum } from '@/@v2/documents/domain/enums/document-children-type.enum';
import { IParagraph, ISectionChildrenType } from '@/@v2/documents/domain/types/elements.types';
import { VariablesPGREnum } from '@/@v2/documents/libs/docx/builders/pgr/enums/variables.enum';

export function shouldSkipVersionControlValiditySpacer(
  child: ISectionChildrenType,
  previousChild?: ISectionChildrenType,
): boolean {
  if (previousChild?.type !== DocumentChildrenTypeEnum.TABLE_VERSION_CONTROL) {
    return false;
  }

  if (child.type !== DocumentChildrenTypeEnum.PARAGRAPH) {
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
  if (child.type !== DocumentChildrenTypeEnum.PARAGRAPH) {
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
    previousChild?.type === DocumentChildrenTypeEnum.TABLE_VERSION_CONTROL;
  const afterSpacer =
    !!previousChild &&
    shouldSkipVersionControlValiditySpacer(previousChild, previousPreviousChild);

  return afterTable || afterSpacer;
}
