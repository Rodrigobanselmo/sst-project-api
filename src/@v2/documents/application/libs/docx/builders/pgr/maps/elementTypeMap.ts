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
import { IImagesMap } from '@/@v2/documents/application/factories/document/types/document-factory.types';
import { convertToDocxHelper } from '../functions/convertToDocx';
import { HierarchyModel } from '@/@v2/documents/domain/models/hierarchy.model';
import { hierarchyConverter, IHierarchyDataConverter } from '../../../converter/hierarchy.converter';
import { ICharacterizationModel } from '@/@v2/documents/domain/models/characterization.model';
import { signaturesIterable } from '../../../components/iterables/signatures/signatures.iterable';
import { hierarchyPrioritizationPage } from '../../../components/tables/hierarchyPrioritization/hierarchyPrioritization.page';
import { quantityNoiseTable } from '../../../components/tables/quantity/quantityNoise/quantityNoise.table';
import { quantityHeatTable } from '../../../components/tables/quantity/quantityHeat/quantityHeat.table';
import { quantityVFBTable } from '../../../components/tables/quantity/quantityVFB/quantityVFB.table';
import { quantityVLTable } from '../../../components/tables/quantity/quantityVL/quantityVL.table';
import { quantityRadTable } from '../../../components/tables/quantity/quantityRad/quantityRad.table';
import { quantityQuiTable } from '../../../components/tables/quantity/quantityQui/quantityQui.table';
import { bulletTextIterable } from '../../../components/iterables/bullets/bullets.iterable';
import { removeDuplicate } from '@/@v2/shared/utils/helpers/remove-duplicate';
import { professionalsIterable } from '../../../components/iterables/professionals/professionals.iterable';
import { complementaryDocsIterable } from '../../../components/iterables/complementaryDocs/complementaryDocs.iterable';
import { complementarySystemsIterable } from '../../../components/iterables/complementarySystems/complementarySystems.iterable';
import { recommendationsIterable } from '../../../components/iterables/recommendations/recommendations.iterable';
import { emergencyIterable } from '../../../components/iterables/emergency/emergency.iterable';
import { attachmentsIterable } from '../../../components/iterables/attachments/attachments.iterable';
import { healthEffectTable } from '../../../components/tables/mock/components/healthSeverity/section/healthEffectTable';
import { expositionDegreeTable } from '../../../components/tables/mock/components/expositionDegree/section/expositionDegreeTable';
import { matrizTable } from '../../../components/tables/mock/components/matriz/table.component';
import { measureHierarchyImage } from '../../../components/images/measureHierarch';
import { rsDocumentImage } from '../../../components/images/rsDocument';
import { quantityResultsTable } from '../../../components/tables/mock/components/quantityResults/section/quantityResultsTable';
import { considerationsQuantityTable } from '../../../components/tables/mock/components/considerationsQuantity/table.component';
import { riskCharacterizationTableSection } from '../../../components/tables/riskCharacterization/riskCharacterization.section';
import { hierarchyRisksTableAllSections } from '../../../components/tables/hierarchyRisks/hierarchyRisks.section';
import { actionPlanTableSection } from '../../../components/tables/actionPlan/actionPlan.section';

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
    //!
    //! [DocumentChildrenTypeEnum.TABLE_VERSION_CONTROL]: () => [versionControlTable(this.versions)],
    [DocumentChildrenTypeEnum.TABLE_VERSION_CONTROL]: () => [],
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
    [DocumentChildrenTypeEnum.PROFESSIONALS_SIGNATURES]: () => signaturesIterable(this.data.documentBase.professionalSignatures, this.data.documentBase.workspace, (x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.TABLE_PRIORITIZATION]: () =>
      hierarchyPrioritizationPage(
        this.riskGroupData,
        this.hierarchy,
        this.hierarchyTree,
        {
          isByGroup: true,
        },
        (x, v) => this.convertToDocx(x as unknown as any[], v as unknown as any),
      ),
    [DocumentChildrenTypeEnum.TABLE_PRIORITIZATION_HIERARCHY]: () =>
      hierarchyPrioritizationPage(
        this.riskGroupData,
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
        this.riskGroupData,
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
        this.riskGroupData,
        this.hierarchy,
        this.hierarchyTree,
        {
          isByGroup: true,
          homoType: [HomoTypeEnum.ACTIVITIES, HomoTypeEnum.EQUIPMENT, HomoTypeEnum.WORKSTATION],
        },
        (x, v) => this.convertToDocx(x, v),
      ),
    [DocumentChildrenTypeEnum.TABLE_QUANTITY_NOISE]: () => [quantityNoiseTable(this.documentRiskData, this.hierarchyTree)],
    [DocumentChildrenTypeEnum.TABLE_QUANTITY_HEAT]: () => [quantityHeatTable(this.documentRiskData, this.hierarchyTree)],
    [DocumentChildrenTypeEnum.TABLE_QUANTITY_VFB]: () => [quantityVFBTable(this.documentRiskData, this.hierarchyTree)],
    [DocumentChildrenTypeEnum.TABLE_QUANTITY_VL]: () => [quantityVLTable(this.documentRiskData, this.hierarchyTree)],
    [DocumentChildrenTypeEnum.TABLE_QUANTITY_RAD]: () => [quantityRadTable(this.documentRiskData, this.hierarchyTree)],
    [DocumentChildrenTypeEnum.TABLE_QUANTITY_QUI]: () => [quantityQuiTable(this.documentRiskData, this.hierarchyTree)],
    [DocumentChildrenTypeEnum.ITERABLE_QUALITY_FIS]: () =>
      bulletTextIterable(
        removeDuplicate(
          (this.riskGroupData || [])
            .map(({ riskData }) => !!(riskData.risk.type === RiskTypeEnum.FIS) && riskData.risk.name)
            .filter((x) => x) as unknown as string[],
        ),
        (x, v) => this.convertToDocx(x, v),
      ),
    [DocumentChildrenTypeEnum.ITERABLE_QUALITY_QUI]: () =>
      bulletTextIterable(
        removeDuplicate(
          (this.riskGroupData || [])
            .map(({ riskData }) => !!(riskData.risk.type === RiskTypeEnum.QUI) && riskData.risk.name)
            .filter((x) => x) as unknown as string[],
        ),
        (x, v) => this.convertToDocx(x, v),
      ),
    [DocumentChildrenTypeEnum.ITERABLE_QUALITY_BIO]: () =>
      bulletTextIterable(
        removeDuplicate(
          (this.riskGroupData || [])
            .map(({ riskData }) => !!(riskData.risk.type === RiskTypeEnum.BIO) && riskData.risk.name)
            .filter((x) => x) as unknown as string[],
        ),
        (x, v) => this.convertToDocx(x, v),
      ),
    [DocumentChildrenTypeEnum.ITERABLE_QUALITY_ERG]: () =>
      bulletTextIterable(
        removeDuplicate(
          (this.riskGroupData || [])
            .map(({ riskData }) => !!(riskData.risk.type === RiskTypeEnum.ERG) && riskData.risk.name)
            .filter((x) => x) as unknown as string[],
        ),
        (x, v) => this.convertToDocx(x, v),
      ),
    [DocumentChildrenTypeEnum.ITERABLE_QUALITY_ACI]: () =>
      bulletTextIterable(
        removeDuplicate(
          (this.riskGroupData || [])
            .map(({ riskData }) => !!(riskData.risk.type === RiskTypeEnum.ACI) && riskData.risk.name)
            .filter((x) => x) as unknown as string[],
        ),
        (x, v) => this.convertToDocx(x, v),
      ),
    [DocumentChildrenTypeEnum.PROFESSIONAL]: () => professionalsIterable(this.data.documentBase.professionalSignatures, (x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.COMPLEMENTARY_DOCS]: () => complementaryDocsIterable(this.data.documentBase.data.complementaryDocs || [], (x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.COMPLEMENTARY_SYSTEMS]: () => complementarySystemsIterable(this.data.documentBase.data.complementarySystems || [], (x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.ITERABLE_RECOMMENDATIONS]: () => recommendationsIterable(this.riskGroupData, (x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.ITERABLE_EMERGENCY_RISKS]: () => emergencyIterable(this.riskGroupData, (x, v) => this.convertToDocx(x, v)),
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
    [DocumentChildrenTypeEnum.RISK_TABLE]: () => riskCharacterizationTableSection(this.data.risksData, this.data.getRiskDataExams)['children'],
    [DocumentChildrenTypeEnum.HIERARCHY_RISK_TABLE]: () =>
      hierarchyRisksTableAllSections(this.riskGroupData, this.hierarchy, this.hierarchyTree, (x, v) =>
        this.convertToDocx(x, v),
      ),
    [DocumentChildrenTypeEnum.PLAN_TABLE]: () => actionPlanTableSection(this.riskGroupData, this.data.documentVersion, this.hierarchyTree)['children'],
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


  private get hierarchyData() {
    const homoMap = this.data.homogeneousGroupsMap;

    const hierarchiesData = this.data.hierarchies
      .map((hierarchy) => ({
        ...hierarchy,
        ...(hierarchy.groups?.length && {
          hierarchyOnHomogeneous: hierarchy.groups.map((hh) => {
            const homogeneousGroup = homoMap[hh.homogeneousGroupId]!;

            return { ...hh, homogeneousGroup };
          }),
        }),
      }))
      .map((hierarchy) => {
        const hierarchyCopy = { ...hierarchy } as unknown as IHierarchyDataConverter;
        hierarchyCopy.homogeneousGroups = hierarchy.hierarchyOnHomogeneous?.map((homo) => homo.homogeneousGroup) || [];

        return hierarchyCopy;
      });

    const { hierarchyData, hierarchyHighLevelsData, homoGroupTree, hierarchyTree, riskGroupData } = hierarchyConverter(
      hierarchiesData,
      this.data.homogeneousGroups,
      this.data.documentBase.workspace,
      this.data.documentBase.company,
      'isPGR'
    );

    return {
      hierarchyData,
      hierarchyHighLevelsData,
      homoGroupTree,
      hierarchyTree,
      riskGroupData
    }
  }
  private get hierarchy() {
    return this.hierarchyData.hierarchyData
  }
  private get homogeneousGroup() {
    return this.hierarchyData.homoGroupTree
  }
  private get hierarchyTree() {
    return this.hierarchyData.hierarchyTree
  }
  private get riskGroupData() {
    return this.hierarchyData.riskGroupData
  }
  private get documentRiskData() {
    return {
      riskGroupData: this.hierarchyData.riskGroupData,
      documentVersion: this.data.documentVersion
    }
  }
}
