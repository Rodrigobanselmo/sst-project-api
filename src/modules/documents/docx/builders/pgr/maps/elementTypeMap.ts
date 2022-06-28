import { RiskFactorGroupDataEntity } from './../../../../../checklist/entities/riskGroupData.entity';
import { Paragraph, Table } from 'docx';

import { RiskDocumentEntity } from '../../../../../checklist/entities/riskDocument.entity';
import { bulletsNormal, bulletsSpace } from '../../../base/elements/bullets';
import { h1, h2, h3, h4, h5, h6, title } from '../../../base/elements/heading';
import {
  pageBreak,
  paragraphNormal,
  paragraphTableLegend,
} from '../../../base/elements/paragraphs';
import { complementaryDocsIterable } from '../../../components/iterables/complementaryDocs/complementaryDocs.iterable';
import { environmentIterable } from '../../../components/iterables/environments/environments.iterable';
import { professionalsIterable } from '../../../components/iterables/professionals/professionals.iterable';
import { healthEffectTable } from '../../../components/tables/mock/components/healthSeverity/section/healthEffectTable';
import { versionControlTable } from '../../../components/tables/versionControl/versionControl.table';
import { convertToDocxHelper } from '../functions/convertToDocx';
import {
  IBreak,
  IBullet,
  IH1,
  IH2,
  IH3,
  IH4,
  IH5,
  IH6,
  IParagraph,
  ISectionChildrenType,
  ITitle,
  PGRSectionChildrenTypeEnum,
} from '../types/elements.types';
import { IDocVariables } from '../types/section.types';
import { EnvironmentEntity } from './../../../../../company/entities/environment.entity';
import { ProfessionalEntity } from './../../../../../users/entities/professional.entity';
import {
  paragraphFigure,
  paragraphTable,
} from './../../../base/elements/paragraphs';
import { expositionDegreeTable } from '../../../components/tables/mock/components/expositionDegree/section/expositionDegreeTable';
import { matrizTable } from '../../../components/tables/mock/components/matriz/table.component';
import { quantityResultsTable } from '../../../components/tables/mock/components/quantityResults/section/quantityResultsTable';
import { measureHierarchyImage } from '../../../components/images/measureHierarch';
import { rsDocumentImage } from '../../../components/images/rsDocument';
import { complementarySystemsIterable } from '../../../components/iterables/complementarySystems/complementarySystems.iterable';
import {
  HierarchyMapData,
  IHomoGroupMap,
} from '../../../converter/hierarchy.converter';
import { hierarchyHomoOrgSection } from '../../../components/tables/hierarchyHomoOrg/hierarchyHomoOrg.section';
import { hierarchyRisksTableSections } from '../../../components/tables/hierarchyRisks/hierarchyRisks.section';
import { HierarchyEnum } from '@prisma/client';
import { riskCharacterizationTableSection } from '../../../components/tables/riskCharacterization/riskCharacterization.section';

export type IMapElementDocumentType = Record<
  string,
  (arg: ISectionChildrenType) => (Paragraph | Table)[]
>;

type IDocumentClassType = {
  variables: IDocVariables;
  versions: RiskDocumentEntity[];
  professionals: ProfessionalEntity[];
  environments: EnvironmentEntity[];
  document: RiskFactorGroupDataEntity;
  homogeneousGroup: IHomoGroupMap;
  hierarchy: Map<string, HierarchyMapData>;
};

export class ElementsMapClass {
  private variables: IDocVariables;
  private versions: RiskDocumentEntity[];
  private professionals: ProfessionalEntity[];
  private document: RiskFactorGroupDataEntity;
  private environments: EnvironmentEntity[];
  private homogeneousGroup: IHomoGroupMap;
  private hierarchy: Map<string, HierarchyMapData>;

  constructor({
    variables,
    versions,
    professionals,
    environments,
    document,
    homogeneousGroup,
    hierarchy,
  }: IDocumentClassType) {
    this.variables = variables;
    this.versions = versions;
    this.professionals = professionals;
    this.environments = environments;
    this.document = document;
    this.homogeneousGroup = homogeneousGroup;
    this.hierarchy = hierarchy;
  }

