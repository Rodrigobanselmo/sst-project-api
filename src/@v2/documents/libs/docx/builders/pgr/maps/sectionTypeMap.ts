import { ISectionOptions, Paragraph, Table } from 'docx';

import { DocumentSectionTypeEnum } from '@/@v2/documents/domain/enums/document-section-type.enum';
import { DocumentPGRModel } from '@/@v2/documents/domain/models/document-pgr.model';
import { ISectionChildrenType } from '../../../../../domain/types/elements.types';
import { IChapter, ICover, ISection } from '../../../../../domain/types/section.types';
import { sectionLandscapeProperties } from '../../../base/config/styles';
import { chapterSection } from '../../../base/layouts/chapter/chapter';
import { coverSections } from '../../../base/layouts/cover/cover';
import { headerAndFooter } from '../../../base/layouts/headerAndFooter/headerAndFooter';
import { summarySections } from '../../../base/layouts/summary/summary';
import { allCharacterizationSections } from '../../../components/iterables/all-characterization/all-characterization.sections';
import { actionPlanTableSection } from '../../../components/tables/actionPlan/actionPlan.section';
import { APPRTableSection } from '../../../components/tables/appr/appr.section';
import { APPRByGroupTableSection } from '../../../components/tables/apprByGroup/appr-group.section';
import { dataConverter } from '../../../converter/data.converter';
import { VariablesPGREnum } from '../enums/variables.enum';
import { convertToDocxHelper } from '../functions/convertToDocx';
import { replaceAllVariables } from '../functions/replaceAllVariables';
import { IDocVariables } from '../types/documet-section-groups.types';
import { IMapElementDocumentType } from './elementTypeMap';
import { CoverTypeEnum } from '@/@v2/shared/domain/enum/company/cover-type.enum';
import { activitiesPericulosidadeSections } from '../../../components/iterables/activities-periculosidade/activities-periculosidade.sections';

type IMapSectionDocumentType = Record<string, (arg: any) => ISectionOptions | ISectionOptions[] | Promise<ISectionOptions> | Promise<ISectionOptions[]>>;

type IDocumentClassType = {
  data: DocumentPGRModel;
  version: string;
  variables: IDocVariables;
  elementsMap: IMapElementDocumentType;
};

export class SectionsMapClass {
  private data: DocumentPGRModel;
  private version: string;
  private variables: IDocVariables;
  private elementsMap: IMapElementDocumentType;

  constructor({ version, variables, data, elementsMap }: IDocumentClassType) {
    this.data = data;
    this.version = version;
    this.variables = variables;
    this.elementsMap = elementsMap;
  }

  public map: IMapSectionDocumentType = {
    [DocumentSectionTypeEnum.TOC]: () => summarySections(),
    [DocumentSectionTypeEnum.COVER]: ({}: ICover) => {
      const coverProps = this.data.documentBase.company.cover(CoverTypeEnum.PGR);
      const logoPath = this.data.documentBase.logoPath;
      return coverSections({
        imgPath: logoPath,
        version: this.version,
        title: replaceAllVariables(`??${VariablesPGREnum.DOCUMENT_TITLE}??`, this.variables),
        companyName: `${this.data.documentBase.company.name} ${this.data.documentBase.company.initials ? `(${this.data.documentBase.company.initials})` : ''}`,
        coverProps,
      });
    },
    [DocumentSectionTypeEnum.CHAPTER]: ({ text }: IChapter) =>
      chapterSection({
        version: this.version,
        chapter: replaceAllVariables(text || '', this.variables),
        imagePath: this.data.documentBase.logoPath,
        title: replaceAllVariables(`??${VariablesPGREnum.DOCUMENT_TITLE}??`, this.variables),
      }),
    [DocumentSectionTypeEnum.SECTION]: ({ title, children, footerText, ...rest }: ISection) => ({
      children: this.convertToDocx(children),
      ...this.getFooterHeader(footerText || '', title),
      ...rest,
      ...sectionLandscapeProperties,
    }),
    [DocumentSectionTypeEnum.ITERABLE_ENVIRONMENTS]: (): ISectionOptions[] =>
      allCharacterizationSections(this.data.homogeneousGroups, this.oldData.hierarchyData, this.oldData.homoGroupTree, 'env', (x, v) => this.convertToDocx(x, v)).map(({ footerText, children }) => ({
        children,
        ...this.getFooterHeader(footerText),
        ...sectionLandscapeProperties,
      })),
    [DocumentSectionTypeEnum.ITERABLE_CHARACTERIZATION]: (): ISectionOptions[] =>
      allCharacterizationSections(this.data.homogeneousGroups, this.oldData.hierarchyData, this.oldData.homoGroupTree, 'char', (x, v) => this.convertToDocx(x, v)).map(({ footerText, children }) => ({
        children,
        ...this.getFooterHeader(footerText),
        ...sectionLandscapeProperties,
      })),
    [DocumentSectionTypeEnum.APR]: async () =>
      APPRTableSection(this.oldData.documentRiskData, this.oldData.hierarchyData, this.oldData.homoGroupTree, {
        isHideCA: Boolean(this.variables[VariablesPGREnum.IS_HIDE_CA]),
        isHideOrigin: Boolean(this.variables[VariablesPGREnum.IS_HIDE_ORIGIN_COLUMN]),
      }),
    [DocumentSectionTypeEnum.APR_GROUP]: () =>
      APPRByGroupTableSection(this.oldData.documentRiskData, this.oldData.hierarchyHighLevelsData, this.oldData.hierarchyTree, this.oldData.homoGroupTree, {
        isHideCA: Boolean(this.variables[VariablesPGREnum.IS_HIDE_CA]),
        isHideOrigin: Boolean(this.variables[VariablesPGREnum.IS_HIDE_ORIGIN_COLUMN]),
      }),
    [DocumentSectionTypeEnum.ACTION_PLAN]: () => actionPlanTableSection(this.oldData.documentRiskData, this.oldData.hierarchyTree),

    // *PERICULOSIDADE string --------------------->
    [DocumentSectionTypeEnum.PERICULOSIDADE_ACTIVITIES]: (): ISectionOptions[] =>
      activitiesPericulosidadeSections(this.data, this.oldData.hierarchyData, this.oldData.homoGroupTree, this.oldData.hierarchyTree, (x) => this.convertToDocx(x)).map(({ footerText, children }) => ({
        children,
        ...this.getFooterHeader(footerText),
        ...sectionLandscapeProperties,
      })),
  };

  getFooterHeader = (footerText: string, title?: string) => {
    return headerAndFooter({
      title: title || replaceAllVariables(`??${VariablesPGREnum.DOCUMENT_TITLE}??`, this.variables),
      footerText: replaceAllVariables(footerText, this.variables),
      logoPath: this.data.documentBase.company.logoPath,
      consultantLogoPath: this.data.documentBase.company.consultantLogoPath,
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
        return [...(acc || []), ...(curr || [])];
      }, []) as (Paragraph | Table)[];
  }

  private get oldData() {
    const data = dataConverter({ data: this.data });
    return data;
  }
}
