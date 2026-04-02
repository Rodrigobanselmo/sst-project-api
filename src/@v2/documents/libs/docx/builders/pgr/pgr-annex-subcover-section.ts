import { ISectionOptions } from 'docx';

import { DocumentPGRModel } from '@/@v2/documents/domain/models/document-pgr.model';
import { chapterSection } from '../../base/layouts/chapter/chapter';
import { VariablesPGREnum } from './enums/variables.enum';
import { replaceAllVariables } from './functions/replaceAllVariables';

/** Mesma “página de capítulo” usada antes no documento principal; agora só nos anexos individuais e no consolidado. */
export function pgrAnnexSubcoverSection(data: DocumentPGRModel, version: string, chapterLine: string): ISectionOptions {
  const docTitle = replaceAllVariables(`??${VariablesPGREnum.DOCUMENT_TITLE}??`, data.model.variables || {});
  return chapterSection({
    version,
    chapter: chapterLine,
    imagePath: data.documentBase.mainLogoPath,
    title: docTitle,
  });
}
