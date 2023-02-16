import { DocumentCoverEntity } from './../../../../../company/entities/document-cover.entity';
import { CompanyEntity } from './../../../../../company/entities/company.entity';
import { CharacterizationEntity } from './../../../../../company/entities/characterization.entity';
import { ISectionOptions } from 'docx';

import { sectionLandscapeProperties } from '../../../base/config/styles';
import { chapterSection } from '../../../base/layouts/chapter/chapter';
import { coverSections } from '../../../base/layouts/cover/cover';
import { headerAndFooter } from '../../../base/layouts/headerAndFooter/headerAndFooter';
import { summarySections } from '../../../base/layouts/summary/summary';
import { HierarchyMapData, IHomoGroupMap } from '../../../converter/hierarchy.converter';
import { convertToDocxHelper } from '../functions/convertToDocx';
import { replaceAllVariables } from '../functions/replaceAllVariables';
import { ISectionChildrenType } from '../types/elements.types';
import { IAllSectionTypesPGR, IChapter, ICover, IDocVariables, ISection, PGRSectionTypeEnum } from '../types/section.types';
import { RiskFactorGroupDataEntity } from '../../../../../sst/entities/riskGroupData.entity';
import { IMapElementDocumentType } from './elementTypeMap';
import { allCharacterizationSections } from '../../../components/iterables/all-characterization/all-characterization.sections';

type IMapSectionDocumentType = Record<string, (arg: IAllSectionTypesPGR) => ISectionOptions | ISectionOptions[]>;

type IDocumentClassType = {
  variables?: IDocVariables;
  consultantLogoImagePath: string;
  logoImagePath?: string;
  version?: string;
  cover: DocumentCoverEntity;
  elementsMap: IMapElementDocumentType;
  document: RiskFactorGroupDataEntity;
  homogeneousGroup: IHomoGroupMap;
  hierarchy: Map<string, HierarchyMapData>;
  characterizations: CharacterizationEntity[];
  environments: CharacterizationEntity[];
  company: CompanyEntity;
};

export class SectionsMapClass {
  private variables: IDocVariables;
  private logoPath: string;
  private consultantLogoPath: string;
  private version: string;
  private elementsMap: IMapElementDocumentType;
  private cover: DocumentCoverEntity;
  private document: RiskFactorGroupDataEntity;
  private homogeneousGroup: IHomoGroupMap;
  private environments: CharacterizationEntity[];
  private characterizations: CharacterizationEntity[];
  private hierarchy: Map<string, HierarchyMapData>;
  private company: CompanyEntity;

  constructor({
    variables,
    cover,
    company,
    version,
    logoImagePath,
    elementsMap,
    document,
    hierarchy,
    homogeneousGroup,
    environments,
    characterizations,
    consultantLogoImagePath,
  }: IDocumentClassType) {
    this.variables = variables;
    this.version = version;
    this.logoPath = logoImagePath;
    this.consultantLogoPath = consultantLogoImagePath;
    this.elementsMap = elementsMap;
    this.document = document;
    this.hierarchy = hierarchy;
    this.homogeneousGroup = homogeneousGroup;
    this.environments = environments;
    this.characterizations = characterizations;
    this.company = company;
    this.cover = cover;
  }

  public map: IMapSectionDocumentType = {
    [PGRSectionTypeEnum.TOC]: () => summarySections(),
    [PGRSectionTypeEnum.COVER]: ({}: ICover) =>
      coverSections({
        imgPath: this.logoPath,
        version: this.version,
        companyName: `${this.company.name} ${this.company.initials ? `(${this.company.initials})` : ''}`,
        ...(this.cover && (this.cover.json as any)),
      }),
    [PGRSectionTypeEnum.CHAPTER]: ({ text }: IChapter) =>
      chapterSection({
        version: this.version,
        chapter: replaceAllVariables(text, this.variables),
        imagePath: this.logoPath,
      }),
    [PGRSectionTypeEnum.SECTION]: ({ children, footerText, ...rest }: ISection) => ({
      children: this.convertToDocx(children),
      ...this.getFooterHeader(footerText),
      ...rest,
      ...sectionLandscapeProperties,
    }),
    [PGRSectionTypeEnum.ITERABLE_ENVIRONMENTS]: (): ISectionOptions[] =>
      allCharacterizationSections(this.environments, this.hierarchy, this.homogeneousGroup, 'env', (x, v) => this.convertToDocx(x, v)).map(
        ({ footerText, children }) => ({
          children,
          ...this.getFooterHeader(footerText),
          ...sectionLandscapeProperties,
        }),
      ),
    [PGRSectionTypeEnum.ITERABLE_CHARACTERIZATION]: (): ISectionOptions[] =>
      allCharacterizationSections(this.characterizations, this.hierarchy, this.homogeneousGroup, 'char', (x, v) => this.convertToDocx(x, v)).map(
        ({ footerText, children }) => ({
          children,
          ...this.getFooterHeader(footerText),
          ...sectionLandscapeProperties,
        }),
      ),
    // [PGRSectionTypeEnum.APR]: () =>
    //   APPRTableSection(this.document, this.hierarchy, this.homogeneousGroup),
  };

  getFooterHeader = (footerText: string) => {
    return headerAndFooter({
      footerText: replaceAllVariables(footerText, this.variables),
      logoPath: this.logoPath,
      consultantLogoPath: this.consultantLogoPath,
      version: this.version,
    });
  };

  private convertToDocx(data: ISectionChildrenType[], variables = {} as IDocVariables) {
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
