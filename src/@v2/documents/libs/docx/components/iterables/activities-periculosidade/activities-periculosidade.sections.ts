import { AlignmentType, Paragraph, Table } from 'docx';
import { HomoTypeEnum } from '@prisma/client';

import { DocumentChildrenTypeEnum } from '@/@v2/documents/domain/enums/document-children-type.enum';
import { DocumentPGRModel } from '@/@v2/documents/domain/models/document-pgr.model';
import { ISectionChildrenType } from '../../../../../domain/types/elements.types';
import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { RiskPericulosidadeEnum } from '@/@v2/documents/domain/models/risk.model';
import { HomogeneousGroupModel } from '@/@v2/documents/domain/models/homogeneous-group.model';
import { sortNumber } from '@/@v2/shared/utils/sorts/number.sort';
import { getLayouts } from '../all-characterization/all-characterization.converter';
import { InlineStyleTypeEnum } from '@/@v2/documents/domain/enums/inline-style-type.enum';
import { RiskDataModel } from '@/@v2/documents/domain/models/risk-data.model';
import { hierarchyMap } from '../../../translations/hierarchy';
import { IHierarchyData, IHomoGroupMap, IHierarchyMap } from '../../../converter/hierarchy.converter';
import { hierarchyHomoOrgTable } from '../../tables/hierarchyHomoOrg/hierarchyHomoOrg.table';
import { getCharacterizationType } from '@/@v2/shared/domain/functions/security/get-characterization-type.func';
import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';

