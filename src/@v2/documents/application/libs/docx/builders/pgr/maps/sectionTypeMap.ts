import { IExamOrigins } from './../../../../../sst/entities/exam.entity';
import { DocumentDataEntity } from './../../../../../sst/entities/documentData.entity';
import { DocumentDataPGRDto } from './../../../../../sst/dto/document-data-pgr.dto';
import { DocumentCoverEntity } from './../../../../../company/entities/document-cover.entity';
import { CompanyModel } from './../../../../../company/entities/company.entity';
import { CharacterizationEntity } from './../../../../../company/entities/characterization.entity';
import { ISectionOptions } from 'docx';

import { sectionLandscapeProperties } from '../../../base/config/styles';
import { chapterSection } from '../../../base/layouts/chapter/chapter';
import { coverSections } from '../../../base/layouts/cover/cover';
import { headerAndFooter } from '../../../base/layouts/headerAndFooter/headerAndFooter';
import { summarySections } from '../../../base/layouts/summary/summary';
import { HierarchyMapData, IHierarchyMap, IHomoGroupMap } from '../../../converter/hierarchy.converter';
import { convertToDocxHelper } from '../functions/convertToDocx';
import { replaceAllVariables } from '../functions/replaceAllVariables';
import { ISectionChildrenType } from '../../../../../../domain/types/elements.types';
import {
  IAllDocumentSectionType,
  IChapter,
  ICover,
  IDocVariables,
  ISection,
} from '../../../../../../domain/types/section.types';
import { DocumentSectionTypeEnum } from '@/@v2/documents/domain/enums/document-section-type.enum';
import { RiskFactorGroupDataEntity } from '../../../../../sst/entities/riskGroupData.entity';
import { IMapElementDocumentType } from './elementTypeMap';
import { allCharacterizationSections } from '../../../components/iterables/all-characterization/all-characterization.sections';
import { APPRTableSection } from '../../../components/tables/appr/appr.section';
import { actionPlanTableSection } from '../../../components/tables/actionPlan/actionPlan.section';
import { APPRByGroupTableSection } from '../../../components/tables/apprByGroup/appr-group.section';
import { VariablesPGREnum } from '../enums/variables.enum';

type IMapSectionDocumentType = Record<string, (arg: IAllDocumentSectionType) => ISectionOptions | ISectionOptions[]>;

type IDocumentClassType = {
  variables?: IDocVariables;
  consultantLogoImagePath: string;
  logoImagePath?: string;
  version?: string;
  cover: DocumentCoverEntity;
  elementsMap: IMapElementDocumentType;
  document: RiskFactorGroupDataEntity & DocumentDataEntity & DocumentDataPGRDto;
  homogeneousGroup: IHomoGroupMap;
  hierarchy: Map<string, HierarchyMapData>;
  characterizations: CharacterizationEntity[];
  environments: CharacterizationEntity[];
  company: CompanyModel;
  hierarchyTree: IHierarchyMap;
  hierarchyHighLevelsData: Map<string, HierarchyMapData>;
  exams?: IExamOrigins[];
};

export class SectionsMapClass {
  private variables: IDocVariables;
  private logoPath: string;
  private consultantLogoPath: string;
  private version: string;
  private elementsMap: IMapElementDocumentType;
  private cover: DocumentCoverEntity;
  private document: RiskFactorGroupDataEntity & DocumentDataEntity & DocumentDataPGRDto;
  private homogeneousGroup: IHomoGroupMap;
  private environments: CharacterizationEntity[];
  private characterizations: CharacterizationEntity[];
  private hierarchy: Map<string, HierarchyMapData>;
  private hierarchyHighLevelsData: Map<string, HierarchyMapData>;
  private hierarchyTree: IHierarchyMap;
  private company: CompanyModel;
  private exams?: IExamOrigins[];

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
    hierarchyTree,
    hierarchyHighLevelsData,
    exams,
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
    this.hierarchyTree = hierarchyTree;
    this.hierarchyHighLevelsData = hierarchyHighLevelsData;
    this.exams = exams;
  }

  public map: IMapSectionDocumentType = {
    [DocumentSectionTypeEnum.TOC]: () => summarySections(),
    [DocumentSectionTypeEnum.COVER]: ({ }: ICover) =>
      coverSections({
        imgPath: this.logoPath,
        version: this.version,
        title: replaceAllVariables(`??${VariablesPGREnum.DOCUMENT_TITLE}??`, this.variables),
        companyName: `${this.company.name} ${this.company.initials ? `(${this.company.initials})` : ''}`,
        ...(this.cover && (this.cover.json as any)),
      }),
    [DocumentSectionTypeEnum.CHAPTER]: ({ text }: IChapter) =>
      chapterSection({
        version: this.version,
        chapter: replaceAllVariables(text, this.variables),
        imagePath: this.logoPath,
        title: replaceAllVariables(`??${VariablesPGREnum.DOCUMENT_TITLE}??`, this.variables),
      }),
    [DocumentSectionTypeEnum.SECTION]: ({ title, children, footerText, ...rest }: ISection) => ({
      children: this.convertToDocx(children),
      ...this.getFooterHeader(footerText, title),
      ...rest,
      ...sectionLandscapeProperties,
    }),
    [DocumentSectionTypeEnum.ITERABLE_ENVIRONMENTS]: (): ISectionOptions[] =>
      allCharacterizationSections(this.environments, this.hierarchy, this.homogeneousGroup, 'env', (x, v) =>
        this.convertToDocx(x, v),
      ).map(({ footerText, children }) => ({
        children,
        ...this.getFooterHeader(footerText),
        ...sectionLandscapeProperties,
      })),
    [DocumentSectionTypeEnum.ITERABLE_CHARACTERIZATION]: (): ISectionOptions[] =>
      allCharacterizationSections(this.characterizations, this.hierarchy, this.homogeneousGroup, 'char', (x, v) =>
        this.convertToDocx(x, v),
      ).map(({ footerText, children }) => ({
        children,
        ...this.getFooterHeader(footerText),
        ...sectionLandscapeProperties,
      })),
    [DocumentSectionTypeEnum.APR]: () => APPRTableSection(this.document, this.hierarchy, this.homogeneousGroup),
    [DocumentSectionTypeEnum.APR_GROUP]: () =>
      APPRByGroupTableSection(this.document, this.hierarchyHighLevelsData, this.hierarchyTree, this.homogeneousGroup),
    [DocumentSectionTypeEnum.ACTION_PLAN]: () => actionPlanTableSection(this.document, this.hierarchyTree),
  };

  getFooterHeader = (footerText: string, title?: string) => {
    return headerAndFooter({
      title: title || replaceAllVariables(`??${VariablesPGREnum.DOCUMENT_TITLE}??`, this.variables),
      footerText: replaceAllVariables(footerText, this.variables),
      logoPath: this.logoPath,
      consultantLogoPath: this.consultantLogoPath,
      version: this.version,
    });
  };

  private convertToDocx(data: ISectionChildrenType[], variables = {} as IDocVariables) {
    if (!data) return [];
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
