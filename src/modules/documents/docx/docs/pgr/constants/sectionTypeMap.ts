import { ISectionOptions } from 'docx';

import { chapterSection } from '../../../base/layouts/chapter/chapter';
import { coverSections } from '../../../base/layouts/cover/cover';
import { headerAndFooter } from '../../../base/layouts/headerAndFooter/headerAndFooter';
import { summarySections } from '../../../base/layouts/summary/summary';
import { convertToDocx } from '../functions/convertToDocx';
import { replaceAllVariables } from '../functions/replaceAllVariables';
import {
  IAllSectionTypesPGR,
  IChapter,
  ICover,
  IDocVariables,
  ISection,
  PGRSectionTypeEnum,
} from '../types/section.types';

type IMapDocumentType = Record<
  string,
  (
    arg: IAllSectionTypesPGR,
    variables?: IDocVariables[],
  ) => ISectionOptions | ISectionOptions[]
>;

interface ISectionTypeMapProps {
  logoPath?: string;
  version?: string;
}

export const sectionTypeMap = ({
  logoPath,
  version,
}: ISectionTypeMapProps): IMapDocumentType => ({
  [PGRSectionTypeEnum.SECTION]: (
    { children, version, footerText }: ISection,
    variables,
  ) => ({
    children: convertToDocx(children, variables),
    ...headerAndFooter({
      footerText: replaceAllVariables(footerText, variables),
      logoPath,
      version,
    }),
  }),
  [PGRSectionTypeEnum.COVER]: ({}: ICover) =>
    coverSections({
      imgPath: logoPath,
      version,
    }),
  [PGRSectionTypeEnum.CHAPTER]: ({ text }: IChapter, variables) =>
    chapterSection({ version, chapter: replaceAllVariables(text, variables) }),
  [PGRSectionTypeEnum.TOC]: () => summarySections(),
});