const periculosidadeConfig: Record<RiskPericulosidadeEnum, { title: string; anexo: string; descriptionWithGroups: string; descriptionWithoutGroups: string }> = {
  [RiskPericulosidadeEnum.EXPLOSIVOS_1]: {
    title: 'Atividades e Operações Perigosas com Explosivos',
    anexo: 'Anexo 1 da NR-16',
    descriptionWithGroups:
      'Neste item são apresentadas as atividades, operações e condições identificadas que se equiparam às situações de risco descritas no Anexo 1 da NR-16 — Atividades e Operações Perigosas com Explosivos. As informações a seguir são extraídas diretamente das caracterizações realizadas in loco e nos vínculos estabelecidos entre as atividades reais e as situações normativas da NR-16.',
    descriptionWithoutGroups:
      'Não foram identificadas, neste item, atividades, operações ou condições que se enquadrem como perigosas nos termos do Anexo 1 da NR-16 — Atividades e Operações Perigosas com Explosivos. Portanto, não há caracterização de periculosidade para os trabalhadores vinculados a este cenário.',
  },
  [RiskPericulosidadeEnum.INFLAMAVEIS_2]: {
    title: 'Atividades e Operações Perigosas com Inflamáveis',
    anexo: 'Anexo 2 da NR-16',
    descriptionWithGroups:
      'Neste item são apresentadas as atividades, operações e condições identificadas que se equiparam às situações de risco descritas no Anexo 2 da NR-16 — Atividades e Operações Perigosas com Inflamáveis. As informações a seguir são extraídas diretamente das caracterizações realizadas in loco e nos vínculos estabelecidos entre as atividades reais e as situações normativas da NR-16.',
    descriptionWithoutGroups:
      'Não foram identificadas, neste item, atividades, operações ou condições que se enquadrem como perigosas nos termos do Anexo 2 da NR-16 — Atividades e Operações Perigosas com Inflamáveis. Portanto, não há caracterização de periculosidade para os trabalhadores vinculados a este cenário.',
  },
  [RiskPericulosidadeEnum.ROUBO_3]: {
    title: 'Atividades e Operações Perigosas com Exposição a Roubos ou Outras Espécies de Violência Física nas Atividades Profissionais de Segurança Pessoal ou Patrimonial',
    anexo: 'Anexo 3 da NR-16',
    descriptionWithGroups:
      'Neste item são apresentadas as atividades, operações e condições identificadas que se equiparam às situações de risco descritas no Anexo 3 da NR-16 — Atividades e Operações Perigosas com Exposição a Roubos ou Outras Espécies de Violência Física nas Atividades Profissionais de Segurança Pessoal ou Patrimonial. As informações a seguir são extraídas diretamente das caracterizações realizadas in loco e nos vínculos estabelecidos entre as atividades reais e as situações normativas da NR-16.',
    descriptionWithoutGroups:
      'Não foram identificadas, neste item, atividades, operações ou condições que se enquadrem como perigosas nos termos do Anexo 3 da NR-16 — Atividades e Operações Perigosas com Exposição a Roubos ou Outras Espécies de Violência Física nas Atividades Profissionais de Segurança Pessoal ou Patrimonial. Portanto, não há caracterização de periculosidade para os trabalhadores vinculados a este cenário.',
  },
  [RiskPericulosidadeEnum.ELETRICIDADE_4]: {
    title: 'Atividades e Operações Perigosas com Energia Elétrica',
    anexo: 'Anexo 4 da NR-16',
    descriptionWithGroups:
      'Neste item são apresentadas as atividades, operações e condições identificadas que se equiparam às situações de risco descritas no Anexo 4 da NR-16 — Atividades e Operações Perigosas com Energia Elétrica. As informações a seguir são extraídas diretamente das caracterizações realizadas in loco e nos vínculos estabelecidos entre as atividades reais e as situações normativas da NR-16.',
    descriptionWithoutGroups:
      'Não foram identificadas, neste item, atividades, operações ou condições que se enquadrem como perigosas nos termos do Anexo 4 da NR-16 — Atividades e Operações Perigosas com Energia Elétrica. Portanto, não há caracterização de periculosidade para os trabalhadores vinculados a este cenário.',
  },
  [RiskPericulosidadeEnum.MOTOCICLETA_5]: {
    title: 'Atividades Perigosas em Motocicleta',
    anexo: 'Anexo 5 da NR-16',
    descriptionWithGroups:
      'Neste item são apresentadas as atividades, operações e condições identificadas que se equiparam às situações de risco descritas no Anexo 5 da NR-16 — Atividades Perigosas em Motocicleta. As informações a seguir são extraídas diretamente das caracterizações realizadas in loco e nos vínculos estabelecidos entre as atividades reais e as situações normativas da NR-16.',
    descriptionWithoutGroups:
      'Não foram identificadas, neste item, atividades, operações ou condições que se enquadrem como perigosas nos termos do Anexo 5 da NR-16 — Atividades Perigosas em Motocicleta. Portanto, não há caracterização de periculosidade para os trabalhadores vinculados a este cenário.',
  },
  [RiskPericulosidadeEnum.RADIACAO_6]: {
    title: 'Atividades e Operações Perigosas com Radiações Ionizantes ou Substâncias Radioativas',
    anexo: 'Anexo 6 da NR-16',
    descriptionWithGroups:
      'Neste item são apresentadas as atividades, operações e condições identificadas que se equiparam às situações de risco descritas no Anexo 6 da NR-16 — Atividades e Operações Perigosas com Radiações Ionizantes ou Substâncias Radioativas. As informações a seguir são extraídas diretamente das caracterizações realizadas in loco e nos vínculos estabelecidos entre as atividades reais e as situações normativas da NR-16.',
    descriptionWithoutGroups:
      'Não foram identificadas, neste item, atividades, operações ou condições que se enquadrem como perigosas nos termos do Anexo 6 da NR-16 — Atividades e Operações Perigosas com Radiações Ionizantes ou Substâncias Radioativas. Portanto, não há caracterização de periculosidade para os trabalhadores vinculados a este cenário.',
  },
};

const periculosidadeOrder: RiskPericulosidadeEnum[] = [
  RiskPericulosidadeEnum.EXPLOSIVOS_1,
  RiskPericulosidadeEnum.INFLAMAVEIS_2,
  RiskPericulosidadeEnum.ROUBO_3,
  RiskPericulosidadeEnum.ELETRICIDADE_4,
  RiskPericulosidadeEnum.MOTOCICLETA_5,
  RiskPericulosidadeEnum.RADIACAO_6,
];

