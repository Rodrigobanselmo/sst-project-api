import { IImagesMap } from './../../../../factories/document/types/IDocumentFactory.types';
import { DocumentDataEntity } from './../../../../../sst/entities/documentData.entity';
import { DocumentDataPGRDto } from './../../../../../sst/dto/document-data-pgr.dto';
import { WorkspaceEntity } from './../../../../../company/entities/workspace.entity';
import { CompanyEntity } from './../../../../../company/entities/company.entity';
import { HomoTypeEnum, RiskFactorsEnum } from '@prisma/client';
import { Paragraph, Table } from 'docx';

import { removeDuplicate } from '../../../../../../shared/utils/removeDuplicate';
import { RiskDocumentEntity } from '../../../../../sst/entities/riskDocument.entity';
import { bulletsNormal, bulletsSpace } from '../../../base/elements/bullets';
import { h1, h2, h3, h4, h5, h6, title } from '../../../base/elements/heading';
import { pageBreak, paragraphNewNormal, paragraphNormal, paragraphTableLegend } from '../../../base/elements/paragraphs';
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
import { actionPlanTableSection } from '../../../components/tables/actionPlan/actionPlan.section';
import { hierarchyHomoOrgSection } from '../../../components/tables/hierarchyHomoOrg/hierarchyHomoOrg.section';
import { hierarchyPrioritizationPage } from '../../../components/tables/hierarchyPrioritization/hierarchyPrioritization.page';
import { hierarchyRisksTableAllSections } from '../../../components/tables/hierarchyRisks/hierarchyRisks.section';
import { expositionDegreeTable } from '../../../components/tables/mock/components/expositionDegree/section/expositionDegreeTable';
import { healthEffectTable } from '../../../components/tables/mock/components/healthSeverity/section/healthEffectTable';
import { matrizTable } from '../../../components/tables/mock/components/matriz/table.component';
import { quantityResultsTable } from '../../../components/tables/mock/components/quantityResults/section/quantityResultsTable';
import { quantityHeatTable } from '../../../components/tables/quantity/quantityHeat/quantityHeat.table';
import { quantityNoiseTable } from '../../../components/tables/quantity/quantityNoise/quantityNoise.table';
import { quantityQuiTable } from '../../../components/tables/quantity/quantityQui/quantityQui.table';
import { quantityRadTable } from '../../../components/tables/quantity/quantityRad/quantityRad.table';
import { quantityVFBTable } from '../../../components/tables/quantity/quantityVFB/quantityVFB.table';
import { quantityVLTable } from '../../../components/tables/quantity/quantityVL/quantityVL.table';
import { riskCharacterizationTableSection } from '../../../components/tables/riskCharacterization/riskCharacterization.section';
import { versionControlTable } from '../../../components/tables/versionControl/versionControl.table';
import { HierarchyMapData, IHierarchyMap, IHomoGroupMap } from '../../../converter/hierarchy.converter';
import { convertToDocxHelper } from '../functions/convertToDocx';
import { IBreak, IBullet, IH1, IH2, IH3, IH4, IH5, IH6, IParagraph, ISectionChildrenType, ITitle, DocumentSectionChildrenTypeEnum, IImage } from '../types/elements.types';
import { IDocVariables } from '../types/section.types';
import { AttachmentEntity } from '../../../../../sst/entities/attachment.entity';
import { RiskFactorGroupDataEntity } from '../../../../../sst/entities/riskGroupData.entity';
import { CharacterizationEntity } from './../../../../../company/entities/characterization.entity';
import { ProfessionalEntity } from './../../../../../users/entities/professional.entity';
import { UserEntity } from './../../../../../users/entities/user.entity';
import { paragraphFigure, paragraphTable } from './../../../base/elements/paragraphs';
import { considerationsQuantityTable } from '../../../components/tables/mock/components/considerationsQuantity/table.component';
import { imageDoc } from '../../../components/images/image';

export type IMapElementDocumentType = Record<string, (arg: ISectionChildrenType) => (Paragraph | Table)[]>;

