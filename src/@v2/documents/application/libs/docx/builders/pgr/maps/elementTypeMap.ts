import { DocumentChildrenTypeEnum } from '@/@v2/documents/domain/enums/document-children-type.enum';
import { IBreak, IBullet, IH1, IH2, IH3, IH4, IH5, IH6, IImage, IParagraph, ISectionChildrenType, ITitle } from '@/@v2/documents/domain/types/elements.types';
import { Paragraph, Table } from 'docx';
import { h1, h2, h3, h4, h5, h6, title } from '../../../base/elements/heading';
import { pageBreak, paragraphFigure, paragraphNewNormal, paragraphTable, paragraphTableLegend } from '../../../base/elements/paragraphs';
import { imageDoc } from '../../../components/images/image';
import { bulletsNormal, bulletsSpace } from '../../../base/elements/bullets';
import { versionControlTable } from '../../../components/tables/versionControl/versionControl.table';
import { HomoTypeEnum } from '@/@v2/shared/domain/enum/security/homo-type.enum';
import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';
import { IDocVariables } from '../types/IDocumentPGRSectionGroups';
import { hierarchyHomoOrgSection } from '../../../components/tables/hierarchyHomoOrg/hierarchyHomoOrg.section';
import { DocumentPGRModel } from '@/@v2/documents/domain/models/document-pgr.model';
import { AttachmentModel } from '@/@v2/documents/domain/models/attachment.model';

export type IMapElementDocumentType = Record<string, (arg: any) => (Paragraph | Table)[]>;

type IDocumentClassType = {
  data: DocumentPGRModel;
  variables: IDocVariables;
  attachments: AttachmentModel[];
  imagesMap?: IImagesMap;
};

export class ElementsMapClass {
  private data: DocumentPGRModel;
  private variables: IDocVariables;
  private attachments: AttachmentModel[];
  private imagesMap?: IImagesMap;

  constructor({
    data,
    variables,
    attachments,
    imagesMap,
  }: IDocumentClassType) {
    this.data = data;
    this.variables = variables;
    this.attachments = attachments;
    this.imagesMap = imagesMap;
  }

