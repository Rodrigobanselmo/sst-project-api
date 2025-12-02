import { DocumentChildrenTypeEnum } from '@/@v2/documents/domain/enums/document-children-type.enum';
import { AttachmentModel } from '@/@v2/documents/domain/models/attachment.model';
import { DocumentPGRModel } from '@/@v2/documents/domain/models/document-pgr.model';
import { IBreak, IBullet, IH1, IH2, IH3, IH4, IH5, IH6, IImage, IParagraph, ISectionChildrenType, ITitle } from '@/@v2/documents/domain/types/elements.types';
import { HomoTypeEnum } from '@/@v2/shared/domain/enum/security/homo-type.enum';
import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';
import { removeDuplicate } from '@/@v2/shared/utils/helpers/remove-duplicate';
import { Paragraph, Table } from 'docx';
import { bulletsNormal, bulletsSpace } from '../../../base/elements/bullets';
import { h1, h2, h3, h4, h5, h6, title } from '../../../base/elements/heading';
import { pageBreak, paragraphFigure, paragraphNewNormal, paragraphTable, paragraphTableLegend } from '../../../base/elements/paragraphs';
import { imageDoc } from '../../../components/images/image';
import { measureHierarchyImage } from '../../../components/images/measureHierarch';
import { rsDocumentImage } from '../../../components/images/rsDocument';
import { attachmentsIterable } from '../../../components/iterables/attachments/attachments.iterable';
import { bulletTextIterable } from '../../../components/iterables/bullets/bullets.iterable';
import { complementaryDocsIterable } from '../../../components/iterables/complementaryDocs/complementaryDocs.iterable';
import { complementarySystemsIterable } from '../../../components/iterables/complementarySystems/complementarySystems.iterable';
import { emergencyIterable } from '../../../components/iterables/emergency/emergency.iterable';
import { professionalsIterable } from '../../../components/iterables/professionals/professionals.iterable';
import { recommendationsIterable } from '../../../components/iterables/recommendations/recommendations.iterable';
import { signaturesIterable } from '../../../components/iterables/signatures/signatures.iterable';
import { considerationsQuantityTable } from '../../../components/tables/@mock/components/considerationsQuantity/table.component';
import { expositionDegreeTable } from '../../../components/tables/@mock/components/expositionDegree/section/expositionDegreeTable';
import { healthEffectTable } from '../../../components/tables/@mock/components/healthSeverity/section/healthEffectTable';
import { matrizTable } from '../../../components/tables/@mock/components/matriz/table.component';
import { quantityResultsTable } from '../../../components/tables/@mock/components/quantityResults/section/quantityResultsTable';
import { actionPlanTableSection } from '../../../components/tables/actionPlan/actionPlan.section';
import { hierarchyHomoOrgSection } from '../../../components/tables/hierarchyHomoOrg/hierarchyHomoOrg.section';
import { hierarchyPrioritizationPage } from '../../../components/tables/hierarchyPrioritization/hierarchyPrioritization.page';
import { hierarchyRisksTableAllSections } from '../../../components/tables/hierarchyRisks/hierarchyRisks.section';
import { quantityHeatTable } from '../../../components/tables/quantity/quantityHeat/quantityHeat.table';
import { quantityNoiseTable } from '../../../components/tables/quantity/quantityNoise/quantityNoise.table';
import { quantityQuiTable } from '../../../components/tables/quantity/quantityQui/quantityQui.table';
import { quantityRadTable } from '../../../components/tables/quantity/quantityRad/quantityRad.table';
import { quantityVFBTable } from '../../../components/tables/quantity/quantityVFB/quantityVFB.table';
import { quantityVLTable } from '../../../components/tables/quantity/quantityVL/quantityVL.table';
import { riskCharacterizationTableSection } from '../../../components/tables/riskCharacterization/riskCharacterization.section';
import { dataConverter } from '../../../converter/data.converter';
import { convertToDocxHelper } from '../functions/convertToDocx';
import { IDocVariables } from '../types/documet-section-groups.types';
import { versionControlTable } from '../../../components/tables/versionControl/versionControl.table';
import { controlMeasuresEngIterable } from '../../../components/iterables/controlMeasuresEng/control-measures-eng.iterable';
import { controlMeasuresAdmIterable } from '../../../components/iterables/controlMeasuresAdm/control-measures-adm.iterable';
import { controlMeasuresEpiIterable } from '../../../components/iterables/controlMeasuresEpi/control-measures-epi.iterable';
import { activitiesPericulosidadeElements } from '../../../components/iterables/activities-periculosidade/activities-periculosidade.elements';