type IDocumentClassType = {
  variables: IDocVariables;
  versions: RiskDocumentEntity[];
  professionals: ProfessionalEntity[];
  environments: CharacterizationEntity[];
  document: RiskFactorGroupDataEntity & DocumentDataEntity & DocumentDataPGRDto;
  homogeneousGroup: IHomoGroupMap;
  hierarchy: Map<string, HierarchyMapData>;
  characterizations: CharacterizationEntity[];
  attachments: AttachmentEntity[];
  workspace: WorkspaceEntity;
  hierarchyTree: IHierarchyMap;
  imagesMap?: IImagesMap;
};

export class ElementsMapClass {
  private variables: IDocVariables;
  private versions: RiskDocumentEntity[];
  private workspace: WorkspaceEntity;
  private professionals: ProfessionalEntity[];
  private environments: CharacterizationEntity[];
  private characterizations: CharacterizationEntity[];
  private document: RiskFactorGroupDataEntity & DocumentDataEntity & DocumentDataPGRDto;
  private attachments: AttachmentEntity[];
  private homogeneousGroup: IHomoGroupMap;
  private hierarchy: Map<string, HierarchyMapData>;
  private hierarchyTree: IHierarchyMap;
  private imagesMap?: IImagesMap;

  constructor({
    variables,
    versions,
    professionals,
    characterizations,
    environments,
    document,
    homogeneousGroup,
    hierarchy,
    attachments,
    hierarchyTree,
    workspace,
    imagesMap,
  }: IDocumentClassType) {
    this.variables = variables;
    this.versions = versions;
    this.professionals = professionals;
    this.environments = environments;
    this.characterizations = characterizations;
    this.document = document;
    this.homogeneousGroup = homogeneousGroup;
    this.hierarchy = hierarchy;
    this.attachments = attachments;
    this.hierarchyTree = hierarchyTree;
    this.workspace = workspace;
    this.imagesMap = imagesMap;
  }