const getSentenceType = (sentence: string): ISectionChildrenType => {
  const splitSentence = sentence.split('{type}=');
  if (splitSentence.length == 2) {
    const value = splitSentence[1] as unknown as any;

    if (DocumentChildrenTypeEnum.PARAGRAPH == value) {
      return {
        type: DocumentChildrenTypeEnum.PARAGRAPH,
        text: splitSentence[0],
      };
    }

    if (DocumentChildrenTypeEnum.BULLET == value.split('-')[0]) {
      return {
        type: DocumentChildrenTypeEnum.BULLET,
        text: splitSentence[0],
        level: value.split('-')[1] || 0,
      };
    }
  }

  return {
    type: DocumentChildrenTypeEnum.PARAGRAPH,
    text: splitSentence[0],
  };
};

const getCharacterizationData = ({ group }: { group: HomogeneousGroupModel; periculosidadeType: RiskPericulosidadeEnum }) => {
  const characterization = group.characterization!;
  const paragraphs: ISectionChildrenType[] = [];
  const considerations: ISectionChildrenType[] = [];
  const activities: ISectionChildrenType[] = [];

  // Get image layouts
  const imagesVertical = characterization.photos.filter((image) => image.isVertical);
  const imagesHorizontal = characterization.photos.filter((image) => !image.isVertical);
  const imageElements = getLayouts(imagesVertical, imagesHorizontal);

  characterization.paragraphs?.forEach((paragraph) => {
    paragraphs.push({
      ...getSentenceType(paragraph),
    });
  });

  characterization.activities?.forEach((activity, index) => {
    if (index === 0)
      activities.push({
        type: DocumentChildrenTypeEnum.PARAGRAPH,
        text: '**Descrição das Atividades:**',
        spacing: { after: 100 },
      });

    activities.push({
      ...getSentenceType(activity),
    });
  });

  characterization.considerations?.forEach((consideration, index) => {
    if (index === 0)
      considerations.push({
        type: DocumentChildrenTypeEnum.PARAGRAPH,
        text: '**Considerações:**',
        spacing: { after: 100 },
      });

    considerations.push({
      ...getSentenceType(consideration),
    });
  });

  return { paragraphs, activities, considerations, imageElements };
};

const getSharedData = ({ riskData, periculosidadeType }: { riskData: RiskDataModel[]; periculosidadeType: RiskPericulosidadeEnum }) => {
  const config = periculosidadeConfig[periculosidadeType];
  const riskFactors: ISectionChildrenType[] = [];
  const realActivities: ISectionChildrenType[] = [];
  const normativeActivities: ISectionChildrenType[] = [];

  // Get risk data for this periculosidade type
  const periculosidadeRiskData = riskData.filter((riskData) => riskData.risk.periculosidade === periculosidadeType);

  periculosidadeRiskData.forEach((riskData, index) => {
    if (index === 0)
      riskFactors.push({
        type: DocumentChildrenTypeEnum.PARAGRAPH,
        text: '**Fatores de risco:**',
        spacing: { after: 100 },
      });

    riskFactors.push({
      type: DocumentChildrenTypeEnum.BULLET,
      level: 0,
      text: `${riskData.risk.name} (${riskData.risk.type})`,
      alignment: AlignmentType.START,
    });

    // Add real activities and normative activities
    [riskData.activities]?.forEach((activityData) => {
      // Atividade Real
      if (activityData.realActivity) {
        if (realActivities.length === 0) {
          realActivities.push({
            type: DocumentChildrenTypeEnum.PARAGRAPH,
            text: '**Atividade Real:**',
            spacing: { after: 100 },
          });
        }
        realActivities.push({
          type: DocumentChildrenTypeEnum.PARAGRAPH,
          text: activityData.realActivity,
        });
      }

      // Atividades Normativas Vinculadas (subActivities)
      const subActivitiesWithValue = activityData.activities?.filter((act) => act.subActivity);
      if (subActivitiesWithValue && subActivitiesWithValue.length > 0) {
        if (normativeActivities.length === 0) {
          normativeActivities.push({
            type: DocumentChildrenTypeEnum.PARAGRAPH,
            text: `**Atividades Normativas Vinculadas (${config.anexo}):**`,
          });
        }

        subActivitiesWithValue.forEach((act) => {
          const subActivity = `“${act.subActivity} — ${act.description}”`;

          normativeActivities.push({
            type: DocumentChildrenTypeEnum.PARAGRAPH,
            text: subActivity,
            inlineStyleRangeBlock: [[{ offset: 0, length: subActivity.length, style: InlineStyleTypeEnum.ITALIC }]],
          });
        });
      }
    });
  });

  return { riskFactors, realActivities, normativeActivities };
};

