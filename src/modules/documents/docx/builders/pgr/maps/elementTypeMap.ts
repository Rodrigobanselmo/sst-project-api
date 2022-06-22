import { ProfessionalEntity } from './../../../../../users/entities/professional.entity';
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
import { RiskDocumentEntity } from '../../../../../checklist/entities/riskDocument.entity';
import { versionControlTable } from '../../../components/tables/versionControl/versionControl.table';
import { professionalsIterable } from '../../../components/iterables/professionals.iterable';
import { replaceAllVariables } from '../functions/replaceAllVariables';

export type IMapElementDocumentType = Record<
  string,
  (arg: ISectionChildrenType) => (Paragraph | Table)[]
>;

type IDocumentClassType = {
  variables: IDocVariables;
  versions: RiskDocumentEntity[];
  professionals: ProfessionalEntity[];
};

export class ElementsMapClass {
  private variables: IDocVariables;
  private versions: RiskDocumentEntity[];
  private professionals: ProfessionalEntity[];

  constructor({ variables, versions, professionals }: IDocumentClassType) {
    this.variables = variables;
    this.versions = versions;
    this.professionals = professionals;
  }

  public map: IMapElementDocumentType = {
    [PGRSectionChildrenTypeEnum.H1]: ({ text }: IH1) => [h1(text)],
    [PGRSectionChildrenTypeEnum.H2]: ({ text }: IH2) => [h2(text)],
    [PGRSectionChildrenTypeEnum.H3]: ({ text }: IH3) => [h3(text)],
    [PGRSectionChildrenTypeEnum.H4]: ({ text }: IH4) => [h4(text)],
    [PGRSectionChildrenTypeEnum.H5]: ({ text }: IH5) => [h5(text)],
    [PGRSectionChildrenTypeEnum.H6]: ({ text }: IH6) => [h6(text)],
    [PGRSectionChildrenTypeEnum.BREAK]: ({}: IBreak) => [pageBreak()],
    [PGRSectionChildrenTypeEnum.TITLE]: ({ text }: ITitle) => [title(text)],
    [PGRSectionChildrenTypeEnum.PARAGRAPH]: ({ text, size }: IParagraph) => [
      paragraphNormal(text, { size }),
    ],
    [PGRSectionChildrenTypeEnum.TABLE_VERSION_CONTROL]: () => [
      versionControlTable(this.versions),
    ],
    [PGRSectionChildrenTypeEnum.BULLET]: ({ level, text }: IBullet) => [
      bulletsNormal(text, level),
    ],
    [PGRSectionChildrenTypeEnum.PROFESSIONAL]: () =>
      professionalsIterable(this.professionals, this.convertToDocx),
  };

  private convertToDocx(
    data: ISectionChildrenType[],
    variables = {} as IDocVariables,
  ) {
    return data
      .map((child) => {
        if ('text' in child) {
          child.text = replaceAllVariables(child.text, {
            ...this.variables,
            ...variables,
          });
        }

        return this.map[child.type](child);
      })
      .reduce((acc, curr) => {
        return [...acc, ...curr];
      }, []);
  }
}