export type IMapElementDocumentType = Record<string, (arg: any) => (Paragraph | Table)[]>;

type IDocumentClassType = {
  data: DocumentPGRModel;
  variables: IDocVariables;
  attachments: AttachmentModel[];
};

export class ElementsMapClass {
  private data: DocumentPGRModel;
  private variables: IDocVariables;
  private attachments: AttachmentModel[];

  constructor({ data, variables, attachments }: IDocumentClassType) {
    this.data = data;
    this.variables = variables;
    this.attachments = attachments;
  }

  public map: IMapElementDocumentType = {
    [DocumentChildrenTypeEnum.H1]: ({ text }: IH1) => [h1(text)],
    [DocumentChildrenTypeEnum.H2]: ({ text }: IH2) => [h2(text)],
    [DocumentChildrenTypeEnum.H3]: ({ text }: IH3) => [h3(text)],
    [DocumentChildrenTypeEnum.H4]: ({ text }: IH4) => [h4(text)],
    [DocumentChildrenTypeEnum.H5]: ({ text }: IH5) => [h5(text)],
    [DocumentChildrenTypeEnum.H6]: ({ text }: IH6) => [h6(text)],
    [DocumentChildrenTypeEnum.BREAK]: ({}: IBreak) => [pageBreak()],
    [DocumentChildrenTypeEnum.TITLE]: ({ text }: ITitle) => [title(text)],
    [DocumentChildrenTypeEnum.PARAGRAPH]: ({ text, ...rest }: IParagraph) => [paragraphNewNormal(text, rest)],
    [DocumentChildrenTypeEnum.IMAGE]: (data: IImage) => imageDoc(data),
    [DocumentChildrenTypeEnum.LEGEND]: ({ text, ...rest }: IParagraph) => [paragraphTableLegend(text, rest)],
    [DocumentChildrenTypeEnum.PARAGRAPH_TABLE]: ({ text, ...rest }: IParagraph) => [paragraphTable(text, rest)],
    [DocumentChildrenTypeEnum.PARAGRAPH_FIGURE]: ({ text, ...rest }: IParagraph) => {
      const figure = paragraphFigure(text, rest);
      if (figure) return [figure];
      return [];
    },
    [DocumentChildrenTypeEnum.BULLET]: ({ level = 0, text, ...rest }: IBullet) => [bulletsNormal(text, level, rest)],
    [DocumentChildrenTypeEnum.BULLET_SPACE]: ({ text }: IBullet) => [bulletsSpace(text)],
    [DocumentChildrenTypeEnum.TABLE_VERSION_CONTROL]: () => [versionControlTable(this.data.documentBase.versions)],
    [DocumentChildrenTypeEnum.TABLE_GSE]: () =>
      hierarchyHomoOrgSection(this.OldHierarchy, this.OldHomogeneousGroup, {
        showDescription: false,
        showHomogeneous: true,
        showHomogeneousDescription: true,
      })['children'],
    [DocumentChildrenTypeEnum.TABLE_HIERARCHY_ENV]: () =>
      hierarchyHomoOrgSection(this.OldHierarchy, this.OldHomogeneousGroup, {
        showDescription: false,
        showHomogeneous: true,
        type: HomoTypeEnum.ENVIRONMENT,
      })['children'],
    [DocumentChildrenTypeEnum.TABLE_HIERARCHY_CHAR]: () =>
      hierarchyHomoOrgSection(this.OldHierarchy, this.OldHomogeneousGroup, {
        showDescription: false,
        showHomogeneous: true,
        type: [HomoTypeEnum.ACTIVITIES, HomoTypeEnum.EQUIPMENT, HomoTypeEnum.WORKSTATION],
      })['children'],
    [DocumentChildrenTypeEnum.PROFESSIONALS_SIGNATURES]: () => signaturesIterable(this.data.documentBase.professionalSignatures, (x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.TABLE_PRIORITIZATION]: () =>
      hierarchyPrioritizationPage(
        this.oldRiskGroupData,
        this.OldHierarchy,
        this.oldHierarchyTree,
        {
          isByGroup: true,
        },
        (x, v) => this.convertToDocx(x as unknown as any[], v as unknown as any),
      ),
    [DocumentChildrenTypeEnum.TABLE_PRIORITIZATION_HIERARCHY]: () =>
      hierarchyPrioritizationPage(
        this.oldRiskGroupData,
        this.OldHierarchy,
        this.oldHierarchyTree,
        {
          isByGroup: true,
          homoType: HomoTypeEnum.HIERARCHY,
        },
        (x, v) => this.convertToDocx(x, v),
      ),
    [DocumentChildrenTypeEnum.TABLE_PRIORITIZATION_ENV]: () =>
      hierarchyPrioritizationPage(
        this.oldRiskGroupData,
        this.OldHierarchy,
        this.oldHierarchyTree,
        {
          isByGroup: true,
          homoType: HomoTypeEnum.ENVIRONMENT,
        },
        (x, v) => this.convertToDocx(x, v),
      ),
    [DocumentChildrenTypeEnum.TABLE_PRIORITIZATION_CHAR]: () =>
      hierarchyPrioritizationPage(
        this.oldRiskGroupData,
        this.OldHierarchy,
        this.oldHierarchyTree,
        {
          isByGroup: true,
          homoType: [HomoTypeEnum.ACTIVITIES, HomoTypeEnum.EQUIPMENT, HomoTypeEnum.WORKSTATION],
        },
        (x, v) => this.convertToDocx(x, v),
      ),
    [DocumentChildrenTypeEnum.TABLE_QUANTITY_NOISE]: () => [quantityNoiseTable(this.oldDocumentRiskData, this.oldHierarchyTree)],
    [DocumentChildrenTypeEnum.TABLE_QUANTITY_HEAT]: () => [quantityHeatTable(this.oldDocumentRiskData, this.oldHierarchyTree)],
    [DocumentChildrenTypeEnum.TABLE_QUANTITY_VFB]: () => [quantityVFBTable(this.oldDocumentRiskData, this.oldHierarchyTree)],
    [DocumentChildrenTypeEnum.TABLE_QUANTITY_VL]: () => [quantityVLTable(this.oldDocumentRiskData, this.oldHierarchyTree)],
    [DocumentChildrenTypeEnum.TABLE_QUANTITY_RAD]: () => [quantityRadTable(this.oldDocumentRiskData, this.oldHierarchyTree)],
    [DocumentChildrenTypeEnum.TABLE_QUANTITY_QUI]: () => [quantityQuiTable(this.oldDocumentRiskData, this.oldHierarchyTree)],
    [DocumentChildrenTypeEnum.ITERABLE_QUALITY_FIS]: () =>
      bulletTextIterable(
        removeDuplicate((this.oldRiskGroupData || []).map(({ riskData }) => !!(riskData.risk.type === RiskTypeEnum.FIS) && riskData.risk.name).filter((x) => x) as unknown as string[]),
        (x, v) => this.convertToDocx(x, v),
      ),
    [DocumentChildrenTypeEnum.ITERABLE_QUALITY_QUI]: () =>
      bulletTextIterable(
        removeDuplicate((this.oldRiskGroupData || []).map(({ riskData }) => !!(riskData.risk.type === RiskTypeEnum.QUI) && riskData.risk.name).filter((x) => x) as unknown as string[]),
        (x, v) => this.convertToDocx(x, v),
      ),
    [DocumentChildrenTypeEnum.ITERABLE_QUALITY_BIO]: () =>
      bulletTextIterable(
        removeDuplicate((this.oldRiskGroupData || []).map(({ riskData }) => !!(riskData.risk.type === RiskTypeEnum.BIO) && riskData.risk.name).filter((x) => x) as unknown as string[]),
        (x, v) => this.convertToDocx(x, v),
      ),
    [DocumentChildrenTypeEnum.ITERABLE_QUALITY_ERG]: () =>
      bulletTextIterable(
        removeDuplicate((this.oldRiskGroupData || []).map(({ riskData }) => !!(riskData.risk.type === RiskTypeEnum.ERG) && riskData.risk.name).filter((x) => x) as unknown as string[]),
        (x, v) => this.convertToDocx(x, v),
      ),
    [DocumentChildrenTypeEnum.ITERABLE_QUALITY_ACI]: () =>
      bulletTextIterable(
        removeDuplicate((this.oldRiskGroupData || []).map(({ riskData }) => !!(riskData.risk.type === RiskTypeEnum.ACI) && riskData.risk.name).filter((x) => x) as unknown as string[]),
        (x, v) => this.convertToDocx(x, v),
      ),
    [DocumentChildrenTypeEnum.PROFESSIONAL]: () => professionalsIterable(this.data.documentBase.professionalSignatures, (x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.COMPLEMENTARY_DOCS]: () => complementaryDocsIterable(this.data.documentBase.data.complementaryDocs || [], (x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.COMPLEMENTARY_SYSTEMS]: () => complementarySystemsIterable(this.data.documentBase.data.complementarySystems || [], (x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.ITERABLE_RECOMMENDATIONS]: () => recommendationsIterable(this.oldRiskGroupData, (x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.ITERABLE_CONTROL_MEASURES]: () => controlMeasuresEngIterable(this.data, (x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.ITERABLE_OTHER_CONTROL_MEASURES]: () => controlMeasuresAdmIterable(this.data, (x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.ITERABLE_EPI_CONTROL_MEASURES]: () => controlMeasuresEpiIterable(this.data, this.variables, (x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.ITERABLE_EMERGENCY_RISKS]: () => emergencyIterable(this.oldRiskGroupData, (x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.ATTACHMENTS]: () => attachmentsIterable(this.attachments || [], (x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.HEALTH_EFFECT_TABLES]: () => healthEffectTable((x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.EXPOSITION_DEGREE_TABLES]: () => expositionDegreeTable((x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.MATRIX_TABLES]: () => [matrizTable()],
    [DocumentChildrenTypeEnum.MEASURE_IMAGE]: () => measureHierarchyImage(),
    [DocumentChildrenTypeEnum.RS_IMAGE]: () => rsDocumentImage(),
    [DocumentChildrenTypeEnum.QUANTITY_RESULTS_TABLES]: () => quantityResultsTable((x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.QUANTITY_CONSIDERATION_TABLES]: () => considerationsQuantityTable((x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.HIERARCHY_ORG_TABLE]: () =>
      hierarchyHomoOrgSection(this.OldHierarchy, this.OldHomogeneousGroup, {
        showDescription: false,
        showHomogeneous: false,
        showHomogeneousDescription: false,
      })['children'],
    [DocumentChildrenTypeEnum.RISK_TABLE]: () => riskCharacterizationTableSection(this.data.risksData, this.data.getExamsByRiskData.bind(this.data))['children'],
    [DocumentChildrenTypeEnum.HIERARCHY_RISK_TABLE]: () => hierarchyRisksTableAllSections(this.oldRiskGroupData, this.OldHierarchy, this.oldHierarchyTree, (x, v) => this.convertToDocx(x, v)),
    [DocumentChildrenTypeEnum.PLAN_TABLE]: () => actionPlanTableSection(this.oldDocumentRiskData, this.oldHierarchyTree)['children'],
    [DocumentChildrenTypeEnum.PERICULOSIDADE_ACTIVITIES]: () =>
      activitiesPericulosidadeElements(this.data, this.OldHierarchy, this.OldHomogeneousGroup, this.oldHierarchyTree, (x: ISectionChildrenType[]) => this.convertToDocx(x)),
  };

  private convertToDocx(data: ISectionChildrenType[], variables = {} as IDocVariables) {
    const components: (Paragraph | Table)[] = [];

    data.forEach((child) => {
      const childData = convertToDocxHelper(child, {
        ...this.variables,
        ...variables,
      });

      if (!childData) return null;
      components.push(...this.map[childData.type](childData));
    });

    return components;
  }

  private get oldData() {
    const data = dataConverter({ data: this.data });
    return data;
  }
  private get OldHierarchy() {
    return this.oldData.hierarchyData;
  }
  private get OldHomogeneousGroup() {
    return this.oldData.homoGroupTree;
  }
  private get oldHierarchyTree() {
    return this.oldData.hierarchyTree;
  }
  private get oldRiskGroupData() {
    return this.oldData.riskGroupData;
  }
  private get oldDocumentRiskData() {
    return this.oldData.documentRiskData;
  }
}