export const activitiesPericulosidadeSections = (
  document: DocumentPGRModel,
  hierarchiesTreeOrg: IHierarchyData,
  homoGroupTree: IHomoGroupMap,
  hierarchyTree: IHierarchyMap,
  convertToDocx: (data: ISectionChildrenType[]) => (Paragraph | Table)[],
) => {
  const sections: (Paragraph | Table)[][] = [];

  const periculosidade = {} as Record<RiskPericulosidadeEnum, { groups: HomogeneousGroupModel[] }>;

  document.homogeneousGroups.forEach((group) => {
    group.allRiskData.forEach((riskData) => {
      if (riskData.risk.periculosidade) {
        if (!periculosidade[riskData.risk.periculosidade]) {
          periculosidade[riskData.risk.periculosidade] = {
            groups: [],
          };
        }

        const groupAlreadyAdded = periculosidade[riskData.risk.periculosidade].groups.some((g) => g.id === group.id);
        if (!groupAlreadyAdded) {
          periculosidade[riskData.risk.periculosidade].groups.push(group);
        }
      }
    });
  });

  periculosidadeOrder.forEach((periculosidadeType) => {
    const config = periculosidadeConfig[periculosidadeType];
    const groups = periculosidade[periculosidadeType]?.groups || [];
    const hasGroups = groups.length > 0;

    const sectionHeader: ISectionChildrenType[] = [
      {
        type: DocumentChildrenTypeEnum.H1,
        text: config.title,
      },
      {
        type: DocumentChildrenTypeEnum.PARAGRAPH,
        text: hasGroups ? config.descriptionWithGroups : config.descriptionWithoutGroups,
      },
    ];

    const sectionElements: (Paragraph | Table)[] = [...convertToDocx(sectionHeader)];

    if (hasGroups) {
      const groupsWithCharacterization = groups.filter((group) => group.characterization).sort((a, b) => sortNumber(a, b, 'order'));
      const groupsHierarchy = groups.filter((group) => group.isHierarchy);

      groupsWithCharacterization.forEach((group) => {
        const characterizationName = group.characterization!.name;

        const h2Section: ISectionChildrenType[] = [
          {
            type: DocumentChildrenTypeEnum.H2,
            text: characterizationName,
          },
        ];

        sectionElements.push(...convertToDocx(h2Section));

        const { activities, paragraphs, considerations, imageElements } = getCharacterizationData({ group, periculosidadeType });
        const { riskFactors, realActivities, normativeActivities } = getSharedData({ riskData: group.allRiskData, periculosidadeType });

        // Add images first (like all-characterization.sections.ts)
        sectionElements.push(...imageElements);

        // Then add the rest of the content
        sectionElements.push(...convertToDocx([...paragraphs, ...riskFactors, ...activities, ...considerations]));

        // Add hierarchy table after considerations (like all-characterization.sections.ts)
        const characterization = group.characterization!;
        const { table: officesTable, missingBody } = hierarchyHomoOrgTable(hierarchiesTreeOrg, homoGroupTree, {
          showDescription: false,
          showHomogeneous: true,
          type: getCharacterizationType(characterization.type).isEnviroment ? HomoTypeEnum.ENVIRONMENT : (characterization.type as HomoTypeEnum),
          groupIdFilter: group.id,
        });

        if (!missingBody) {
          const titleTable: ISectionChildrenType[] = [
            {
              type: DocumentChildrenTypeEnum.PARAGRAPH_TABLE,
              text: `Cargos lotados no ${characterizationName}`,
            },
          ];

          sectionElements.push(...convertToDocx(titleTable));
          sectionElements.push(officesTable);
          sectionElements.push(
            ...convertToDocx([
              {
                type: DocumentChildrenTypeEnum.PARAGRAPH,
                text: '',
              },
            ]),
          );
        }

        sectionElements.push(...convertToDocx([...realActivities, ...normativeActivities]));
      });

      groupsHierarchy.forEach((group) => {
        const h2Section: ISectionChildrenType[] = [
          {
            type: DocumentChildrenTypeEnum.H2,
            text: group.hierarchies
              .map((h) => {
                const hierarchy = document.hierarchiesMap[h.hierarchyId];
                return `${hierarchyMap[hierarchy.type].text}: ${hierarchy.name}`;
              })
              .join(' / '),
          },
        ];

        sectionElements.push(...convertToDocx(h2Section));

        const { riskFactors, realActivities, normativeActivities } = getSharedData({ riskData: group.allRiskData, periculosidadeType });

        sectionElements.push(...convertToDocx([...riskFactors, ...realActivities, ...normativeActivities]));
      });

      // Collect all unique positions (offices) with their sectors for this periculosidade type
      const allPositions = new Map<string, { name: string; sector: string }>();

      groups.forEach((group) => {
        const homoGroup = homoGroupTree[group.id];
        if (!homoGroup) return;

        homoGroup.hierarchies.forEach((hierarchy) => {
          if (hierarchy.type === HierarchyTypeEnum.OFFICE || hierarchy.type === HierarchyTypeEnum.SUB_OFFICE) {
            // Find sector by traversing the parent chain
            let sectorName = '';
            let currentParentId = hierarchy.parentId;
            while (currentParentId) {
              const parent = hierarchyTree[currentParentId];
              if (!parent) break;
              if (parent.type === HierarchyTypeEnum.SECTOR || parent.type === HierarchyTypeEnum.SUB_SECTOR) {
                sectorName = parent.name;
                break;
              }
              currentParentId = parent.parentId;
            }

            const key = `${hierarchy.name}-${sectorName}`;
            if (!allPositions.has(key)) {
              allPositions.set(key, {
                name: hierarchy.name,
                sector: sectorName,
              });
            }
          }
        });
      });

      // Add conclusion section if there are positions
      if (allPositions.size > 0) {
        const positionsList = Array.from(allPositions.values())
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((pos) => (pos.sector ? `${pos.name} (${pos.sector})` : pos.name));

        const conclusionHeader: ISectionChildrenType[] = [
          {
            type: DocumentChildrenTypeEnum.H2,
            text: 'Conclusão',
          },
          {
            type: DocumentChildrenTypeEnum.PARAGRAPH,
            text: `Considerando as informações técnicas apresentadas neste item, incluindo as evidências registradas, a descrição da atividade real e o enquadramento nas atividades e/ou operações perigosas previstas na NR-16, bem como a presença habitual dos trabalhadores vinculados acima nas condições avaliadas, conclui-se pelo direito ao adicional de periculosidade, nos termos da legislação vigente para os seguintes cargos:`,
          },
        ];

        const positionItems: ISectionChildrenType[] = positionsList.map((position) => ({
          type: DocumentChildrenTypeEnum.BULLET,
          text: position,
        }));

        sectionElements.push(...convertToDocx([...conclusionHeader, ...positionItems]));
      }
    }

    sections.push(sectionElements);
  });

  return sections.map((children) => ({
    footerText: `??${VariablesPGREnum.CHAPTER_2}??`,
    children,
  }));
};