  public map: IMapElementDocumentType = {
    [PGRSectionChildrenTypeEnum.H1]: ({ text }: IH1) => [h1(text)],
    [PGRSectionChildrenTypeEnum.H2]: ({ text }: IH2) => [h2(text)],
    [PGRSectionChildrenTypeEnum.H3]: ({ text }: IH3) => [h3(text)],
    [PGRSectionChildrenTypeEnum.H4]: ({ text }: IH4) => [h4(text)],
    [PGRSectionChildrenTypeEnum.H5]: ({ text }: IH5) => [h5(text)],
    [PGRSectionChildrenTypeEnum.H6]: ({ text }: IH6) => [h6(text)],
    [PGRSectionChildrenTypeEnum.BREAK]: ({}: IBreak) => [pageBreak()],
    [PGRSectionChildrenTypeEnum.TITLE]: ({ text }: ITitle) => [title(text)],
    [PGRSectionChildrenTypeEnum.PARAGRAPH]: ({ text, ...rest }: IParagraph) => [
      paragraphNormal(text, rest),
    ],
    [PGRSectionChildrenTypeEnum.LEGEND]: ({ text, ...rest }: IParagraph) => [
      paragraphTableLegend(text, rest),
    ],
    [PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE]: ({
      text,
      ...rest
    }: IParagraph) => [paragraphTable(text, rest)],
    [PGRSectionChildrenTypeEnum.PARAGRAPH_FIGURE]: ({
      text,
      ...rest
    }: IParagraph) => [paragraphFigure(text, rest)],
    [PGRSectionChildrenTypeEnum.TABLE_VERSION_CONTROL]: () => [
      versionControlTable(this.versions),
    ],
    [PGRSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS]: () =>
      environmentIterable(this.environments, (x, v) =>
        this.convertToDocx(x, v),
      ),
    [PGRSectionChildrenTypeEnum.BULLET]: ({ level, text }: IBullet) => [
      bulletsNormal(text, level),
    ],
    [PGRSectionChildrenTypeEnum.BULLET_SPACE]: ({ text }: IBullet) => [
      bulletsSpace(text),
    ],
    [PGRSectionChildrenTypeEnum.PROFESSIONAL]: () =>
      professionalsIterable(this.professionals, (x, v) =>
        this.convertToDocx(x, v),
      ),
    [PGRSectionChildrenTypeEnum.COMPLEMENTARY_DOCS]: () =>
      complementaryDocsIterable(this.document.complementaryDocs || [], (x, v) =>
        this.convertToDocx(x, v),
      ),
    [PGRSectionChildrenTypeEnum.COMPLEMENTARY_SYSTEMS]: () =>
      complementarySystemsIterable(
        this.document.complementarySystems || [],
        (x, v) => this.convertToDocx(x, v),
      ),
    [PGRSectionChildrenTypeEnum.HEALTH_EFFECT_TABLES]: () =>
      healthEffectTable((x, v) => this.convertToDocx(x, v)),
    [PGRSectionChildrenTypeEnum.EXPOSITION_DEGREE_TABLES]: () =>
      expositionDegreeTable((x, v) => this.convertToDocx(x, v)),
    [PGRSectionChildrenTypeEnum.MATRIX_TABLES]: () => [matrizTable()],
    [PGRSectionChildrenTypeEnum.MEASURE_IMAGE]: () => measureHierarchyImage(),
    [PGRSectionChildrenTypeEnum.RS_IMAGE]: () => rsDocumentImage(),
    [PGRSectionChildrenTypeEnum.QUANTITY_RESULTS_TABLES]: () =>
      quantityResultsTable((x, v) => this.convertToDocx(x, v)),
    [PGRSectionChildrenTypeEnum.HIERARCHY_ORG_TABLE]: () =>
      hierarchyHomoOrgSection(this.hierarchy, this.homogeneousGroup, {
        showDescription: false,
        showHomogeneous: false,
      })['children'],
    [PGRSectionChildrenTypeEnum.RISK_TABLE]: () =>
      riskCharacterizationTableSection(this.document)['children'],
    [PGRSectionChildrenTypeEnum.HIERARCHY_RISK_TABLE]: () =>
      hierarchyRisksTableSections(this.document, this.hierarchy, {
        hierarchyType: HierarchyEnum.SECTOR,
      })
        .map((s) => s['children'])
        .reduce((acc, curr) => {
          return [...acc, ...curr];
        }, []),
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

        return this.map[childData.type](childData);
      })
      .filter((x) => x)
      .reduce((acc, curr) => {
        return [...acc, ...curr];
      }, []);
  }
}
