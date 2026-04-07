import { IExamOrigins } from './../../../../../sst/entities/exam.entity';
import { DocumentDataEntity } from './../../../../../sst/entities/documentData.entity';
import { DocumentDataPGRDto } from './../../../../../sst/dto/document-data-pgr.dto';
import { DocumentCoverEntity } from './../../../../../company/entities/document-cover.entity';
import { CompanyEntity } from './../../../../../company/entities/company.entity';
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
import { DocumentSectionChildrenTypeEnum, ISectionChildrenType } from '../types/elements.types';
import {
  IAllDocumentSectionType,
  IChapter,
  ICover,
  IDocVariables,
  ISection,
  DocumentSectionTypeEnum,
} from '../types/section.types';
import { RiskFactorGroupDataEntity } from '../../../../../sst/entities/riskGroupData.entity';
import { IMapElementDocumentType } from './elementTypeMap';
import { allCharacterizationSections } from '../../../components/iterables/all-characterization/all-characterization.sections';
import { APPRTableSection } from '../../../components/tables/appr/appr.section';
import { actionPlanTableSection } from '../../../components/tables/actionPlan/actionPlan.section';
import { APPRByGroupTableSection } from '../../../components/tables/apprByGroup/appr-group.section';
import { PGR_ANNEX_SUBCOVER_CHAPTER_LINES } from '../constants/pgr-annex-subcover-titles';
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
  company: CompanyEntity;
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
  /** Template for footer middle line when SECTION omits `footerText` (carried from last CHAPTER or last explicit SECTION). */
  private lastChapterFooterTemplate = '';
  private cover: DocumentCoverEntity;
  private document: RiskFactorGroupDataEntity & DocumentDataEntity & DocumentDataPGRDto;
  private homogeneousGroup: IHomoGroupMap;
  private environments: CharacterizationEntity[];
  private characterizations: CharacterizationEntity[];
  private hierarchy: Map<string, HierarchyMapData>;
  private hierarchyHighLevelsData: Map<string, HierarchyMapData>;
  private hierarchyTree: IHierarchyMap;
  private company: CompanyEntity;
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
    [DocumentSectionTypeEnum.COVER]: ({}: ICover) =>
      coverSections({
        imgPath: this.logoPath,
        version: this.version,
        title: replaceAllVariables(`??${VariablesPGREnum.DOCUMENT_TITLE}??`, this.variables),
        companyName: `${this.company.name} ${this.company.initials ? `(${this.company.initials})` : ''}`,
        ...(this.cover && (this.cover.json as any)),
      }),
    [DocumentSectionTypeEnum.CHAPTER]: ({ text }: IChapter) => {
      if (text && String(text).trim() !== '') {
        this.lastChapterFooterTemplate = text;
      }
      return chapterSection({
        version: this.version,
        chapter: replaceAllVariables(text, this.variables),
        imagePath: this.logoPath,
        title: replaceAllVariables(`??${VariablesPGREnum.DOCUMENT_TITLE}??`, this.variables),
      });
    },
    [DocumentSectionTypeEnum.SECTION]: ({ title, children, footerText, ...rest }: ISection) => {
      const explicitFooter =
        footerText && String(footerText).trim() !== ''
          ? footerText
          : title && String(title).trim() !== ''
            ? title
            : '';

      let fromTitleChild = '';
      if (!explicitFooter.trim() && children?.length) {
        const t = children.find((c) => c.type === DocumentSectionChildrenTypeEnum.TITLE);
        if (t && 'text' in t && t.text) fromTitleChild = String(t.text);
      }

      const rawChapterFooterTemplate = explicitFooter.trim()
        ? explicitFooter
        : fromTitleChild.trim()
          ? fromTitleChild
          : this.lastChapterFooterTemplate;

      if (explicitFooter.trim()) {
        this.lastChapterFooterTemplate = explicitFooter;
      } else if (fromTitleChild.trim()) {
        this.lastChapterFooterTemplate = fromTitleChild;
      }

      const mainSection: ISectionOptions = {
        children: this.convertToDocx(children),
        ...this.getFooterHeader(rawChapterFooterTemplate),
        ...rest,
        ...sectionLandscapeProperties,
      };

      const isAnnexAttachmentsSection = Boolean(
        children?.some((c) => c.type === DocumentSectionChildrenTypeEnum.ATTACHMENTS),
      );
      if (!isAnnexAttachmentsSection) {
        return mainSection;
      }

      const docTitle = replaceAllVariables(`??${VariablesPGREnum.DOCUMENT_TITLE}??`, this.variables);
      const annexSubcovers = PGR_ANNEX_SUBCOVER_CHAPTER_LINES.map((chapterLine) =>
        chapterSection({
          version: this.version,
          chapter: chapterLine,
          imagePath: this.logoPath,
          title: docTitle,
        }),
      );

      return [mainSection, ...annexSubcovers];
    },
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
