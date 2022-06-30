import { ISectionOptions } from 'docx';
import { sectionLandscapeProperties } from '../../../base/config/styles';

import { chapterSection } from '../../../base/layouts/chapter/chapter';
import { coverSections } from '../../../base/layouts/cover/cover';
import { headerAndFooter } from '../../../base/layouts/headerAndFooter/headerAndFooter';
import { summarySections } from '../../../base/layouts/summary/summary';
import { convertToDocxHelper } from '../functions/convertToDocx';
import { replaceAllVariables } from '../functions/replaceAllVariables';
import { ISectionChildrenType } from '../types/elements.types';
import {
  IAllSectionTypesPGR,
  IChapter,
  ICover,
  IDocVariables,
  ISection,
  PGRSectionTypeEnum,
} from '../types/section.types';
import { IMapElementDocumentType } from './elementTypeMap';

type IMapSectionDocumentType = Record<
  string,
  (arg: IAllSectionTypesPGR) => ISectionOptions | ISectionOptions[]
>;

type IDocumentClassType = {
  variables?: IDocVariables;
  logoImagePath?: string;
  version?: string;
  elementsMap: IMapElementDocumentType;
};

export class SectionsMapClass {
  private variables: IDocVariables;
  private logoPath: string;
  private version: string;
  private elementsMap: IMapElementDocumentType;

  // eslint-disable-next-line prettier/prettier
  constructor({ variables, version, logoImagePath, elementsMap }: IDocumentClassType) {
    this.variables = variables;
    this.version = version;
    this.logoPath = logoImagePath;
    this.elementsMap = elementsMap;
  }

  public map: IMapSectionDocumentType = {
    [PGRSectionTypeEnum.TOC]: () => summarySections(),
    [PGRSectionTypeEnum.COVER]: ({}: ICover) =>
      coverSections({
        imgPath: this.logoPath,
        version: this.version,
      }),
    [PGRSectionTypeEnum.CHAPTER]: ({ text }: IChapter) =>
      chapterSection({
        version: this.version,
        chapter: replaceAllVariables(text, this.variables),
      }),
    [PGRSectionTypeEnum.SECTION]: ({
      children,
      footerText,
      ...rest
    }: ISection) => ({
      children: this.convertToDocx(children),
      ...this.getFooterHeader(footerText),
      ...rest,
      ...sectionLandscapeProperties,
    }),
  };

  getFooterHeader = (footerText: string) => {
    return headerAndFooter({
      footerText: replaceAllVariables(footerText, this.variables),
      logoPath: this.logoPath,
      version: this.version,
    });
  };

  private convertToDocx(data: ISectionChildrenType[]) {
    return data
      .map((child) => {
        const childData = convertToDocxHelper(child, this.variables);
        if (!childData) return null;

        return this.elementsMap[childData.type](childData);
      })
      .filter((x) => x)
      .reduce((acc, curr) => {
        return [...acc, ...curr];
      }, []);
  }
}