  public map: IMapElementDocumentType = {
    [DocumentSectionChildrenTypeEnum.H1]: ({ text }: IH1) => [h1(text)],
    [DocumentSectionChildrenTypeEnum.H2]: ({ text }: IH2) => [h2(text)],
    [DocumentSectionChildrenTypeEnum.H3]: ({ text }: IH3) => [h3(text)],
    [DocumentSectionChildrenTypeEnum.H4]: ({ text }: IH4) => [h4(text)],
    [DocumentSectionChildrenTypeEnum.H5]: ({ text }: IH5) => [h5(text)],
    [DocumentSectionChildrenTypeEnum.H6]: ({ text }: IH6) => [h6(text)],
    [DocumentSectionChildrenTypeEnum.BREAK]: ({ }: IBreak) => [pageBreak()],
    [DocumentSectionChildrenTypeEnum.TITLE]: ({ text }: ITitle) => [title(text)],
    [DocumentSectionChildrenTypeEnum.PARAGRAPH]: ({ text, ...rest }: IParagraph) => [paragraphNewNormal(text, rest)],
    [DocumentSectionChildrenTypeEnum.IMAGE]: (data: IImage) => imageDoc(data, this.imagesMap),
    [DocumentSectionChildrenTypeEnum.LEGEND]: ({ text, ...rest }: IParagraph) => [paragraphTableLegend(text, rest)],
    [DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE]: ({ text, ...rest }: IParagraph) => [paragraphTable(text, rest)],
    [DocumentSectionChildrenTypeEnum.PARAGRAPH_FIGURE]: ({ text, ...rest }: IParagraph) => [paragraphFigure(text, rest)],
    [DocumentSectionChildrenTypeEnum.BULLET]: ({ level = 0, text, ...rest }: IBullet) => [bulletsNormal(text, level, rest)],
    [DocumentSectionChildrenTypeEnum.BULLET_SPACE]: ({ text }: IBullet) => [bulletsSpace(text)],
    [DocumentSectionChildrenTypeEnum.TABLE_VERSION_CONTROL]: () => [versionControlTable(this.versions)],
    [DocumentSectionChildrenTypeEnum.TABLE_GSE]: () =>
      hierarchyHomoOrgSection(this.hierarchy, this.homogeneousGroup, {
        showDescription: false,
        showHomogeneous: true,
        showHomogeneousDescription: true,
      })['children'],
    [DocumentSectionChildrenTypeEnum.TABLE_HIERARCHY_ENV]: () =>
      hierarchyHomoOrgSection(this.hierarchy, this.homogeneousGroup, {
        showDescription: false,
        showHomogeneous: true,
        type: HomoTypeEnum.ENVIRONMENT,
      })['children'],
    [DocumentSectionChildrenTypeEnum.TABLE_HIERARCHY_CHAR]: () =>
      hierarchyHomoOrgSection(this.hierarchy, this.homogeneousGroup, {
        showDescription: false,
        showHomogeneous: true,
        type: [HomoTypeEnum.ACTIVITIES, HomoTypeEnum.EQUIPMENT, HomoTypeEnum.WORKSTATION],
      })['children'],
    [DocumentSectionChildrenTypeEnum.PROFESSIONALS_SIGNATURES]: () => signaturesIterable(this.professionals, this.workspace, (x, v) => this.convertToDocx(x, v)),
    [DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION]: () =>
      hierarchyPrioritizationPage(
        this.document,
        this.hierarchy,
        this.hierarchyTree,
        {
          isByGroup: true,
        },
        (x, v) => this.convertToDocx(x, v),
      ),
    [DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION_HIERARCHY]: () =>
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
    [DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION_ENV]: () =>
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
    [DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION_CHAR]: () =>
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
    [DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_NOISE]: () => [quantityNoiseTable(this.document, this.hierarchyTree)],
    [DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_HEAT]: () => [quantityHeatTable(this.document, this.hierarchyTree)],
    [DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_VFB]: () => [quantityVFBTable(this.document, this.hierarchyTree)],
    [DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_VL]: () => [quantityVLTable(this.document, this.hierarchyTree)],
    [DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_RAD]: () => [quantityRadTable(this.document, this.hierarchyTree)],
    [DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_QUI]: () => [quantityQuiTable(this.document, this.hierarchyTree)],
    [DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_FIS]: () =>
      bulletTextIterable(
        removeDuplicate(
          (this.document?.data || []).map((riskData) => !!(riskData.riskFactor.type === RiskFactorsEnum.FIS) && riskData.riskFactor.name).filter((x) => x),
          { simpleCompare: true },
        ),
        (x, v) => this.convertToDocx(x, v),
      ),
    [DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_QUI]: () =>
      bulletTextIterable(
        removeDuplicate(
          (this.document?.data || []).map((riskData) => !!(riskData.riskFactor.type === RiskFactorsEnum.QUI) && riskData.riskFactor.name).filter((x) => x),
          { simpleCompare: true },
        ),
        (x, v) => this.convertToDocx(x, v),
      ),
    [DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_BIO]: () =>
      bulletTextIterable(
        removeDuplicate(
          (this.document?.data || []).map((riskData) => !!(riskData.riskFactor.type === RiskFactorsEnum.BIO) && riskData.riskFactor.name).filter((x) => x),
          { simpleCompare: true },
        ),
        (x, v) => this.convertToDocx(x, v),
      ),
    [DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_ERG]: () =>
      bulletTextIterable(
        removeDuplicate(
          (this.document?.data || []).map((riskData) => !!(riskData.riskFactor.type === RiskFactorsEnum.ERG) && riskData.riskFactor.name).filter((x) => x),
          { simpleCompare: true },
        ),
        (x, v) => this.convertToDocx(x, v),
      ),
    [DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_ACI]: () =>
      bulletTextIterable(
        removeDuplicate(
          (this.document?.data || []).map((riskData) => !!(riskData.riskFactor.type === RiskFactorsEnum.ACI) && riskData.riskFactor.name).filter((x) => x),
          { simpleCompare: true },
        ),
        (x, v) => this.convertToDocx(x, v),
      ),
    [DocumentSectionChildrenTypeEnum.PROFESSIONAL]: () => professionalsIterable(this.professionals, this.workspace, (x, v) => this.convertToDocx(x, v)),
    [DocumentSectionChildrenTypeEnum.COMPLEMENTARY_DOCS]: () => complementaryDocsIterable(this.document.complementaryDocs || [], (x, v) => this.convertToDocx(x, v)),
    [DocumentSectionChildrenTypeEnum.COMPLEMENTARY_SYSTEMS]: () =>
      complementarySystemsIterable(this.document.complementarySystems || [], (x, v) => this.convertToDocx(x, v)),
    [DocumentSectionChildrenTypeEnum.ITERABLE_RECOMMENDATIONS]: () => recommendationsIterable(this.document?.data || [], (x, v) => this.convertToDocx(x, v)),
    [DocumentSectionChildrenTypeEnum.ITERABLE_EMERGENCY_RISKS]: () => emergencyIterable(this.document?.data || [], (x, v) => this.convertToDocx(x, v)),
    [DocumentSectionChildrenTypeEnum.ATTACHMENTS]: () => attachmentsIterable(this.attachments || [], (x, v) => this.convertToDocx(x, v)),
    [DocumentSectionChildrenTypeEnum.HEALTH_EFFECT_TABLES]: () => healthEffectTable((x, v) => this.convertToDocx(x, v)),
    [DocumentSectionChildrenTypeEnum.EXPOSITION_DEGREE_TABLES]: () => expositionDegreeTable((x, v) => this.convertToDocx(x, v)),
    [DocumentSectionChildrenTypeEnum.MATRIX_TABLES]: () => [matrizTable()],
    [DocumentSectionChildrenTypeEnum.MEASURE_IMAGE]: () => measureHierarchyImage(),
    [DocumentSectionChildrenTypeEnum.RS_IMAGE]: () => rsDocumentImage(),
    [DocumentSectionChildrenTypeEnum.QUANTITY_RESULTS_TABLES]: () => quantityResultsTable((x, v) => this.convertToDocx(x, v)),
    [DocumentSectionChildrenTypeEnum.QUANTITY_CONSIDERATION_TABLES]: () => considerationsQuantityTable((x, v) => this.convertToDocx(x, v)),
    [DocumentSectionChildrenTypeEnum.HIERARCHY_ORG_TABLE]: () =>
      hierarchyHomoOrgSection(this.hierarchy, this.homogeneousGroup, {
        showDescription: false,
        showHomogeneous: false,
        showHomogeneousDescription: false,
      })['children'],
    [DocumentSectionChildrenTypeEnum.RISK_TABLE]: () => riskCharacterizationTableSection(this.document)['children'],
    [DocumentSectionChildrenTypeEnum.HIERARCHY_RISK_TABLE]: () =>
      hierarchyRisksTableAllSections(this.document, this.hierarchy, this.hierarchyTree, (x, v) => this.convertToDocx(x, v)),
    [DocumentSectionChildrenTypeEnum.PLAN_TABLE]: () => actionPlanTableSection(this.document, this.hierarchyTree)['children'],
    // [PGRSectionChildrenTypeEnum.APR_TABLE]: () =>
    //   APPRTableSection(this.document, this.hierarchy, this.homogeneousGroup)
    //     .map((s) => s['children'])
    //     .reduce((acc, curr) => {
    //       return [...acc, ...curr];
    //     }, []),
  };

  private convertToDocx(data: ISectionChildrenType[], variables = {} as IDocVariables) {
    return data
      .map((child) => {
        const childData = convertToDocxHelper(child, {
          ...this.variables,
          ...variables,
        });
        if (!childData) return null;

        return this.map[childData.type](childData);
      })
      .filter((x) => x)
      .reduce((acc, curr) => {
        return [...acc, ...curr];
      }, []);
  }
}
