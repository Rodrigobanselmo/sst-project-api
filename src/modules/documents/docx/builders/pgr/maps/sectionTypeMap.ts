import { CharacterizationEntity } from './../../../../../company/entities/characterization.entity';
import { ISectionOptions } from 'docx';

import { sectionLandscapeProperties } from '../../../base/config/styles';
import { chapterSection } from '../../../base/layouts/chapter/chapter';
import { coverSections } from '../../../base/layouts/cover/cover';
import { headerAndFooter } from '../../../base/layouts/headerAndFooter/headerAndFooter';
import { summarySections } from '../../../base/layouts/summary/summary';
import { characterizationSections } from '../../../components/iterables/characterization/characterization.sections';
import { environmentSections } from '../../../components/iterables/environments/environments.sections';
import { APPRTableSection } from '../../../components/tables/appr/appr.section';
import {
  HierarchyMapData,
  IHomoGroupMap,
} from '../../../converter/hierarchy.converter';
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
import { RiskFactorGroupDataEntity } from './../../../../../checklist/entities/riskGroupData.entity';
import { EnvironmentEntity } from './../../../../../company/entities/environment.entity';
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
  document: RiskFactorGroupDataEntity;
  homogeneousGroup: IHomoGroupMap;
  hierarchy: Map<string, HierarchyMapData>;
  characterizations: CharacterizationEntity[];
  environments: EnvironmentEntity[];
};

export class SectionsMapClass {
  private variables: IDocVariables;
  private logoPath: string;
  private version: string;
  private elementsMap: IMapElementDocumentType;
  private document: RiskFactorGroupDataEntity;
  private homogeneousGroup: IHomoGroupMap;
  private environments: EnvironmentEntity[];
  private characterizations: CharacterizationEntity[];
  private hierarchy: Map<string, HierarchyMapData>;

  // eslint-disable-next-line prettier/prettier
  constructor({ variables, version, logoImagePath, elementsMap, document, hierarchy, homogeneousGroup,environments,characterizations }: IDocumentClassType) {
    this.variables = variables;
    this.version = version;
    this.logoPath = logoImagePath;
    this.elementsMap = elementsMap;
    this.document = document;
    this.hierarchy = hierarchy;
    this.homogeneousGroup = homogeneousGroup;
    this.environments = environments;
    this.characterizations = characterizations;
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
    [PGRSectionTypeEnum.ITERABLE_ENVIRONMENTS]: (): ISectionOptions[] =>
      environmentSections(
        this.environments,
        this.hierarchy,
        this.homogeneousGroup,
        (x, v) => this.convertToDocx(x, v),
      ).map(({ footerText, children }) => ({
        children,
        ...this.getFooterHeader(footerText),
        ...sectionLandscapeProperties,
      })),
    [PGRSectionTypeEnum.ITERABLE_CHARACTERIZATION]: (): ISectionOptions[] =>
      characterizationSections(
        this.characterizations,
        this.hierarchy,
        this.homogeneousGroup,
        (x, v) => this.convertToDocx(x, v),
      ).map(({ footerText, children }) => ({
        children,
        ...this.getFooterHeader(footerText),
        ...sectionLandscapeProperties,
      })),
    // [PGRSectionTypeEnum.APR]: () =>
    //   APPRTableSection(this.document, this.hierarchy, this.homogeneousGroup),
  };

  getFooterHeader = (footerText: string) => {
    return headerAndFooter({
      footerText: replaceAllVariables(footerText, this.variables),
      logoPath: this.logoPath,
      version: this.version,
    });
  };

  private convertToDocx(
    data: ISectionChildrenType[],
    variables = {} as IDocVariables,
  ) {
    return data
      .map((child) => {
        const childData = convertToDocxHelper(child, {
          ...this.variables,
          ...variables,
        });
        if (!childData) return null;
        return this.elementsMap[childData.type](childData);
      })
      .filter((x) => x)
      .reduce((acc, curr) => {
        return [...acc, ...curr];
      }, []);
  }
}