  public map: IMapElementDocumentType = {
    [DocumentChildrenTypeEnum.H1]: ({ text }: IH1) => [h1(text)],
    [DocumentChildrenTypeEnum.H2]: ({ text }: IH2) => [h2(text)],
    [DocumentChildrenTypeEnum.H3]: ({ text }: IH3) => [h3(text)],
    [DocumentChildrenTypeEnum.H4]: ({ text }: IH4) => [h4(text)],
    [DocumentChildrenTypeEnum.H5]: ({ text }: IH5) => [h5(text)],
    [DocumentChildrenTypeEnum.H6]: ({ text }: IH6) => [h6(text)],
    [DocumentChildrenTypeEnum.BREAK]: ({ }: IBreak) => [pageBreak()],
    [DocumentChildrenTypeEnum.TITLE]: ({ text }: ITitle) => [title(text)],
    [DocumentChildrenTypeEnum.PARAGRAPH]: ({ text, ...rest }: IParagraph) => [paragraphNewNormal(text, rest)],
    [DocumentChildrenTypeEnum.IMAGE]: (data: IImage) => imageDoc(data, this.imagesMap),
    [DocumentChildrenTypeEnum.LEGEND]: ({ text, ...rest }: IParagraph) => [paragraphTableLegend(text, rest)],
    [DocumentChildrenTypeEnum.PARAGRAPH_TABLE]: ({ text, ...rest }: IParagraph) => [paragraphTable(text, rest)],
    [DocumentChildrenTypeEnum.PARAGRAPH_FIGURE]: ({ text, ...rest }: IParagraph) => {
      const figure = paragraphFigure(text, rest)
      if (figure) return [figure]
      return []
    },
    [DocumentChildrenTypeEnum.BULLET]: ({ level = 0, text, ...rest }: IBullet) => [bulletsNormal(text, level, rest)],
    [DocumentChildrenTypeEnum.BULLET_SPACE]: ({ text }: IBullet) => [bulletsSpace(text)],
    [DocumentChildrenTypeEnum.TABLE_VERSION_CONTROL]: () => [versionControlTable(this.versions)],
    [DocumentChildrenTypeEnum.TABLE_GSE]: () =>
      hierarchyHomoOrgSection(this.hierarchy, this.homogeneousGroup, {
        showDescription: false,
        showHomogeneous: true,
        showHomogeneousDescription: true,
      })['children'],
    [DocumentChildrenTypeEnum.TABLE_HIERARCHY_ENV]: () =>
      hierarchyHomoOrgSection(this.hierarchy, this.homogeneousGroup, {
        showDescription: false,
        showHomogeneous: true,
        type: HomoTypeEnum.ENVIRONMENT,
      })['children'],
    [DocumentChildrenTypeEnum.TABLE_HIERARCHY_CHAR]: () =>
      hierarchyHomoOrgSection(this.hierarchy, this.homogeneousGroup, {
        showDescription: false,
        showHomogeneous: true,
        type: [HomoTypeEnum.ACTIVITIES, HomoTypeEnum.EQUIPMENT, HomoTypeEnum.WORKSTATION],
      })['children'],
    [DocumentChildrenTypeEnum.PROFESSIONALS_SIGNATURES]: () => signaturesIterable(this.professionals, this.workspace, (x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.TABLE_PRIORITIZATION]: () =>
      hierarchyPrioritizationPage(
        this.document,
        this.hierarchy,
        this.hierarchyTree,
        {
          isByGroup: true,
        },
        (x, v) => this.convertToDocx(x as unknown as any[], v as unknown as any),
      ),
    [DocumentChildrenTypeEnum.TABLE_PRIORITIZATION_HIERARCHY]: () =>
      hierarchyPrioritizationPage(
        this.document,
        this.hierarchy,
        this.hierarchyTree,
        {
          isByGroup: true,
          homoType: HomoTypeEnum.HIERARCHY,
        },
        (x, v) => this.convertToDocx(x, v),
      ),
    [DocumentChildrenTypeEnum.TABLE_PRIORITIZATION_ENV]: () =>
      hierarchyPrioritizationPage(
        this.document,
        this.hierarchy,
        this.hierarchyTree,
        {
          isByGroup: true,
          homoType: HomoTypeEnum.ENVIRONMENT,
        },
        (x, v) => this.convertToDocx(x, v),
      ),
    [DocumentChildrenTypeEnum.TABLE_PRIORITIZATION_CHAR]: () =>
      hierarchyPrioritizationPage(
        this.document,
        this.hierarchy,
        this.hierarchyTree,
        {
          isByGroup: true,
          homoType: [HomoTypeEnum.ACTIVITIES, HomoTypeEnum.EQUIPMENT, HomoTypeEnum.WORKSTATION],
        },
        (x, v) => this.convertToDocx(x, v),
      ),
    [DocumentChildrenTypeEnum.TABLE_QUANTITY_NOISE]: () => [quantityNoiseTable(this.document, this.hierarchyTree)],
    [DocumentChildrenTypeEnum.TABLE_QUANTITY_HEAT]: () => [quantityHeatTable(this.document, this.hierarchyTree)],
    [DocumentChildrenTypeEnum.TABLE_QUANTITY_VFB]: () => [quantityVFBTable(this.document, this.hierarchyTree)],
    [DocumentChildrenTypeEnum.TABLE_QUANTITY_VL]: () => [quantityVLTable(this.document, this.hierarchyTree)],
    [DocumentChildrenTypeEnum.TABLE_QUANTITY_RAD]: () => [quantityRadTable(this.document, this.hierarchyTree)],
    [DocumentChildrenTypeEnum.TABLE_QUANTITY_QUI]: () => [quantityQuiTable(this.document, this.hierarchyTree)],
    [DocumentChildrenTypeEnum.ITERABLE_QUALITY_FIS]: () =>
      bulletTextIterable(
        removeDuplicate(
          (this.document?.data || [])
            .map((riskData) => !!(riskData.riskFactor.type === RiskTypeEnum.FIS) && riskData.riskFactor.name)
            .filter((x) => x),
          { simpleCompare: true },
        ),
        (x, v) => this.convertToDocx(x, v),
      ),
    [DocumentChildrenTypeEnum.ITERABLE_QUALITY_QUI]: () =>
      bulletTextIterable(
        removeDuplicate(
          (this.document?.data || [])
            .map((riskData) => !!(riskData.riskFactor.type === RiskTypeEnum.QUI) && riskData.riskFactor.name)
            .filter((x) => x),
          { simpleCompare: true },
        ),
        (x, v) => this.convertToDocx(x, v),
      ),
    [DocumentChildrenTypeEnum.ITERABLE_QUALITY_BIO]: () =>
      bulletTextIterable(
        removeDuplicate(
          (this.document?.data || [])
            .map((riskData) => !!(riskData.riskFactor.type === RiskTypeEnum.BIO) && riskData.riskFactor.name)
            .filter((x) => x),
          { simpleCompare: true },
        ),
        (x, v) => this.convertToDocx(x, v),
      ),
    [DocumentChildrenTypeEnum.ITERABLE_QUALITY_ERG]: () =>
      bulletTextIterable(
        removeDuplicate(
          (this.document?.data || [])
            .map((riskData) => !!(riskData.riskFactor.type === RiskTypeEnum.ERG) && riskData.riskFactor.name)
            .filter((x) => x),
          { simpleCompare: true },
        ),
        (x, v) => this.convertToDocx(x, v),
      ),
    [DocumentChildrenTypeEnum.ITERABLE_QUALITY_ACI]: () =>
      bulletTextIterable(
        removeDuplicate(
          (this.document?.data || [])
            .map((riskData) => !!(riskData.riskFactor.type === RiskTypeEnum.ACI) && riskData.riskFactor.name)
            .filter((x) => x),
          { simpleCompare: true },
        ),
        (x, v) => this.convertToDocx(x, v),
      ),
    [DocumentChildrenTypeEnum.PROFESSIONAL]: () => professionalsIterable(this.professionals, this.workspace, (x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.COMPLEMENTARY_DOCS]: () => complementaryDocsIterable(this.document.complementaryDocs || [], (x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.COMPLEMENTARY_SYSTEMS]: () => complementarySystemsIterable(this.document.complementarySystems || [], (x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.ITERABLE_RECOMMENDATIONS]: () => recommendationsIterable(this.document?.data || [], (x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.ITERABLE_EMERGENCY_RISKS]: () => emergencyIterable(this.document?.data || [], (x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.ATTACHMENTS]: () => attachmentsIterable(this.attachments || [], (x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.HEALTH_EFFECT_TABLES]: () => healthEffectTable((x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.EXPOSITION_DEGREE_TABLES]: () => expositionDegreeTable((x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.MATRIX_TABLES]: () => [matrizTable()],
    [DocumentChildrenTypeEnum.MEASURE_IMAGE]: () => measureHierarchyImage(),
    [DocumentChildrenTypeEnum.RS_IMAGE]: () => rsDocumentImage(),
    [DocumentChildrenTypeEnum.QUANTITY_RESULTS_TABLES]: () => quantityResultsTable((x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.QUANTITY_CONSIDERATION_TABLES]: () => considerationsQuantityTable((x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.HIERARCHY_ORG_TABLE]: () =>
      hierarchyHomoOrgSection(this.hierarchy, this.homogeneousGroup, {
        showDescription: false,
        showHomogeneous: false,
        showHomogeneousDescription: false,
      })['children'],
    [DocumentChildrenTypeEnum.RISK_TABLE]: () => riskCharacterizationTableSection(this.document, this.riskExamMap)['children'],
    [DocumentChildrenTypeEnum.HIERARCHY_RISK_TABLE]: () =>
      hierarchyRisksTableAllSections(this.document, this.hierarchy, this.hierarchyTree, (x, v) =>
        this.convertToDocx(x, v),
      ),
    [DocumentChildrenTypeEnum.PLAN_TABLE]: () => actionPlanTableSection(this.document, this.hierarchyTree)['children'],
  };

  private convertToDocx(data: ISectionChildrenType[], variables = {} as IDocVariables) {
    const components: (Paragraph | Table)[] = []

    data.forEach((child) => {
      const childData = convertToDocxHelper(child, {
        ...this.variables,
        ...variables,
      });

      if (!childData) return null;
      components.push(...this.map[childData.type](childData))
    })


    return components;
  }
}
