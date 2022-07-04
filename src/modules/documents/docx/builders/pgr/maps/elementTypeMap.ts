import { CharacterizationEntity } from './../../../../../company/entities/characterization.entity';
import {
  CharacterizationTypeEnum,
  CompanyEnvironmentTypesEnum,
} from '@prisma/client';
import { Paragraph, Table } from 'docx';

import { RiskDocumentEntity } from '../../../../../checklist/entities/riskDocument.entity';
import { bulletsNormal, bulletsSpace } from '../../../base/elements/bullets';
import { h1, h2, h3, h4, h5, h6, title } from '../../../base/elements/heading';
import {
  pageBreak,
  paragraphNormal,
  paragraphTableLegend,
} from '../../../base/elements/paragraphs';
import { measureHierarchyImage } from '../../../components/images/measureHierarch';
import { rsDocumentImage } from '../../../components/images/rsDocument';
import { characterizationIterable } from '../../../components/iterables/characterization/characterization.iterable';
import { complementaryDocsIterable } from '../../../components/iterables/complementaryDocs/complementaryDocs.iterable';
import { complementarySystemsIterable } from '../../../components/iterables/complementarySystems/complementarySystems.iterable';
import { environmentIterable } from '../../../components/iterables/environments/environments.iterable';
import { professionalsIterable } from '../../../components/iterables/professionals/professionals.iterable';
import { hierarchyHomoOrgSection } from '../../../components/tables/hierarchyHomoOrg/hierarchyHomoOrg.section';
import { hierarchyRisksTableAllSections } from '../../../components/tables/hierarchyRisks/hierarchyRisks.section';
import { expositionDegreeTable } from '../../../components/tables/mock/components/expositionDegree/section/expositionDegreeTable';
import { healthEffectTable } from '../../../components/tables/mock/components/healthSeverity/section/healthEffectTable';
import { matrizTable } from '../../../components/tables/mock/components/matriz/table.component';
import { quantityResultsTable } from '../../../components/tables/mock/components/quantityResults/section/quantityResultsTable';
import { riskCharacterizationTableSection } from '../../../components/tables/riskCharacterization/riskCharacterization.section';
import { versionControlTable } from '../../../components/tables/versionControl/versionControl.table';
import {
  HierarchyMapData,
  IHomoGroupMap,
} from '../../../converter/hierarchy.converter';
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
import { RiskFactorGroupDataEntity } from './../../../../../checklist/entities/riskGroupData.entity';
import { EnvironmentEntity } from './../../../../../company/entities/environment.entity';
import { ProfessionalEntity } from './../../../../../users/entities/professional.entity';
import {
  paragraphFigure,
  paragraphTable,
} from './../../../base/elements/paragraphs';

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
  characterizations: CharacterizationEntity[];
};

export class ElementsMapClass {
  private variables: IDocVariables;
  private versions: RiskDocumentEntity[];
  private professionals: ProfessionalEntity[];
  private document: RiskFactorGroupDataEntity;
  private environments: EnvironmentEntity[];
  private characterizations: CharacterizationEntity[];
  private homogeneousGroup: IHomoGroupMap;
  private hierarchy: Map<string, HierarchyMapData>;

  constructor({
    variables,
    versions,
    professionals,
    characterizations,
    environments,
    document,
    homogeneousGroup,
    hierarchy,
  }: IDocumentClassType) {
    this.variables = variables;
    this.versions = versions;
    this.professionals = professionals;
    this.environments = environments;
    this.characterizations = characterizations;
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
    [PGRSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_ADM]: () =>
      environmentIterable(
        this.environments.filter(
          (e) => e.type === CompanyEnvironmentTypesEnum.ADMINISTRATIVE,
        ),
        (x, v) => this.convertToDocx(x, v),
      ),
    [PGRSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_OP]: () =>
      environmentIterable(
        this.environments.filter(
          (e) => e.type === CompanyEnvironmentTypesEnum.OPERATION,
        ),
        (x, v) => this.convertToDocx(x, v),
      ),
    [PGRSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_SUP]: () =>
      environmentIterable(
        this.environments.filter(
          (e) => e.type === CompanyEnvironmentTypesEnum.SUPPORT,
        ),
        (x, v) => this.convertToDocx(x, v),
      ),
    [PGRSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_WORKSTATION]: () =>
      characterizationIterable(
        this.characterizations.filter(
          (e) => e.type === CharacterizationTypeEnum.WORKSTATION,
        ),
        (x, v) => this.convertToDocx(x, v),
      ),
    [PGRSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_ACTIVIT]: () =>
      characterizationIterable(
        this.characterizations.filter(
          (e) => e.type === CharacterizationTypeEnum.ACTIVITIES,
        ),
        (x, v) => this.convertToDocx(x, v),
      ),
    [PGRSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_EQUIP]: () =>
      characterizationIterable(
        this.characterizations.filter(
          (e) => e.type === CharacterizationTypeEnum.EQUIPMENT,
        ),
        (x, v) => this.convertToDocx(x, v),
      ),
    [PGRSectionChildrenTypeEnum.TABLE_GSE]: () =>
      hierarchyHomoOrgSection(this.hierarchy, this.homogeneousGroup, {
        showDescription: false,
        showHomogeneous: true,
      })['children'],
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
      hierarchyRisksTableAllSections(this.document, this.hierarchy, (x, v) =>
        this.convertToDocx(x, v),
      ),
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
