import { Paragraph, Table } from 'docx';

import { bulletsNormal } from '../../../base/elements/bullets';
import { h1, h2, h3, h4, h5, h6, title } from '../../../base/elements/heading';
import { pageBreak, paragraphNormal } from '../../../base/elements/paragraphs';
import {
  IBreak,
  IBullet,
  IH1,
  IH2,
  IH3,
  IH4,
  IH5,
  IH6,
  IParagraph,
  ISectionChildrenType,
  ITitle,
  PGRSectionChildrenTypeEnum,
} from '../types/elements.types';
import { IDocVariables } from '../types/section.types';

type IMapDocumentType = Record<
  string,
  (arg: ISectionChildrenType, variables?: IDocVariables[]) => Paragraph | Table
>;

export const elementTypeMap: IMapDocumentType = {
  [PGRSectionChildrenTypeEnum.H1]: ({ text }: IH1) => h1(text),
  [PGRSectionChildrenTypeEnum.H2]: ({ text }: IH2) => h2(text),
  [PGRSectionChildrenTypeEnum.H3]: ({ text }: IH3) => h3(text),
  [PGRSectionChildrenTypeEnum.H4]: ({ text }: IH4) => h4(text),
  [PGRSectionChildrenTypeEnum.H5]: ({ text }: IH5) => h5(text),
  [PGRSectionChildrenTypeEnum.H6]: ({ text }: IH6) => h6(text),
  [PGRSectionChildrenTypeEnum.BREAK]: ({}: IBreak) => pageBreak(),
  [PGRSectionChildrenTypeEnum.TITLE]: ({ text }: ITitle) => title(text),
  [PGRSectionChildrenTypeEnum.PARAGRAPH]: ({ text }: IParagraph) =>
    paragraphNormal(text),
  [PGRSectionChildrenTypeEnum.BULLET]: ({ level, text }: IBullet) =>
    bulletsNormal(text, level),
};
