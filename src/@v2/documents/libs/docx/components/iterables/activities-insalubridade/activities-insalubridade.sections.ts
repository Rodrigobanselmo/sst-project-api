import { AlignmentType, Paragraph, Table } from 'docx';
import { ExposureTypeEnum, GrauInsalubridade, HomoTypeEnum } from '@prisma/client';

import { DocumentChildrenTypeEnum } from '@/@v2/documents/domain/enums/document-children-type.enum';
import { DocumentPGRModel } from '@/@v2/documents/domain/models/document-pgr.model';
import { ISectionChildrenType } from '../../../../../domain/types/elements.types';
import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { RiskInsalubridadeEnum } from '@/@v2/documents/domain/models/risk.model';
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
import { RiskDataQuantityNoiseVO } from '@/@v2/shared/domain/values-object/security/risk-data-quantity-noise.vo';
import { RiskDataQuantityHeatVO } from '@/@v2/shared/domain/values-object/security/risk-data-quantity-heat.vo';

const insalubridadeConfig: Record<
  RiskInsalubridadeEnum,
  { title: string; anexo: string; criterio: 'quantitativo' | 'qualitativo'; descriptionWithGroups: string; descriptionWithoutGroups: string }
> = {
  [RiskInsalubridadeEnum.RUIDO_CONTINUO_1]: {
    title: 'Ruído Contínuo ou Intermitente',
    anexo: 'Anexo 1 da NR-15',
    criterio: 'quantitativo',
    descriptionWithGroups:
      'Neste item do Laudo de Insalubridade são apresentados os resultados da análise das atividades, cargos, ambientes e/ou grupos homogêneos de exposição caracterizados no GRO como expostos ao fator de risco Ruído Contínuo ou Intermitente, conforme disposto no Anexo 1 da Norma Regulamentadora nº 15. O referido Anexo estabelece critério técnico de avaliação quantitativa, baseado na comparação entre os níveis de pressão sonora medidos no ambiente de trabalho e os limites de tolerância definidos na norma. A caracterização da insalubridade ocorre quando os níveis de exposição ocupacional ao ruído ultrapassam os limites de tolerância estabelecidos, considerando jornada, tempo de exposição e metodologia de medição aplicável. A avaliação considera os resultados das medições ambientais informadas no GRO, realizadas conforme metodologia técnica reconhecida, bem como a eficácia das medidas de controle coletivo e individual registradas, incluindo a verificação da capacidade de neutralização do risco por Equipamentos de Proteção Individual. A conclusão apresentada neste Anexo restringe-se exclusivamente às situações em que a exposição ocupacional ao ruído, conforme caracterizada, atende simultaneamente aos critérios legais e técnicos previstos na NR-15.',
    descriptionWithoutGroups:
      'Não foram identificadas, neste item, atividades, operações ou condições que se enquadrem como insalubres nos termos do Anexo 1 da NR-15 — Ruído Contínuo ou Intermitente. Portanto, não há caracterização de insalubridade para os trabalhadores vinculados a este cenário.',
  },
  [RiskInsalubridadeEnum.RUIDO_IMPACTO_2]: {
    title: 'Ruído de Impacto',
    anexo: 'Anexo 2 da NR-15',
    criterio: 'quantitativo',
    descriptionWithGroups:
      'Neste item do Laudo de Insalubridade são apresentados os resultados da análise das atividades, cargos, ambientes e/ou grupos homogêneos de exposição caracterizados no GRO como expostos ao fator de risco Ruído de Impacto, conforme disposto no Anexo 2 da Norma Regulamentadora nº 15. O referido Anexo estabelece critério técnico de avaliação quantitativa, baseado na comparação entre os níveis de pressão sonora de pico medidos no ambiente de trabalho e os limites de tolerância definidos na norma. A caracterização da insalubridade ocorre quando os níveis de exposição ocupacional ao ruído de impacto ultrapassam os limites de tolerância estabelecidos. A avaliação considera os resultados das medições ambientais informadas no GRO, realizadas conforme metodologia técnica reconhecida, bem como a eficácia das medidas de controle coletivo e individual registradas, incluindo a verificação da capacidade de neutralização do risco por Equipamentos de Proteção Individual. A conclusão apresentada neste Anexo restringe-se exclusivamente às situações em que a exposição ocupacional ao ruído de impacto, conforme caracterizada, atende simultaneamente aos critérios legais e técnicos previstos na NR-15.',
    descriptionWithoutGroups:
      'Não foram identificadas, neste item, atividades, operações ou condições que se enquadrem como insalubres nos termos do Anexo 2 da NR-15 — Ruído de Impacto. Portanto, não há caracterização de insalubridade para os trabalhadores vinculados a este cenário.',
  },
  [RiskInsalubridadeEnum.CALOR_3]: {
    title: 'Calor',
    anexo: 'Anexo 3 da NR-15',
    criterio: 'quantitativo',
    descriptionWithGroups:
      'Neste item do Laudo de Insalubridade são apresentados os resultados da análise das atividades, cargos, ambientes e/ou grupos homogêneos de exposição caracterizados no GRO como expostos ao fator de risco Calor, conforme disposto no Anexo 3 da Norma Regulamentadora nº 15. O referido Anexo estabelece critério técnico de avaliação quantitativa, baseado na comparação entre os valores de IBUTG medidos no ambiente de trabalho e os limites de tolerância definidos na norma, considerando o regime de trabalho e o tipo de atividade. A caracterização da insalubridade ocorre quando os níveis de exposição ocupacional ao calor ultrapassam os limites de tolerância estabelecidos. A avaliação considera os resultados das medições ambientais informadas no GRO, realizadas conforme metodologia técnica reconhecida, bem como a eficácia das medidas de controle coletivo e individual registradas, incluindo a verificação da capacidade de neutralização do risco por Equipamentos de Proteção Individual. A conclusão apresentada neste Anexo restringe-se exclusivamente às situações em que a exposição ocupacional ao calor, conforme caracterizada, atende simultaneamente aos critérios legais e técnicos previstos na NR-15.',
    descriptionWithoutGroups:
      'Não foram identificadas, neste item, atividades, operações ou condições que se enquadrem como insalubres nos termos do Anexo 3 da NR-15 — Calor. Portanto, não há caracterização de insalubridade para os trabalhadores vinculados a este cenário.',
  },
  [RiskInsalubridadeEnum.RADIACAO_IONIZANTE_5]: {
    title: 'Radiações Ionizantes',
    anexo: 'Anexo 5 da NR-15',
    criterio: 'qualitativo',
    descriptionWithGroups:
      'Neste item do Laudo de Insalubridade são apresentadas as análises relativas às atividades, cargos, ambientes e/ou processos caracterizados no GRO como envolvendo exposição a radiações ionizantes, conforme disposto no Anexo 5 da Norma Regulamentadora nº 15. O referido Anexo adota critério técnico de avaliação qualitativa, no qual a caracterização da insalubridade decorre da natureza da atividade executada e do contato com material radioativo, conforme critérios, princípios e controles de proteção radiológica estabelecidos no Anexo 5 da NR-15 e na Norma CNEN NN 3.01 – Diretrizes Básicas de Proteção Radiológica. A análise técnica fundamenta-se na comparação entre a descrição da atividade real cadastrada no GRO e as atividades descritas no Anexo 5 da NR-15, considerando a similaridade operacional, o tipo de agente envolvido e a forma de exposição. A avaliação também considera a existência e a eficácia das medidas de controle informadas no GRO, incluindo procedimentos operacionais, medidas de proteção coletiva e Equipamentos de Proteção Individual, sem prejuízo do enquadramento legal quando a norma assim o determina. A conclusão apresentada neste Anexo limita-se às atividades e condições efetivamente caracterizadas no GRO como compatíveis com os critérios qualitativos estabelecidos pela NR-15.',
    descriptionWithoutGroups:
      'Não foram identificadas, neste item, atividades, operações ou condições que se enquadrem como insalubres nos termos do Anexo 5 da NR-15 — Radiações Ionizantes. Portanto, não há caracterização de insalubridade para os trabalhadores vinculados a este cenário.',
  },
  [RiskInsalubridadeEnum.PRESSAO_HIPERBARICA_6]: {
    title: 'Pressões Hiperbáricas',
    anexo: 'Anexo 6 da NR-15',
    criterio: 'qualitativo',
    descriptionWithGroups:
      'Neste item do Laudo de Insalubridade são apresentadas as análises relativas às atividades, cargos, ambientes e/ou processos caracterizados no GRO como envolvendo exposição a pressões hiperbáricas, conforme disposto no Anexo 6 da Norma Regulamentadora nº 15. O referido Anexo adota critério técnico de avaliação qualitativa, no qual a caracterização da insalubridade decorre da natureza da atividade executada em ambientes com pressão superior à atmosférica. A análise técnica fundamenta-se na comparação entre a descrição da atividade real cadastrada no GRO e as atividades descritas no Anexo 6 da NR-15, considerando a similaridade operacional e a forma de exposição. A avaliação também considera a existência e a eficácia das medidas de controle informadas no GRO, incluindo procedimentos operacionais, medidas de proteção coletiva e Equipamentos de Proteção Individual. A conclusão apresentada neste Anexo limita-se às atividades e condições efetivamente caracterizadas no GRO como compatíveis com os critérios qualitativos estabelecidos pela NR-15.',
    descriptionWithoutGroups:
      'Não foram identificadas, neste item, atividades, operações ou condições que se enquadrem como insalubres nos termos do Anexo 6 da NR-15 — Pressões Hiperbáricas. Portanto, não há caracterização de insalubridade para os trabalhadores vinculados a este cenário.',
  },
  [RiskInsalubridadeEnum.RADIACAO_NAO_IONIZANTE_7]: {
    title: 'Radiações Não Ionizantes',
    anexo: 'Anexo 7 da NR-15',
    criterio: 'qualitativo',
    descriptionWithGroups:
      'Neste item do Laudo de Insalubridade são apresentadas as análises relativas às atividades, cargos, ambientes e/ou processos caracterizados no GRO como envolvendo exposição a radiações não ionizantes, conforme disposto no Anexo 7 da Norma Regulamentadora nº 15. O referido Anexo adota critério técnico de avaliação qualitativa, no qual a caracterização da insalubridade decorre da natureza da atividade executada e do contato com fontes de radiações não ionizantes (micro-ondas, ultravioleta, laser). A análise técnica fundamenta-se na comparação entre a descrição da atividade real cadastrada no GRO e as atividades descritas no Anexo 7 da NR-15, considerando a similaridade operacional, o tipo de agente envolvido e a forma de exposição. A avaliação também considera a existência e a eficácia das medidas de controle informadas no GRO, incluindo procedimentos operacionais, medidas de proteção coletiva e Equipamentos de Proteção Individual. A conclusão apresentada neste Anexo limita-se às atividades e condições efetivamente caracterizadas no GRO como compatíveis com os critérios qualitativos estabelecidos pela NR-15.',
    descriptionWithoutGroups:
      'Não foram identificadas, neste item, atividades, operações ou condições que se enquadrem como insalubres nos termos do Anexo 7 da NR-15 — Radiações Não Ionizantes. Portanto, não há caracterização de insalubridade para os trabalhadores vinculados a este cenário.',
  },
  [RiskInsalubridadeEnum.VIBRACAO_8]: {
    title: 'Vibrações',
    anexo: 'Anexo 8 da NR-15',
    criterio: 'quantitativo',
    descriptionWithGroups:
      'Neste item do Laudo de Insalubridade são apresentados os resultados da análise das atividades, cargos, ambientes e/ou grupos homogêneos de exposição caracterizados no GRO como expostos ao fator de risco Vibrações, conforme disposto no Anexo 8 da Norma Regulamentadora nº 15. O referido Anexo estabelece critério técnico de avaliação quantitativa, baseado na comparação entre os valores de aceleração medidos e os limites de tolerância definidos na norma. A caracterização da insalubridade ocorre quando os níveis de exposição ocupacional às vibrações ultrapassam os limites de tolerância estabelecidos. A avaliação considera os resultados das medições ambientais informadas no GRO, realizadas conforme metodologia técnica reconhecida, bem como a eficácia das medidas de controle coletivo e individual registradas, incluindo a verificação da capacidade de neutralização do risco por Equipamentos de Proteção Individual. A conclusão apresentada neste Anexo restringe-se exclusivamente às situações em que a exposição ocupacional às vibrações, conforme caracterizada, atende simultaneamente aos critérios legais e técnicos previstos na NR-15.',
    descriptionWithoutGroups:
      'Não foram identificadas, neste item, atividades, operações ou condições que se enquadrem como insalubres nos termos do Anexo 8 da NR-15 — Vibrações. Portanto, não há caracterização de insalubridade para os trabalhadores vinculados a este cenário.',
  },
  [RiskInsalubridadeEnum.FRIO_9]: {
    title: 'Frio',
    anexo: 'Anexo 9 da NR-15',
    criterio: 'qualitativo',
    descriptionWithGroups:
      'Neste item do Laudo de Insalubridade são apresentadas as análises relativas às atividades, cargos, ambientes e/ou processos caracterizados no GRO como envolvendo exposição ao frio, conforme disposto no Anexo 9 da Norma Regulamentadora nº 15. O referido Anexo adota critério técnico de avaliação qualitativa, no qual a caracterização da insalubridade decorre da execução de atividades ou operações no interior de câmaras frigoríficas ou em ambientes que apresentem condições térmicas similares, com exposição ocupacional ao frio, sem proteção adequada. A análise técnica fundamenta-se na comparação entre a descrição da atividade real cadastrada no GRO e as atividades descritas no Anexo 9 da NR-15, considerando a similaridade operacional e a forma de exposição. A avaliação também considera a existência e a eficácia das medidas de controle informadas no GRO, incluindo procedimentos operacionais, medidas de proteção coletiva e Equipamentos de Proteção Individual. A conclusão apresentada neste Anexo limita-se às atividades e condições efetivamente caracterizadas no GRO como compatíveis com os critérios qualitativos estabelecidos pela NR-15.',
    descriptionWithoutGroups:
      'Não foram identificadas, neste item, atividades, operações ou condições que se enquadrem como insalubres nos termos do Anexo 9 da NR-15 — Frio. Portanto, não há caracterização de insalubridade para os trabalhadores vinculados a este cenário.',
  },
  [RiskInsalubridadeEnum.UMIDADE_10]: {
    title: 'Umidade',
    anexo: 'Anexo 10 da NR-15',
    criterio: 'qualitativo',
    descriptionWithGroups:
      'Neste item do Laudo de Insalubridade são apresentadas as análises relativas às atividades, cargos, ambientes e/ou processos caracterizados no GRO como envolvendo exposição à umidade, conforme disposto no Anexo 10 da Norma Regulamentadora nº 15. O referido Anexo adota critério técnico de avaliação qualitativa, no qual a caracterização da insalubridade decorre da execução de atividades ou operações em locais alagados ou encharcados, com umidade excessiva, capazes de produzir danos à saúde dos trabalhadores. A análise técnica fundamenta-se na comparação entre a descrição da atividade real cadastrada no GRO e as atividades descritas no Anexo 10 da NR-15, considerando a similaridade operacional e a forma de exposição. A avaliação também considera a existência e a eficácia das medidas de controle informadas no GRO, incluindo procedimentos operacionais, medidas de proteção coletiva e Equipamentos de Proteção Individual. A conclusão apresentada neste Anexo limita-se às atividades e condições efetivamente caracterizadas no GRO como compatíveis com os critérios qualitativos estabelecidos pela NR-15.',
    descriptionWithoutGroups:
      'Não foram identificadas, neste item, atividades, operações ou condições que se enquadrem como insalubres nos termos do Anexo 10 da NR-15 — Umidade. Portanto, não há caracterização de insalubridade para os trabalhadores vinculados a este cenário.',
  },
  [RiskInsalubridadeEnum.AGENTES_QUIMICOS_11]: {
    title: 'Agentes Químicos (Limites de Tolerância)',
    anexo: 'Anexo 11 da NR-15',
    criterio: 'quantitativo',
    descriptionWithGroups:
      'Neste item do Laudo de Insalubridade são apresentados os resultados da análise das atividades, cargos, ambientes e/ou grupos homogêneos de exposição caracterizados no GRO como expostos a agentes químicos com limites de tolerância, conforme disposto no Anexo 11 da Norma Regulamentadora nº 15. O referido Anexo estabelece critério técnico de avaliação quantitativa, baseado na comparação entre as concentrações dos agentes químicos medidos no ambiente de trabalho e os limites de tolerância definidos na norma. A caracterização da insalubridade ocorre quando os níveis de exposição ocupacional aos agentes químicos ultrapassam os limites de tolerância estabelecidos. A avaliação considera os resultados das medições ambientais informadas no GRO, realizadas conforme metodologia técnica reconhecida, bem como a eficácia das medidas de controle coletivo e individual registradas, incluindo a verificação da capacidade de neutralização do risco por Equipamentos de Proteção Individual. A conclusão apresentada neste Anexo restringe-se exclusivamente às situações em que a exposição ocupacional aos agentes químicos, conforme caracterizada, atende simultaneamente aos critérios legais e técnicos previstos na NR-15.',
    descriptionWithoutGroups:
      'Não foram identificadas, neste item, atividades, operações ou condições que se enquadrem como insalubres nos termos do Anexo 11 da NR-15 — Agentes Químicos (Limites de Tolerância). Portanto, não há caracterização de insalubridade para os trabalhadores vinculados a este cenário.',
  },
  [RiskInsalubridadeEnum.POEIRAS_MINERAIS_12]: {
    title: 'Poeiras Minerais',
    anexo: 'Anexo 12 da NR-15',
    criterio: 'quantitativo',
    descriptionWithGroups:
      'Neste item do Laudo de Insalubridade são apresentados os resultados da análise das atividades, cargos, ambientes e/ou grupos homogêneos de exposição caracterizados no GRO como expostos a poeiras minerais, conforme disposto no Anexo 12 da Norma Regulamentadora nº 15. O referido Anexo estabelece critério técnico de avaliação quantitativa, baseado na comparação entre as concentrações de poeiras minerais medidas no ambiente de trabalho e os limites de tolerância definidos na norma. A caracterização da insalubridade ocorre quando os níveis de exposição ocupacional às poeiras minerais ultrapassam os limites de tolerância estabelecidos. A avaliação considera os resultados das medições ambientais informadas no GRO, realizadas conforme metodologia técnica reconhecida, bem como a eficácia das medidas de controle coletivo e individual registradas, incluindo a verificação da capacidade de neutralização do risco por Equipamentos de Proteção Individual. A conclusão apresentada neste Anexo restringe-se exclusivamente às situações em que a exposição ocupacional às poeiras minerais, conforme caracterizada, atende simultaneamente aos critérios legais e técnicos previstos na NR-15.',
    descriptionWithoutGroups:
      'Não foram identificadas, neste item, atividades, operações ou condições que se enquadrem como insalubres nos termos do Anexo 12 da NR-15 — Poeiras Minerais. Portanto, não há caracterização de insalubridade para os trabalhadores vinculados a este cenário.',
  },
  [RiskInsalubridadeEnum.AGENTES_QUIMICOS_QUALITATIVO_13]: {
    title: 'Agentes Químicos (Avaliação Qualitativa)',
    anexo: 'Anexo 13 da NR-15',
    criterio: 'qualitativo',
    descriptionWithGroups:
      'Neste item do Laudo de Insalubridade são apresentadas as análises relativas às atividades, cargos, ambientes e/ou processos caracterizados no GRO como envolvendo exposição a agentes químicos avaliados por critério qualitativo, conforme disposto no Anexo 13 da Norma Regulamentadora nº 15. O referido Anexo adota critério técnico de avaliação qualitativa, no qual a caracterização da insalubridade decorre da natureza da atividade executada e do contato com agentes químicos previstos na norma, independentemente de medições quantitativas. A análise técnica fundamenta-se na comparação entre a descrição da atividade real cadastrada no GRO e as atividades descritas no Anexo 13 da NR-15, considerando a similaridade operacional, o tipo de agente envolvido e a forma de exposição. A avaliação também considera a existência e a eficácia das medidas de controle informadas no GRO, incluindo procedimentos operacionais, medidas de proteção coletiva e Equipamentos de Proteção Individual. A conclusão apresentada neste Anexo limita-se às atividades e condições efetivamente caracterizadas no GRO como compatíveis com os critérios qualitativos estabelecidos pela NR-15.',
    descriptionWithoutGroups:
      'Não foram identificadas, neste item, atividades, operações ou condições que se enquadrem como insalubres nos termos do Anexo 13 da NR-15 — Agentes Químicos (Avaliação Qualitativa). Portanto, não há caracterização de insalubridade para os trabalhadores vinculados a este cenário.',
  },
  [RiskInsalubridadeEnum.BENZENO_13A]: {
    title: 'Benzeno',
    anexo: 'Anexo 13-A da NR-15',
    criterio: 'qualitativo',
    descriptionWithGroups:
      'Neste item do Laudo de Insalubridade são apresentadas as análises relativas às atividades, cargos, ambientes e/ou processos caracterizados no GRO como envolvendo exposição ao benzeno, conforme disposto no Anexo 13-A da Norma Regulamentadora nº 15. O referido Anexo adota critério técnico de avaliação qualitativa, no qual a caracterização da insalubridade decorre da natureza da atividade executada e do contato com benzeno, independentemente de medições quantitativas. A análise técnica fundamenta-se na comparação entre a descrição da atividade real cadastrada no GRO e as atividades descritas no Anexo 13-A da NR-15, considerando a similaridade operacional e a forma de exposição. A avaliação também considera a existência e a eficácia das medidas de controle informadas no GRO, incluindo procedimentos operacionais, medidas de proteção coletiva e Equipamentos de Proteção Individual. A conclusão apresentada neste Anexo limita-se às atividades e condições efetivamente caracterizadas no GRO como compatíveis com os critérios qualitativos estabelecidos pela NR-15.',
    descriptionWithoutGroups:
      'Não foram identificadas, neste item, atividades, operações ou condições que se enquadrem como insalubres nos termos do Anexo 13-A da NR-15 — Benzeno. Portanto, não há caracterização de insalubridade para os trabalhadores vinculados a este cenário.',
  },
  [RiskInsalubridadeEnum.AGENTES_BIOLOGICOS_14]: {
    title: 'Agentes Biológicos',
    anexo: 'Anexo 14 da NR-15',
    criterio: 'qualitativo',
    descriptionWithGroups:
      'Neste item do Laudo de Insalubridade são apresentadas as análises relativas às atividades, cargos, ambientes e/ou processos caracterizados no GRO como envolvendo exposição a agentes biológicos, conforme disposto no Anexo 14 da Norma Regulamentadora nº 15. O referido Anexo adota critério técnico de avaliação qualitativa, no qual a caracterização da insalubridade decorre da natureza da atividade executada e do contato com agentes biológicos previstos na norma, independentemente de medições quantitativas. A análise técnica fundamenta-se na comparação entre a descrição da atividade real cadastrada no GRO e as atividades descritas no Anexo 14 da NR-15, considerando a similaridade operacional, o tipo de agente envolvido e a forma de exposição. Para fins de caracterização da insalubridade, é indispensável que a exposição aos agentes biológicos seja habitual e permanente, integrando a rotina normal de trabalho, não sendo considerados eventos ocasionais ou fortuitos. A avaliação também considera a existência e a eficácia das medidas de controle informadas no GRO, incluindo procedimentos operacionais, medidas de proteção coletiva e Equipamentos de Proteção Individual, sem prejuízo do enquadramento legal quando a norma assim o determina. A conclusão apresentada neste Anexo limita-se às atividades e condições efetivamente caracterizadas no GRO como compatíveis com os critérios qualitativos estabelecidos pela NR-15.',
    descriptionWithoutGroups:
      'Não foram identificadas, neste item, atividades, operações ou condições que se enquadrem como insalubres nos termos do Anexo 14 da NR-15 — Agentes Biológicos. Portanto, não há caracterização de insalubridade para os trabalhadores vinculados a este cenário.',
  },
};

const insalubridadeOrder: RiskInsalubridadeEnum[] = [
  RiskInsalubridadeEnum.RUIDO_CONTINUO_1,
  RiskInsalubridadeEnum.RUIDO_IMPACTO_2,
  RiskInsalubridadeEnum.CALOR_3,
  RiskInsalubridadeEnum.RADIACAO_IONIZANTE_5,
  RiskInsalubridadeEnum.PRESSAO_HIPERBARICA_6,
  RiskInsalubridadeEnum.RADIACAO_NAO_IONIZANTE_7,
  RiskInsalubridadeEnum.VIBRACAO_8,
  RiskInsalubridadeEnum.FRIO_9,
  RiskInsalubridadeEnum.UMIDADE_10,
  RiskInsalubridadeEnum.AGENTES_QUIMICOS_11,
  RiskInsalubridadeEnum.POEIRAS_MINERAIS_12,
  RiskInsalubridadeEnum.AGENTES_QUIMICOS_QUALITATIVO_13,
  RiskInsalubridadeEnum.BENZENO_13A,
  RiskInsalubridadeEnum.AGENTES_BIOLOGICOS_14,
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

const getCharacterizationData = ({ group }: { group: HomogeneousGroupModel; insalubridadeType: RiskInsalubridadeEnum }) => {
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

const getSharedData = ({ riskData, insalubridadeType }: { riskData: RiskDataModel[]; insalubridadeType: RiskInsalubridadeEnum }) => {
  const config = insalubridadeConfig[insalubridadeType];
  const riskFactors: ISectionChildrenType[] = [];
  const realActivities: ISectionChildrenType[] = [];
  const normativeActivities: ISectionChildrenType[] = [];

  // Get risk data for this insalubridade type
  const insalubridadeRiskData = riskData.filter((riskData) => riskData.risk.insalubridade === insalubridadeType);

  insalubridadeRiskData.forEach((riskData, index) => {
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
    if (riskData.activities) {
      [riskData.activities]?.forEach((activityData) => {
        // Atividade Real
        if (activityData?.realActivity) {
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
        // Filter only INSALUBRIDADE activities for insalubridade document
        const subActivitiesWithValue = activityData.activities?.filter((act) => act.subActivity && act.activityType === 'INSALUBRIDADE');
        if (subActivitiesWithValue && subActivitiesWithValue.length > 0) {
          if (normativeActivities.length === 0) {
            normativeActivities.push({
              type: DocumentChildrenTypeEnum.PARAGRAPH,
              text: `**Atividades Normativas Vinculadas (${config.anexo}):**`,
            });
          }

          subActivitiesWithValue.forEach((act) => {
            const subActivity = `"${act.subActivity} — ${act.description}"`;

            normativeActivities.push({
              type: DocumentChildrenTypeEnum.PARAGRAPH,
              text: subActivity,
              inlineStyleRangeBlock: [[{ offset: 0, length: subActivity.length, style: InlineStyleTypeEnum.ITALIC }]],
            });
          });
        }
      });
    }
  });

  return { riskFactors, realActivities, normativeActivities };
};

// Helper function to get characterization name based on group type
const getCharacterizationNameForConclusion = (group: HomogeneousGroupModel, hierarchyTree: IHierarchyMap): string => {
  // If it's a characterization (activity, equipment, workstation, environment)
  if (group.characterization) {
    return group.characterization.name;
  }

  // If it's a hierarchy (cargo, setor, diretoria, etc.)
  if (group.isHierarchy && group.hierarchies.length > 0) {
    return group.hierarchies
      .map((h) => {
        const hierarchy = hierarchyTree[h.hierarchyId];
        if (!hierarchy) return '';
        return `${hierarchyMap[hierarchy.type].text}: ${hierarchy.name}`;
      })
      .filter(Boolean)
      .join(' / ');
  }

  // If it's a GHO (grupo homogêneo)
  return group.name;
};

// Generic helper function to get insalubridade conclusion based on type
// Returns: { conclusion: ISectionChildrenType[], hasInsalubridade: boolean }
const getInsalubridadeConclusion = ({
  group,
  insalubridadeType,
  hierarchyTree,
}: {
  group: HomogeneousGroupModel;
  insalubridadeType: RiskInsalubridadeEnum;
  hierarchyTree: IHierarchyMap;
}): { conclusion: ISectionChildrenType[]; hasInsalubridade: boolean } => {
  // Route to specific conclusion function based on insalubridade type
  switch (insalubridadeType) {
    case RiskInsalubridadeEnum.RUIDO_CONTINUO_1:
    case RiskInsalubridadeEnum.RUIDO_IMPACTO_2:
      return getNoiseInsalubridadeConclusion({ group, insalubridadeType, hierarchyTree });
    case RiskInsalubridadeEnum.CALOR_3:
      return getHeatInsalubridadeConclusion({ group, hierarchyTree });
    case RiskInsalubridadeEnum.RADIACAO_IONIZANTE_5:
      return getRadiacaoIonizanteInsalubridadeConclusion({ group, hierarchyTree });
    case RiskInsalubridadeEnum.PRESSAO_HIPERBARICA_6:
      return getPressaoHiperbaricaInsalubridadeConclusion({ group, hierarchyTree });
    case RiskInsalubridadeEnum.RADIACAO_NAO_IONIZANTE_7:
      return getRadiacaoNaoIonizanteInsalubridadeConclusion({ group, hierarchyTree });
    case RiskInsalubridadeEnum.VIBRACAO_8:
      return getVibracaoInsalubridadeConclusion({ group, hierarchyTree });
    case RiskInsalubridadeEnum.FRIO_9:
      return getFrioInsalubridadeConclusion({ group, hierarchyTree });
    case RiskInsalubridadeEnum.UMIDADE_10:
      return getUmidadeInsalubridadeConclusion({ group, hierarchyTree });
    case RiskInsalubridadeEnum.AGENTES_QUIMICOS_11:
      return getAgentesQuimicosInsalubridadeConclusion({ group, hierarchyTree });
    case RiskInsalubridadeEnum.POEIRAS_MINERAIS_12:
      return getPoeirasMineiraisInsalubridadeConclusion({ group, hierarchyTree });
    case RiskInsalubridadeEnum.AGENTES_QUIMICOS_QUALITATIVO_13:
      return getAgentesQuimicosQualitativoInsalubridadeConclusion({ group, hierarchyTree });
    case RiskInsalubridadeEnum.BENZENO_13A:
      return getBenzenoInsalubridadeConclusion({ group, hierarchyTree });
    case RiskInsalubridadeEnum.AGENTES_BIOLOGICOS_14:
      return getAgentesBiologicosInsalubridadeConclusion({ group, hierarchyTree });
    default:
      return { conclusion: [], hasInsalubridade: false };
  }
};

// Helper function to get the measured noise value in dB(A)
const getMeasuredNoiseValue = (quantityNoise: RiskDataQuantityNoiseVO): { value: string; source: string } | null => {
  // Priority: nr15q5 > ltcatq5 > ltcatq3
  if (quantityNoise.nr15q5) {
    return { value: quantityNoise.nr15q5, source: 'NR-15' };
  }
  if (quantityNoise.ltcatq5) {
    return { value: quantityNoise.ltcatq5, source: 'LTCAT' };
  }
  if (quantityNoise.ltcatq3) {
    return { value: quantityNoise.ltcatq3, source: 'LTCAT' };
  }
  return null;
};

// Helper function to get the tolerance limit for noise
const getNoiseToleranteLimit = (insalubridadeType: RiskInsalubridadeEnum): string => {
  // Anexo 1 — Ruído Contínuo ou Intermitente: 85 dB(A) para 8h
  // Anexo 2 — Ruído de Impacto: 120 dB(C) / 140 dB (linear)
  if (insalubridadeType === RiskInsalubridadeEnum.RUIDO_CONTINUO_1) {
    return '85 dB(A)';
  }
  if (insalubridadeType === RiskInsalubridadeEnum.RUIDO_IMPACTO_2) {
    return '120 dB(C)';
  }
  return '85 dB(A)';
};

// Helper function to get the grau de insalubridade label
const getGrauInsalubridadeLabel = (grau: GrauInsalubridade | null): string => {
  switch (grau) {
    case 'MIN':
      return 'grau mínimo (10%)';
    case 'MED':
      return 'grau médio (20%)';
    case 'MAX':
      return 'grau máximo (40%)';
    default:
      // Default for noise (Anexo 1 and Anexo 2) is grau médio (20%)
      return 'grau médio (20%)';
  }
};

// Helper function to check if qualitative risk data has required activities
// For qualitative risks, both realActivity AND at least one equivalent activity are required
// Helper function to check if qualitative risk data has required activities (using insalubridadeActivities getter)
const hasQualitativeActivities = (riskData: RiskDataModel): boolean => {
  const activities = riskData.insalubridadeActivities;
  if (!activities) return false;
  const hasRealActivity = !!activities.realActivity?.trim();
  const hasEquivalentActivity = activities.activities && activities.activities.length > 0 && activities.activities.some((a) => !!a.description?.trim());
  return hasRealActivity && hasEquivalentActivity;
};

// Helper function to filter qualitative risk data that has required activities
const filterQualitativeRiskDataWithActivities = (riskDataList: RiskDataModel[]): RiskDataModel[] => {
  return riskDataList.filter((rd) => hasQualitativeActivities(rd));
};

// Helper function to format activities text for qualitative risks (using insalubridadeActivities getter)
const formatQualitativeActivitiesText = (riskData: RiskDataModel): string => {
  const activities = riskData.insalubridadeActivities;
  if (!activities) return '';

  const realActivity = activities.realActivity?.trim() || '';
  const equivalentActivities = activities.activities || [];

  // Format equivalent activities
  const equivalentTexts = equivalentActivities
    .filter((a) => !!a.description?.trim())
    .map((a) => {
      let text = a.description?.trim() || '';
      if (a.subActivity?.trim()) {
        text += ` (${a.subActivity.trim()})`;
      }
      return text;
    });

  if (!realActivity || equivalentTexts.length === 0) return '';

  return `Atividade Real: "${realActivity}"\nAtividade(s) Equivalente(s): ${equivalentTexts.map((t) => `"${t}"`).join('; ')}`;
};

// Helper function to get the anexo name for noise
const getNoiseAnexoName = (insalubridadeType: RiskInsalubridadeEnum): string => {
  if (insalubridadeType === RiskInsalubridadeEnum.RUIDO_CONTINUO_1) {
    return 'Anexo 1 da NR-15';
  }
  if (insalubridadeType === RiskInsalubridadeEnum.RUIDO_IMPACTO_2) {
    return 'Anexo 2 da NR-15';
  }
  return 'Anexo 1 da NR-15';
};

// Helper function to get the noise type name
const getNoiseTypeName = (insalubridadeType: RiskInsalubridadeEnum): string => {
  if (insalubridadeType === RiskInsalubridadeEnum.RUIDO_CONTINUO_1) {
    return 'Ruído Contínuo ou Intermitente';
  }
  if (insalubridadeType === RiskInsalubridadeEnum.RUIDO_IMPACTO_2) {
    return 'Ruído de Impacto';
  }
  return 'Ruído Contínuo ou Intermitente';
};

// Helper function to get the noise unit based on type
const getNoiseUnit = (insalubridadeType: RiskInsalubridadeEnum): string => {
  // Anexo 1 — Ruído Contínuo ou Intermitente: dB(A)
  // Anexo 2 — Ruído de Impacto: dB(C)
  if (insalubridadeType === RiskInsalubridadeEnum.RUIDO_IMPACTO_2) {
    return 'dB(C)';
  }
  return 'dB(A)';
};

// Helper function to analyze insalubridade conclusion for noise (quantitative)
// Returns: { conclusion: ISectionChildrenType[], hasInsalubridade: boolean }
const getNoiseInsalubridadeConclusion = ({
  group,
  insalubridadeType,
  hierarchyTree,
}: {
  group: HomogeneousGroupModel;
  insalubridadeType: RiskInsalubridadeEnum;
  hierarchyTree: IHierarchyMap;
}): { conclusion: ISectionChildrenType[]; hasInsalubridade: boolean } => {
  const conclusion: ISectionChildrenType[] = [];

  // Get all noise risk data for this group
  const noiseRiskData = group.allRiskData.filter((rd) => rd.risk.insalubridade === insalubridadeType);

  if (noiseRiskData.length === 0) return { conclusion, hasInsalubridade: false };

  // Get the characterization name based on group type
  const characterizationName = getCharacterizationNameForConclusion(group, hierarchyTree);

  // Get noise-specific info
  const toleranceLimit = getNoiseToleranteLimit(insalubridadeType);
  // Get grauInsalubridade from the first risk data (all should have the same for the same risk type)
  const grauFromRisk = noiseRiskData[0]?.risk?.grauInsalubridade ?? null;
  const grauInsalubridade = getGrauInsalubridadeLabel(grauFromRisk);
  const anexoName = getNoiseAnexoName(insalubridadeType);
  const noiseTypeName = getNoiseTypeName(insalubridadeType);
  const noiseUnit = getNoiseUnit(insalubridadeType);

  // Check if we have quantitative data
  const hasQuantitativeData = noiseRiskData.some((rd) => rd.isQuantity && rd.quantityNoise);

  if (!hasQuantitativeData) {
    // Inconclusivo — Sem medições
    conclusion.push({
      type: DocumentChildrenTypeEnum.H3,
      text: `Conclusão — ${characterizationName}`,
    });
    conclusion.push({
      type: DocumentChildrenTypeEnum.PARAGRAPH,
      text: 'Não é possível concluir quanto à caracterização da insalubridade para esta caracterização específica, uma vez que o critério de avaliação aplicável é quantitativo e não há medições registradas no GRO, condição indispensável para a análise conforme a NR-15.',
    });
    return { conclusion, hasInsalubridade: false };
  }

  // Analyze quantitative data
  // probability >= 5 means above tolerance limit (85 dB(A) for Anexo 1, 120 dB(C) for Anexo 2)
  // This is now correctly calculated at the RiskDataQuantityNoiseVO level based on appendix
  const riskDataAboveLimit = noiseRiskData.filter((rd) => {
    if (!rd.quantityNoise) return false;
    return rd.quantityNoise.probability >= 5;
  });

  const riskDataBelowLimit = noiseRiskData.filter((rd) => {
    if (!rd.quantityNoise) return false;
    // Has measurement but not above limit
    const hasMeasurement = rd.quantityNoise.probability > 0;
    return hasMeasurement && rd.quantityNoise.probability < 5;
  });

  // Check if there are efficient EPIs
  const hasEfficientEPI = riskDataAboveLimit.some((rd) => {
    return rd.epis.some((epi) => epi.efficientlyCheck);
  });

  // Get the measured value (highest one if multiple)
  let measuredValue: { value: string; source: string } | null = null;
  const allRiskDataWithNoise = [...riskDataAboveLimit, ...riskDataBelowLimit];
  for (const rd of allRiskDataWithNoise) {
    if (rd.quantityNoise) {
      const measured = getMeasuredNoiseValue(rd.quantityNoise);
      if (measured) {
        measuredValue = measured;
        break; // Use the first one found (from above limit data first)
      }
    }
  }

  conclusion.push({
    type: DocumentChildrenTypeEnum.H3,
    text: `Conclusão — ${characterizationName}`,
  });

  if (riskDataAboveLimit.length > 0) {
    const measuredText = measuredValue ? ` de ${measuredValue.value} ${noiseUnit}` : '';

    if (hasEfficientEPI) {
      // NPS > LT mas com EPI eficaz — Neutralizado (NÃO é insalubre)
      conclusion.push({
        type: DocumentChildrenTypeEnum.PARAGRAPH,
        text: `Para a presente caracterização específica, vinculada aos cargos analisados, verifica-se que os NPS de ${noiseTypeName.toLowerCase()} mensurados${measuredText} excedem o limite de tolerância de ${toleranceLimit} para jornada de 8 horas, conforme critérios estabelecidos no ${anexoName}, caracterizando, em princípio, condição insalubre em ${grauInsalubridade}.\n\nEntretanto, ficou comprovado no GRO que foram adotadas, previamente, medidas de proteção coletiva e administrativa, e que o Equipamento de Proteção Individual – EPI auditivo fornecido é tecnicamente adequado ao agente, possui Certificado de Aprovação válido, apresenta atenuação compatível com os níveis de exposição, e teve seu uso contínuo, correto e ininterrupto ao longo da jornada devidamente observado, incluindo treinamento, higienização, manutenção e substituição periódica, conforme exigências legais.\n\nDessa forma, nos termos do item 15.4 da NR-15, resta caracterizada a neutralização da insalubridade pelo uso eficaz do EPI, não sendo devido o adicional de insalubridade para esta caracterização específica, enquanto mantidas as mesmas condições de exposição, controle e uso efetivo do EPI.`,
      });
      return { conclusion, hasInsalubridade: false }; // Neutralizado = NÃO insalubre
    } else {
      // NPS > LT — Insalubre
      conclusion.push({
        type: DocumentChildrenTypeEnum.PARAGRAPH,
        text: `Com base nos resultados das avaliações quantitativas de ruído registradas no GRO para esta caracterização, verifica-se que os níveis de pressão sonora medidos${measuredText} ultrapassam o limite de tolerância de ${toleranceLimit} estabelecido no ${anexoName}. As medições foram realizadas conforme metodologia técnica aplicável e representam adequadamente a exposição ocupacional dos trabalhadores vinculados aos cargos desta caracterização.\n\nAs medidas de controle coletivo e os Equipamentos de Proteção Individual (EPI) informados no GRO não se mostraram eficazes para neutralizar a exposição ao ruído acima do limite legal.\n\nConclui-se, portanto, pela caracterização da insalubridade para os cargos vinculados a esta caracterização, em decorrência da exposição ocupacional ao ${noiseTypeName.toLowerCase()} acima do limite de tolerância. O grau de insalubridade aplicável ao fator de risco ${noiseTypeName} é ${grauInsalubridade}, conforme estabelecido no ${anexoName}.\n\nEsta conclusão restringe-se exclusivamente aos cargos vinculados a esta caracterização específica.`,
      });
      return { conclusion, hasInsalubridade: true }; // Insalubre
    }
  } else if (riskDataBelowLimit.length > 0) {
    const measuredText = measuredValue ? ` (${measuredValue.value} ${noiseUnit})` : '';

    // NPS < LT — Não Insalubre
    conclusion.push({
      type: DocumentChildrenTypeEnum.PARAGRAPH,
      text: `Com base nos resultados das avaliações quantitativas de ruído associadas à caracterização analisada, verifica-se que os Níveis de Pressão Sonora (NPS)${measuredText} permaneceram abaixo do limite de tolerância de ${toleranceLimit} previsto no ${anexoName}. As medições registradas representam adequadamente a exposição ocupacional decorrente da execução das atividades vinculadas aos cargos desta caracterização.\n\nConclui-se, portanto, pela não caracterização da insalubridade para os cargos vinculados a esta caracterização.`,
    });
    return { conclusion, hasInsalubridade: false }; // Não insalubre
  }

  return { conclusion, hasInsalubridade: false };
};

// Helper function to get the measured IBUTG value
const getMeasuredHeatValue = (quantityHeat: RiskDataQuantityHeatVO): { ibutg: string; limit: string } | null => {
  if (quantityHeat.ibtug && quantityHeat.ibtugLEO) {
    return {
      ibutg: quantityHeat.ibtug.toFixed(1),
      limit: quantityHeat.ibtugLEO.ibtug.toFixed(1),
    };
  }
  return null;
};

// Helper function to analyze insalubridade conclusion for heat (quantitative - Anexo 3)
// Returns: { conclusion: ISectionChildrenType[], hasInsalubridade: boolean }
const getHeatInsalubridadeConclusion = ({
  group,
  hierarchyTree,
}: {
  group: HomogeneousGroupModel;
  hierarchyTree: IHierarchyMap;
}): { conclusion: ISectionChildrenType[]; hasInsalubridade: boolean } => {
  const conclusion: ISectionChildrenType[] = [];

  // Get all heat risk data for this group
  const heatRiskData = group.allRiskData.filter((rd) => rd.risk.insalubridade === RiskInsalubridadeEnum.CALOR_3);

  if (heatRiskData.length === 0) return { conclusion, hasInsalubridade: false };

  // Get the characterization name based on group type
  const characterizationName = getCharacterizationNameForConclusion(group, hierarchyTree);

  // Get grauInsalubridade from the first risk data (all should have the same for the same risk type)
  const grauFromRisk = heatRiskData[0]?.risk?.grauInsalubridade ?? null;
  const grauInsalubridade = getGrauInsalubridadeLabel(grauFromRisk);

  // Check if we have quantitative data
  const hasQuantitativeData = heatRiskData.some((rd) => rd.isQuantity && rd.quantityHeat);

  if (!hasQuantitativeData) {
    // Inconclusivo — Sem medições
    conclusion.push({
      type: DocumentChildrenTypeEnum.H3,
      text: `Conclusão — ${characterizationName}`,
    });
    conclusion.push({
      type: DocumentChildrenTypeEnum.PARAGRAPH,
      text: 'Não é possível concluir quanto à caracterização da insalubridade para esta caracterização específica, uma vez que o critério de avaliação aplicável é quantitativo e não há medições de IBUTG registradas no GRO, condição indispensável para a análise conforme o Anexo 3 da NR-15.',
    });
    return { conclusion, hasInsalubridade: false };
  }

  // Analyze quantitative data
  // probability >= 5 means IBUTG > LEO (above tolerance limit - insalubre)
  const riskDataAboveLimit = heatRiskData.filter((rd) => {
    if (!rd.quantityHeat) return false;
    return rd.quantityHeat.probability >= 5;
  });

  // probability < 5 and > 0 means IBUTG <= LEO (below tolerance limit - não insalubre)
  const riskDataBelowLimit = heatRiskData.filter((rd) => {
    if (!rd.quantityHeat) return false;
    return rd.quantityHeat.probability > 0 && rd.quantityHeat.probability < 5;
  });

  // Check if there are efficient EPIs
  const hasEfficientEPI = riskDataAboveLimit.some((rd) => {
    return rd.epis.some((epi) => epi.efficientlyCheck);
  });

  // Get the measured value (highest one if multiple)
  let measuredValue: { ibutg: string; limit: string } | null = null;
  const allRiskDataWithHeat = [...riskDataAboveLimit, ...riskDataBelowLimit];
  for (const rd of allRiskDataWithHeat) {
    if (rd.quantityHeat) {
      const measured = getMeasuredHeatValue(rd.quantityHeat);
      if (measured) {
        measuredValue = measured;
        break; // Use the first one found (from above limit data first)
      }
    }
  }

  conclusion.push({
    type: DocumentChildrenTypeEnum.H3,
    text: `Conclusão — ${characterizationName}`,
  });

  if (riskDataAboveLimit.length > 0) {
    const measuredText = measuredValue ? ` de ${measuredValue.ibutg} °C` : '';
    const limitText = measuredValue ? measuredValue.limit : 'LEO';

    if (hasEfficientEPI) {
      // IBUTG > LEO mas com EPI eficaz — Neutralizado (NÃO é insalubre)
      conclusion.push({
        type: DocumentChildrenTypeEnum.PARAGRAPH,
        text: `Para a presente caracterização específica, vinculada aos cargos analisados, verifica-se que o IBUTG mensurado${measuredText} excede o Limite de Exposição Ocupacional (LEO) de ${limitText} °C, conforme critérios estabelecidos no Anexo 3 da NR-15, caracterizando, em princípio, condição insalubre em ${grauInsalubridade}.\n\nEntretanto, ficou comprovado no GRO que foram adotadas, previamente, medidas de proteção coletiva e administrativa, e que os Equipamentos de Proteção Individual fornecidos são tecnicamente adequados ao agente, possuem Certificado de Aprovação válido, e tiveram seu uso contínuo, correto e ininterrupto ao longo da jornada devidamente observado, conforme exigências legais.\n\nDessa forma, nos termos do item 15.4 da NR-15, resta caracterizada a neutralização da insalubridade pelo uso eficaz das medidas de controle, não sendo devido o adicional de insalubridade para esta caracterização específica, enquanto mantidas as mesmas condições de exposição e controle.`,
      });
      return { conclusion, hasInsalubridade: false }; // Neutralizado = NÃO insalubre
    } else {
      // IBUTG > LEO — Insalubre
      conclusion.push({
        type: DocumentChildrenTypeEnum.PARAGRAPH,
        text: `Com base nos resultados das avaliações quantitativas de calor registradas no GRO para esta caracterização, verifica-se que o IBUTG medido${measuredText} ultrapassa o Limite de Exposição Ocupacional (LEO) de ${limitText} °C estabelecido no Anexo 3 da NR-15, considerando a taxa metabólica da atividade e o regime de trabalho. As medições foram realizadas conforme metodologia técnica aplicável e representam adequadamente a exposição ocupacional dos trabalhadores vinculados aos cargos desta caracterização.\n\nAs medidas de controle coletivo e os Equipamentos de Proteção Individual (EPI) informados no GRO não se mostraram eficazes para neutralizar a exposição ao calor acima do limite legal.\n\nConclui-se, portanto, pela caracterização da insalubridade para os cargos vinculados a esta caracterização, em decorrência da exposição ocupacional ao calor acima do limite de tolerância. O grau de insalubridade aplicável ao fator de risco Calor é ${grauInsalubridade}, conforme estabelecido no Anexo 3 da NR-15.\n\nEsta conclusão restringe-se exclusivamente aos cargos vinculados a esta caracterização específica.`,
      });
      return { conclusion, hasInsalubridade: true }; // Insalubre
    }
  } else if (riskDataBelowLimit.length > 0) {
    const measuredText = measuredValue ? ` (${measuredValue.ibutg} °C)` : '';
    const limitText = measuredValue ? measuredValue.limit : 'LEO';

    // IBUTG <= LEO — Não Insalubre
    conclusion.push({
      type: DocumentChildrenTypeEnum.PARAGRAPH,
      text: `Com base nos resultados das avaliações quantitativas de calor associadas à caracterização analisada, verifica-se que o IBUTG${measuredText} permaneceu abaixo do Limite de Exposição Ocupacional (LEO) de ${limitText} °C previsto no Anexo 3 da NR-15, considerando a taxa metabólica da atividade e o regime de trabalho. As medições registradas representam adequadamente a exposição ocupacional decorrente da execução das atividades vinculadas aos cargos desta caracterização.\n\nConclui-se, portanto, pela não caracterização da insalubridade para os cargos vinculados a esta caracterização.`,
    });
    return { conclusion, hasInsalubridade: false }; // Não insalubre
  }

  return { conclusion, hasInsalubridade: false };
};

// Helper function to analyze insalubridade conclusion for ionizing radiation (qualitative - Anexo 5)
// PARTICULARIDADES DO ANEXO 5:
// - Critério QUALITATIVO (não quantitativo)
// - Grau MÁXIMO (40%)
// - NÃO exige exposição habitual e permanente (diferente de outros qualitativos)
// - Baseado na análise de atividade com material radioativo + controles de radioproteção
// - Referência: CNEN NN 3.01 – Diretrizes Básicas de Proteção Radiológica
// - REQUER: atividade real E atividade equivalente cadastradas
// Returns: { conclusion: ISectionChildrenType[], hasInsalubridade: boolean }
const getRadiacaoIonizanteInsalubridadeConclusion = ({
  group,
  hierarchyTree,
}: {
  group: HomogeneousGroupModel;
  hierarchyTree: IHierarchyMap;
}): { conclusion: ISectionChildrenType[]; hasInsalubridade: boolean } => {
  const conclusion: ISectionChildrenType[] = [];

  // Get all ionizing radiation risk data for this group
  const allRadiationRiskData = group.allRiskData.filter((rd) => rd.risk.insalubridade === RiskInsalubridadeEnum.RADIACAO_IONIZANTE_5);

  // For qualitative risks, filter only those with realActivity AND equivalent activities
  const radiationRiskData = filterQualitativeRiskDataWithActivities(allRadiationRiskData);

  if (radiationRiskData.length === 0) return { conclusion, hasInsalubridade: false };

  // Get the characterization name based on group type
  const characterizationName = getCharacterizationNameForConclusion(group, hierarchyTree);

  // Get grauInsalubridade from the first risk data
  // For Anexo 5, the default is MAX (40%)
  const grauFromRisk = radiationRiskData[0]?.risk?.grauInsalubridade ?? 'MAX';
  const grauInsalubridade = getGrauInsalubridadeLabel(grauFromRisk);

  // Format activities text for all risk data
  const activitiesTexts = radiationRiskData.map((rd) => formatQualitativeActivitiesText(rd)).filter((t) => t.length > 0);
  const activitiesSection = activitiesTexts.length > 0 ? `\n\n${activitiesTexts.join('\n\n')}` : '';

  // Check if there are efficient EPIs that can neutralize the risk
  const hasEfficientEPI = radiationRiskData.some((rd) => {
    return rd.epis.some((epi) => epi.efficientlyCheck);
  });

  conclusion.push({
    type: DocumentChildrenTypeEnum.H3,
    text: `Conclusão — ${characterizationName}`,
  });

  if (hasEfficientEPI) {
    // Atividade com exposição + EPI eficaz — Neutralizado (NÃO é insalubre)
    conclusion.push({
      type: DocumentChildrenTypeEnum.PARAGRAPH,
      text: `Para a presente caracterização específica, vinculada aos cargos analisados, verifica-se que as atividades ou operações descritas no GRO envolvem exposição ocupacional a radiações ionizantes, conforme critérios, princípios e controles de proteção radiológica estabelecidos no Anexo 5 da NR-15 e na Norma CNEN NN 3.01 – Diretrizes Básicas de Proteção Radiológica, caracterizando, em princípio, condição insalubre em ${grauInsalubridade}.${activitiesSection}\n\nEntretanto, ficou comprovado no GRO que foram adotadas medidas de proteção radiológica adequadas, incluindo procedimentos operacionais, medidas de proteção coletiva e Equipamentos de Proteção Individual tecnicamente adequados ao agente, em conformidade com as normas da CNEN e os princípios ALARA (As Low As Reasonably Achievable).\n\nDessa forma, nos termos do item 15.4 da NR-15, resta caracterizada a neutralização da insalubridade pelas medidas de controle adotadas, não sendo devido o adicional de insalubridade para esta caracterização específica, enquanto mantidas as mesmas condições de exposição e controle.`,
    });
    return { conclusion, hasInsalubridade: false }; // Neutralizado = NÃO insalubre
  } else {
    // Atividade com exposição a radiações ionizantes — Insalubre
    // NOTA: Anexo 5 NÃO exige exposição habitual e permanente
    conclusion.push({
      type: DocumentChildrenTypeEnum.PARAGRAPH,
      text: `Com base na análise qualitativa das atividades registradas no GRO para esta caracterização, verifica-se que as atividades ou operações descritas envolvem exposição ocupacional a radiações ionizantes, conforme critérios, princípios e controles de proteção radiológica estabelecidos no Anexo 5 da NR-15 e na Norma CNEN NN 3.01 – Diretrizes Básicas de Proteção Radiológica.${activitiesSection}\n\nA caracterização da insalubridade por exposição a radiações ionizantes independe da habitualidade ou permanência da exposição, bastando a comprovação do contato com material radioativo ou exposição a fontes de radiação ionizante no exercício da atividade laboral.\n\nAs medidas de controle informadas no GRO não se mostraram eficazes para neutralizar a exposição às radiações ionizantes.\n\nConclui-se, portanto, pela caracterização da insalubridade para os cargos vinculados a esta caracterização, em decorrência da exposição ocupacional a radiações ionizantes. O grau de insalubridade aplicável ao fator de risco Radiações Ionizantes é ${grauInsalubridade}, conforme estabelecido no Anexo 5 da NR-15.\n\nEsta conclusão restringe-se exclusivamente aos cargos vinculados a esta caracterização específica.`,
    });
    return { conclusion, hasInsalubridade: true }; // Insalubre
  }
};

// Pressões Hiperbáricas (Anexo 6) — Qualitative criterion
// - Grau Máximo (40%)
// - Applies to work in environments with pressure higher than atmospheric
// - Applies to diving, caissons, hyperbaric chambers, tunnel construction, etc.
// - Does NOT require habitual/permanent exposure (similar to Anexo 5)
// - REQUER: atividade real E atividade equivalente cadastradas
// Returns: { conclusion: ISectionChildrenType[], hasInsalubridade: boolean }
const getPressaoHiperbaricaInsalubridadeConclusion = ({
  group,
  hierarchyTree,
}: {
  group: HomogeneousGroupModel;
  hierarchyTree: IHierarchyMap;
}): { conclusion: ISectionChildrenType[]; hasInsalubridade: boolean } => {
  const conclusion: ISectionChildrenType[] = [];

  // Get all hyperbaric pressure risk data for this group
  const allHyperbaricRiskData = group.allRiskData.filter((rd) => rd.risk.insalubridade === RiskInsalubridadeEnum.PRESSAO_HIPERBARICA_6);

  // For qualitative risks, filter only those with realActivity AND equivalent activities
  const hyperbaricRiskData = filterQualitativeRiskDataWithActivities(allHyperbaricRiskData);

  if (hyperbaricRiskData.length === 0) return { conclusion, hasInsalubridade: false };

  // Get the characterization name based on group type
  const characterizationName = getCharacterizationNameForConclusion(group, hierarchyTree);

  // Get grauInsalubridade from the first risk data
  // For Anexo 6, the default is MAX (40%)
  const grauFromRisk = hyperbaricRiskData[0]?.risk?.grauInsalubridade ?? 'MAX';
  const grauInsalubridade = getGrauInsalubridadeLabel(grauFromRisk);

  // Format activities text for all risk data
  const activitiesTexts = hyperbaricRiskData.map((rd) => formatQualitativeActivitiesText(rd)).filter((t) => t.length > 0);
  const activitiesSection = activitiesTexts.length > 0 ? `\n\n${activitiesTexts.join('\n\n')}` : '';

  // Check if there are efficient EPIs that can neutralize the risk
  const hasEfficientEPI = hyperbaricRiskData.some((rd) => {
    return rd.epis.some((epi) => epi.efficientlyCheck);
  });

  conclusion.push({
    type: DocumentChildrenTypeEnum.H3,
    text: `Conclusão — ${characterizationName}`,
  });

  if (hasEfficientEPI) {
    // Atividade com exposição + EPI eficaz — Neutralizado (NÃO é insalubre)
    conclusion.push({
      type: DocumentChildrenTypeEnum.PARAGRAPH,
      text: `Para a presente caracterização específica, vinculada aos cargos analisados, verifica-se que as atividades ou operações descritas no GRO envolvem exposição ocupacional a condições hiperbáricas — isto é, trabalho em ambientes com pressão atmosférica superior à pressão ambiente no nível do mar — conforme disposto no Anexo 6 da NR-15, caracterizando, em princípio, condição insalubre em ${grauInsalubridade}.${activitiesSection}\n\nEntretanto, ficou comprovado no GRO que foram adotadas medidas de controle adequadas, incluindo procedimentos operacionais específicos para trabalhos em condições hiperbáricas (descompressão, tempo de fundo, limites de exposição), medidas de proteção coletiva e Equipamentos de Proteção Individual tecnicamente adequados ao agente.\n\nDessa forma, nos termos do item 15.4 da NR-15, resta caracterizada a neutralização da insalubridade pelas medidas de controle adotadas, não sendo devido o adicional de insalubridade para esta caracterização específica, enquanto mantidas as mesmas condições de exposição e controle.`,
    });
    return { conclusion, hasInsalubridade: false }; // Neutralizado = NÃO insalubre
  } else {
    // Atividade com exposição a pressões hiperbáricas — Insalubre
    // NOTA: Anexo 6 NÃO exige exposição habitual e permanente (similar ao Anexo 5)
    conclusion.push({
      type: DocumentChildrenTypeEnum.PARAGRAPH,
      text: `Com base na análise qualitativa das atividades registradas no GRO para esta caracterização, verifica-se que as atividades ou operações descritas envolvem exposição ocupacional a condições hiperbáricas — isto é, trabalho em ambientes com pressão atmosférica superior à pressão ambiente no nível do mar — conforme disposto no Anexo 6 da NR-15.${activitiesSection}\n\nO Anexo 6 da NR-15 contempla atividades executadas sob condições hiperbáricas, tais como trabalhos submersos (mergulho profissional), trabalho em tubulões de ar comprimido, trabalho em caixões pneumáticos (caissons) e outras atividades em ambientes pressurizados. A caracterização da insalubridade por exposição a pressões hiperbáricas decorre da natureza e das características da atividade executada, conforme critérios técnicos estabelecidos no referido Anexo.\n\nAs medidas de controle informadas no GRO não se mostraram eficazes para neutralizar a exposição às condições hiperbáricas.\n\nConclui-se, portanto, pela caracterização da insalubridade para os cargos vinculados a esta caracterização, em decorrência da exposição ocupacional a pressões hiperbáricas. O grau de insalubridade aplicável ao fator de risco Pressões Hiperbáricas é ${grauInsalubridade}, conforme estabelecido no Anexo 6 da NR-15.\n\nEsta conclusão restringe-se exclusivamente aos cargos vinculados a esta caracterização específica.`,
    });
    return { conclusion, hasInsalubridade: true }; // Insalubre
  }
};

// Radiações Não Ionizantes (Anexo 7) — Qualitative criterion
// - Grau Médio (20%)
// - Applies to exposure to non-ionizing radiation sources (micro-waves, ultraviolet, laser)
// - Does NOT require habitual/permanent exposure (similar to Anexo 5 and 6)
// - REQUER: atividade real E atividade equivalente cadastradas
// Returns: { conclusion: ISectionChildrenType[], hasInsalubridade: boolean }
const getRadiacaoNaoIonizanteInsalubridadeConclusion = ({
  group,
  hierarchyTree,
}: {
  group: HomogeneousGroupModel;
  hierarchyTree: IHierarchyMap;
}): { conclusion: ISectionChildrenType[]; hasInsalubridade: boolean } => {
  const conclusion: ISectionChildrenType[] = [];

  // Get all non-ionizing radiation risk data for this group
  const allNonIonizingRiskData = group.allRiskData.filter((rd) => rd.risk.insalubridade === RiskInsalubridadeEnum.RADIACAO_NAO_IONIZANTE_7);

  // For qualitative risks, filter only those with realActivity AND equivalent activities
  const nonIonizingRiskData = filterQualitativeRiskDataWithActivities(allNonIonizingRiskData);

  if (nonIonizingRiskData.length === 0) return { conclusion, hasInsalubridade: false };

  // Get the characterization name based on group type
  const characterizationName = getCharacterizationNameForConclusion(group, hierarchyTree);

  // Get grauInsalubridade from the first risk data
  // For Anexo 7, the default is MED (20%)
  const grauFromRisk = nonIonizingRiskData[0]?.risk?.grauInsalubridade ?? 'MED';
  const grauInsalubridade = getGrauInsalubridadeLabel(grauFromRisk);

  // Format activities text for all risk data
  const activitiesTexts = nonIonizingRiskData.map((rd) => formatQualitativeActivitiesText(rd)).filter((t) => t.length > 0);
  const activitiesSection = activitiesTexts.length > 0 ? `\n\n${activitiesTexts.join('\n\n')}` : '';

  // Check if there are efficient EPIs that can neutralize the risk
  const hasEfficientEPI = nonIonizingRiskData.some((rd) => {
    return rd.epis.some((epi) => epi.efficientlyCheck);
  });

  conclusion.push({
    type: DocumentChildrenTypeEnum.H3,
    text: `Conclusão — ${characterizationName}`,
  });

  if (hasEfficientEPI) {
    // Atividade com exposição + EPI eficaz — Neutralizado (NÃO é insalubre)
    conclusion.push({
      type: DocumentChildrenTypeEnum.PARAGRAPH,
      text: `Para a presente caracterização específica, vinculada aos cargos analisados, verifica-se que as atividades ou operações descritas no GRO envolvem exposição ocupacional a radiações não ionizantes (micro-ondas, ultravioleta e/ou laser), conforme disposto no Anexo 7 da NR-15, caracterizando, em princípio, condição insalubre em ${grauInsalubridade}.${activitiesSection}\n\nEntretanto, ficou comprovado no GRO que foram adotadas medidas de controle adequadas, incluindo procedimentos operacionais específicos, medidas de proteção coletiva (blindagens, barreiras, enclausuramento de fontes) e Equipamentos de Proteção Individual tecnicamente adequados ao agente (óculos de proteção, vestimentas, protetores faciais).\n\nDessa forma, nos termos do item 15.4 da NR-15, resta caracterizada a neutralização da insalubridade pelas medidas de controle adotadas, não sendo devido o adicional de insalubridade para esta caracterização específica, enquanto mantidas as mesmas condições de exposição e controle.`,
    });
    return { conclusion, hasInsalubridade: false }; // Neutralizado = NÃO insalubre
  } else {
    // Atividade com exposição a radiações não ionizantes — Insalubre
    // NOTA: Anexo 7 NÃO exige exposição habitual e permanente (similar aos Anexos 5 e 6)
    conclusion.push({
      type: DocumentChildrenTypeEnum.PARAGRAPH,
      text: `Com base na análise qualitativa das atividades registradas no GRO para esta caracterização, verifica-se que as atividades ou operações descritas envolvem exposição ocupacional a radiações não ionizantes, conforme disposto no Anexo 7 da NR-15.${activitiesSection}\n\nO Anexo 7 da NR-15 contempla atividades ou operações que exponham os trabalhadores a radiações não ionizantes, tais como micro-ondas, ultravioleta e laser, sem a proteção adequada. A caracterização da insalubridade por exposição a radiações não ionizantes decorre da natureza da atividade executada e do contato com fontes emissoras desses tipos de radiação.\n\nAs medidas de controle informadas no GRO não se mostraram eficazes para neutralizar a exposição às radiações não ionizantes.\n\nConclui-se, portanto, pela caracterização da insalubridade para os cargos vinculados a esta caracterização, em decorrência da exposição ocupacional a radiações não ionizantes. O grau de insalubridade aplicável ao fator de risco Radiações Não Ionizantes é ${grauInsalubridade}, conforme estabelecido no Anexo 7 da NR-15.\n\nEsta conclusão restringe-se exclusivamente aos cargos vinculados a esta caracterização específica.`,
    });
    return { conclusion, hasInsalubridade: true }; // Insalubre
  }
};

// Helper function to get vibration conclusion (Anexo 8 - Vibrações)
// Quantitative criterion with variable grau depending on the specific vibration type
const getVibracaoInsalubridadeConclusion = ({
  group,
  hierarchyTree,
}: {
  group: HomogeneousGroupModel;
  hierarchyTree: IHierarchyMap;
}): { conclusion: ISectionChildrenType[]; hasInsalubridade: boolean } => {
  const conclusion: ISectionChildrenType[] = [];

  // Get risk data for VIBRACAO_8
  const vibrationRiskData = group.allRiskData.filter((rd) => rd.risk.insalubridade === RiskInsalubridadeEnum.VIBRACAO_8);

  if (vibrationRiskData.length === 0) return { conclusion, hasInsalubridade: false };

  // Get the characterization name based on group type
  const characterizationName = getCharacterizationNameForConclusion(group, hierarchyTree);

  // Get grauInsalubridade from the first risk data
  // For Anexo 8, the grau is variable (depends on the specific risk)
  const grauFromRisk = vibrationRiskData[0]?.risk?.grauInsalubridade ?? 'MED';
  const grauInsalubridade = getGrauInsalubridadeLabel(grauFromRisk);

  // Check if we have quantitative data
  const hasQuantitativeData = vibrationRiskData.some(
    (rd) => rd.isQuantity && (rd.quantityVibrationFB || rd.quantityVibrationL),
  );

  if (!hasQuantitativeData) {
    // Inconclusivo — Sem medições
    conclusion.push({
      type: DocumentChildrenTypeEnum.H3,
      text: `Conclusão — ${characterizationName}`,
    });
    conclusion.push({
      type: DocumentChildrenTypeEnum.PARAGRAPH,
      text: `Apesar de haver exposição ocupacional a vibrações registrada no GRO para esta caracterização, não foram identificados dados quantitativos (medições de aceleração) suficientes para a avaliação segundo os critérios do Anexo 8 da NR-15.\n\nA caracterização técnica da insalubridade por vibrações depende da realização de avaliações quantitativas (aren e/ou vdvr) conforme metodologia técnica reconhecida.\n\nRecomenda-se a realização de avaliação quantitativa para conclusão definitiva.`,
    });
    return { conclusion, hasInsalubridade: false };
  }

  // Get the risk data with vibration measurements
  const riskDataWithVibration = vibrationRiskData.filter(
    (rd) => rd.isQuantity && (rd.quantityVibrationFB || rd.quantityVibrationL),
  );

  // Check if any vibration measurement exceeds the tolerance limit (probability >= 5)
  const riskDataAboveLimit = riskDataWithVibration.filter((rd) => {
    const vfbProb = rd.quantityVibrationFB?.probability || 0;
    const vlProb = rd.quantityVibrationL?.probability || 0;
    return vfbProb >= 5 || vlProb >= 5;
  });

  // Get measured values for the conclusion text
  const getMeasuredVibrationValues = (rd: RiskDataModel): string[] => {
    const values: string[] = [];
    if (rd.quantityVibrationFB?.aren) {
      values.push(`aren = ${rd.quantityVibrationFB.aren} m/s² (corpo inteiro)`);
    }
    if (rd.quantityVibrationFB?.vdvr) {
      values.push(`vdvr = ${rd.quantityVibrationFB.vdvr} m/s^1,75 (corpo inteiro)`);
    }
    if (rd.quantityVibrationL?.aren) {
      values.push(`aren = ${rd.quantityVibrationL.aren} m/s² (mãos e braços)`);
    }
    return values;
  };

  // Determine which limit was exceeded
  const getLimitText = (rd: RiskDataModel): string => {
    const vfbArenLimit = '1,1 m/s² (aren - corpo inteiro)';
    const vfbVdvrLimit = '21 m/s^1,75 (vdvr - corpo inteiro)';
    const vlArenLimit = '5 m/s² (aren - mãos e braços)';

    const limits: string[] = [];
    if (rd.quantityVibrationFB?.arenProb && rd.quantityVibrationFB.arenProb >= 5) {
      limits.push(vfbArenLimit);
    }
    if (rd.quantityVibrationFB?.vdvrProb && rd.quantityVibrationFB.vdvrProb >= 5) {
      limits.push(vfbVdvrLimit);
    }
    if (rd.quantityVibrationL?.arenProb && rd.quantityVibrationL.arenProb >= 5) {
      limits.push(vlArenLimit);
    }
    return limits.length > 0 ? limits.join(' ou ') : 'limite de tolerância estabelecido no Anexo 8 da NR-15';
  };

  conclusion.push({
    type: DocumentChildrenTypeEnum.H3,
    text: `Conclusão — ${characterizationName}`,
  });

  if (riskDataAboveLimit.length === 0) {
    // Não insalubre — Abaixo do limite
    conclusion.push({
      type: DocumentChildrenTypeEnum.PARAGRAPH,
      text: `Com base na avaliação quantitativa das vibrações registradas no GRO para esta caracterização, verifica-se que os valores de aceleração medidos encontram-se abaixo dos limites de tolerância estabelecidos no Anexo 8 da NR-15.\n\nPara vibrações de corpo inteiro (VCI), os limites são aren ≤ 1,1 m/s² e vdvr ≤ 21 m/s^1,75. Para vibrações transmitidas a mãos e braços (VMB), o limite é aren ≤ 5 m/s².\n\nConclui-se, portanto, pela não caracterização da insalubridade para os cargos vinculados a esta caracterização, uma vez que a exposição ocupacional a vibrações não ultrapassa os limites de tolerância normativos.\n\nEsta conclusão restringe-se exclusivamente aos cargos vinculados a esta caracterização específica.`,
    });
    return { conclusion, hasInsalubridade: false };
  }

  // Get the first risk data above limit for the conclusion
  const mainRiskData = riskDataAboveLimit[0];
  const measuredValues = getMeasuredVibrationValues(mainRiskData);

  // Check if there are efficient EPIs that can neutralize the risk
  const hasEfficientEPI = riskDataAboveLimit.some((rd) => {
    return rd.epis.some((epi) => epi.efficientlyCheck);
  });

  // Scenario: EPI neutralizes the risk
  if (hasEfficientEPI) {
    conclusion.push({
      type: DocumentChildrenTypeEnum.PARAGRAPH,
      text: `Com base na avaliação quantitativa das vibrações registradas no GRO para esta caracterização, verifica-se que os valores de aceleração medidos (${measuredValues.join('; ')}) ultrapassam o ${getLimitText(mainRiskData)}.\n\nNo entanto, as medidas de controle informadas no GRO, especialmente os Equipamentos de Proteção Individual (luvas antivibração, sistemas de isolamento, assentos com amortecimento), são tecnicamente adequadas e apresentam eficácia comprovada para reduzir os níveis de vibração transmitidos ao trabalhador a patamares abaixo dos limites de tolerância estabelecidos no Anexo 8 da NR-15.\n\nConclui-se, portanto, pela não caracterização da insalubridade para os cargos vinculados a esta caracterização, em razão da neutralização do risco por meio das medidas de proteção adotadas.\n\nEsta conclusão restringe-se exclusivamente aos cargos vinculados a esta caracterização específica.`,
    });
    return { conclusion, hasInsalubridade: false }; // Neutralizado
  } else {
    // Scenario: Insalubre
    conclusion.push({
      type: DocumentChildrenTypeEnum.PARAGRAPH,
      text: `Com base na avaliação quantitativa das vibrações registradas no GRO para esta caracterização, verifica-se que os valores de aceleração medidos (${measuredValues.join('; ')}) ultrapassam o ${getLimitText(mainRiskData)}.\n\nO Anexo 8 da NR-15 estabelece limites de tolerância para vibrações transmitidas ao corpo inteiro (VCI) e para vibrações transmitidas às mãos e braços (VMB). A caracterização da insalubridade ocorre quando os valores de aceleração resultante de exposição normalizada (aren) ou dose de vibração resultante (vdvr) ultrapassam os limites de tolerância definidos, considerando a jornada de trabalho e a metodologia de medição aplicável.\n\nAs medidas de controle informadas no GRO não se mostraram eficazes para neutralizar a exposição às vibrações.\n\nConclui-se, portanto, pela caracterização da insalubridade para os cargos vinculados a esta caracterização, em decorrência da exposição ocupacional a vibrações acima dos limites de tolerância. O grau de insalubridade aplicável é ${grauInsalubridade}, conforme estabelecido no Anexo 8 da NR-15 para o agente de risco Vibrações.\n\nEsta conclusão restringe-se exclusivamente aos cargos vinculados a esta caracterização específica.`,
    });
    return { conclusion, hasInsalubridade: true }; // Insalubre
  }
};

// Helper function to get frio (cold) conclusion (Anexo 9 - Frio)
// Qualitative criterion with grau médio (20%)
// - Does NOT require habitual/permanent exposure
// - Based on activities in cold chambers or similar thermal conditions
// - REQUER: atividade real E atividade equivalente cadastradas
// Returns: { conclusion: ISectionChildrenType[], hasInsalubridade: boolean }
const getFrioInsalubridadeConclusion = ({
  group,
  hierarchyTree,
}: {
  group: HomogeneousGroupModel;
  hierarchyTree: IHierarchyMap;
}): { conclusion: ISectionChildrenType[]; hasInsalubridade: boolean } => {
  const conclusion: ISectionChildrenType[] = [];

  // Get all cold risk data for this group
  const allFrioRiskData = group.allRiskData.filter((rd) => rd.risk.insalubridade === RiskInsalubridadeEnum.FRIO_9);

  // For qualitative risks, filter only those with realActivity AND equivalent activities
  const frioRiskData = filterQualitativeRiskDataWithActivities(allFrioRiskData);

  if (frioRiskData.length === 0) return { conclusion, hasInsalubridade: false };

  // Get the characterization name based on group type
  const characterizationName = getCharacterizationNameForConclusion(group, hierarchyTree);

  // Get grauInsalubridade from the first risk data
  // For Anexo 9, the default is MED (20%)
  const grauFromRisk = frioRiskData[0]?.risk?.grauInsalubridade ?? 'MED';
  const grauInsalubridade = getGrauInsalubridadeLabel(grauFromRisk);

  // Format activities text for all risk data
  const activitiesTexts = frioRiskData.map((rd) => formatQualitativeActivitiesText(rd)).filter((t) => t.length > 0);
  const activitiesSection = activitiesTexts.length > 0 ? `\n\n${activitiesTexts.join('\n\n')}` : '';

  // Check if there are efficient EPIs that can neutralize the risk
  const hasEfficientEPI = frioRiskData.some((rd) => {
    return rd.epis.some((epi) => epi.efficientlyCheck);
  });

  conclusion.push({
    type: DocumentChildrenTypeEnum.H3,
    text: `Conclusão — ${characterizationName}`,
  });

  if (hasEfficientEPI) {
    // Atividade com exposição + EPI eficaz — Neutralizado (NÃO é insalubre)
    conclusion.push({
      type: DocumentChildrenTypeEnum.PARAGRAPH,
      text: `Para a presente caracterização específica, vinculada aos cargos analisados, verifica-se que as atividades ou operações descritas no GRO envolvem exposição ocupacional ao frio, em câmaras frigoríficas ou ambientes com condições térmicas similares, conforme disposto no Anexo 9 da NR-15, caracterizando, em princípio, condição insalubre em ${grauInsalubridade}.${activitiesSection}\n\nEntretanto, ficou comprovado no GRO que foram adotadas medidas de controle adequadas, incluindo procedimentos operacionais específicos, medidas de proteção coletiva (sistemas de aquecimento, barreiras térmicas, áreas de recuperação térmica) e Equipamentos de Proteção Individual tecnicamente adequados ao agente (vestimentas térmicas, luvas térmicas, calçados isolantes, proteção para cabeça e face).\n\nDessa forma, nos termos do item 15.4 da NR-15, resta caracterizada a neutralização da insalubridade pelas medidas de controle adotadas, não sendo devido o adicional de insalubridade para esta caracterização específica, enquanto mantidas as mesmas condições de exposição e controle.`,
    });
    return { conclusion, hasInsalubridade: false }; // Neutralizado = NÃO insalubre
  } else {
    // Atividade com exposição ao frio — Insalubre
    // NOTA: Anexo 9 NÃO exige exposição habitual e permanente
    conclusion.push({
      type: DocumentChildrenTypeEnum.PARAGRAPH,
      text: `Com base na análise qualitativa das atividades registradas no GRO para esta caracterização, verifica-se que as atividades ou operações descritas envolvem exposição ocupacional ao frio, em câmaras frigoríficas ou ambientes com condições térmicas similares, conforme disposto no Anexo 9 da NR-15.${activitiesSection}\n\nO Anexo 9 da NR-15 estabelece que as atividades ou operações executadas no interior de câmaras frigoríficas ou em ambientes que apresentem condições térmicas similares, com exposição ocupacional ao frio, sem proteção adequada, serão consideradas insalubres. A caracterização da insalubridade decorre da natureza das atividades executadas e da exposição ao frio no ambiente de trabalho.\n\nAs medidas de controle informadas no GRO não se mostraram eficazes para neutralizar a exposição ao frio.\n\nConclui-se, portanto, pela caracterização da insalubridade para os cargos vinculados a esta caracterização, em decorrência da exposição ocupacional ao frio em câmaras frigoríficas ou ambientes similares. O grau de insalubridade aplicável ao fator de risco Frio é ${grauInsalubridade}, conforme estabelecido no Anexo 9 da NR-15.\n\nEsta conclusão restringe-se exclusivamente aos cargos vinculados a esta caracterização específica.`,
    });
    return { conclusion, hasInsalubridade: true }; // Insalubre
  }
};

// Helper function to get umidade (humidity) conclusion (Anexo 10 - Umidade)
// Qualitative criterion with grau médio (20%)
// - Does NOT require habitual/permanent exposure
// - Based on activities in flooded or waterlogged locations with excessive humidity
// - REQUER: atividade real E atividade equivalente cadastradas
// Returns: { conclusion: ISectionChildrenType[], hasInsalubridade: boolean }
const getUmidadeInsalubridadeConclusion = ({
  group,
  hierarchyTree,
}: {
  group: HomogeneousGroupModel;
  hierarchyTree: IHierarchyMap;
}): { conclusion: ISectionChildrenType[]; hasInsalubridade: boolean } => {
  const conclusion: ISectionChildrenType[] = [];

  // Get all humidity risk data for this group
  const allUmidadeRiskData = group.allRiskData.filter((rd) => rd.risk.insalubridade === RiskInsalubridadeEnum.UMIDADE_10);

  // For qualitative risks, filter only those with realActivity AND equivalent activities
  const umidadeRiskData = filterQualitativeRiskDataWithActivities(allUmidadeRiskData);

  if (umidadeRiskData.length === 0) return { conclusion, hasInsalubridade: false };

  // Get the characterization name based on group type
  const characterizationName = getCharacterizationNameForConclusion(group, hierarchyTree);

  // Get grauInsalubridade from the first risk data
  // For Anexo 10, the default is MED (20%)
  const grauFromRisk = umidadeRiskData[0]?.risk?.grauInsalubridade ?? 'MED';
  const grauInsalubridade = getGrauInsalubridadeLabel(grauFromRisk);

  // Format activities text for all risk data
  const activitiesTexts = umidadeRiskData.map((rd) => formatQualitativeActivitiesText(rd)).filter((t) => t.length > 0);
  const activitiesSection = activitiesTexts.length > 0 ? `\n\n${activitiesTexts.join('\n\n')}` : '';

  // Check if there are efficient EPIs that can neutralize the risk
  const hasEfficientEPI = umidadeRiskData.some((rd) => {
    return rd.epis.some((epi) => epi.efficientlyCheck);
  });

  conclusion.push({
    type: DocumentChildrenTypeEnum.H3,
    text: `Conclusão — ${characterizationName}`,
  });

  if (hasEfficientEPI) {
    // Atividade com exposição + EPI eficaz — Neutralizado (NÃO é insalubre)
    conclusion.push({
      type: DocumentChildrenTypeEnum.PARAGRAPH,
      text: `Para a presente caracterização específica, vinculada aos cargos analisados, verifica-se que as atividades ou operações descritas no GRO envolvem exposição ocupacional à umidade, em locais alagados ou encharcados, conforme disposto no Anexo 10 da NR-15, caracterizando, em princípio, condição insalubre em ${grauInsalubridade}.${activitiesSection}\n\nEntretanto, ficou comprovado no GRO que foram adotadas medidas de controle adequadas, incluindo procedimentos operacionais específicos, medidas de proteção coletiva (drenagem adequada, pisos antiderrapantes, barreiras físicas) e Equipamentos de Proteção Individual tecnicamente adequados ao agente (botas impermeáveis, aventais impermeáveis, luvas de proteção).\n\nDessa forma, nos termos do item 15.4 da NR-15, resta caracterizada a neutralização da insalubridade pelas medidas de controle adotadas, não sendo devido o adicional de insalubridade para esta caracterização específica, enquanto mantidas as mesmas condições de exposição e controle.`,
    });
    return { conclusion, hasInsalubridade: false }; // Neutralizado = NÃO insalubre
  } else {
    // Atividade com exposição à umidade — Insalubre
    // NOTA: Anexo 10 NÃO exige exposição habitual e permanente
    conclusion.push({
      type: DocumentChildrenTypeEnum.PARAGRAPH,
      text: `Com base na análise qualitativa das atividades registradas no GRO para esta caracterização, verifica-se que as atividades ou operações descritas envolvem exposição ocupacional à umidade, em locais alagados ou encharcados, conforme disposto no Anexo 10 da NR-15.${activitiesSection}\n\nO Anexo 10 da NR-15 estabelece que as atividades ou operações executadas em locais alagados ou encharcados, com umidade excessiva, capazes de produzir danos à saúde dos trabalhadores, serão consideradas insalubres em decorrência de laudo de inspeção realizada no local de trabalho. A caracterização da insalubridade decorre da natureza das atividades executadas e da exposição à umidade excessiva no ambiente de trabalho.\n\nAs medidas de controle informadas no GRO não se mostraram eficazes para neutralizar a exposição à umidade.\n\nConclui-se, portanto, pela caracterização da insalubridade para os cargos vinculados a esta caracterização, em decorrência da exposição ocupacional à umidade em locais alagados ou encharcados. O grau de insalubridade aplicável ao fator de risco Umidade é ${grauInsalubridade}, conforme estabelecido no Anexo 10 da NR-15.\n\nEsta conclusão restringe-se exclusivamente aos cargos vinculados a esta caracterização específica.`,
    });
    return { conclusion, hasInsalubridade: true }; // Insalubre
  }
};

// Helper function to get agentes químicos (chemical agents) conclusion (Anexo 11 - Agentes Químicos com Limites de Tolerância)
// Quantitative criterion - compares CMTP (concentração média ponderada no tempo) with LT (limite de tolerância)
// Two types of limits: LT CMTP Jornada and LT TETO (ceiling value)
// Returns: { conclusion: ISectionChildrenType[], hasInsalubridade: boolean }
const getAgentesQuimicosInsalubridadeConclusion = ({
  group,
  hierarchyTree,
}: {
  group: HomogeneousGroupModel;
  hierarchyTree: IHierarchyMap;
}): { conclusion: ISectionChildrenType[]; hasInsalubridade: boolean } => {
  const conclusion: ISectionChildrenType[] = [];

  // Get all chemical agents risk data for this group
  const quimicoRiskData = group.allRiskData.filter((rd) => rd.risk.insalubridade === RiskInsalubridadeEnum.AGENTES_QUIMICOS_11);

  if (quimicoRiskData.length === 0) return { conclusion, hasInsalubridade: false };

  // Get the characterization name based on group type
  const characterizationName = getCharacterizationNameForConclusion(group, hierarchyTree);

  // Check if we have quantitative data
  const hasQuantitativeData = quimicoRiskData.some((rd) => rd.isQuantity && rd.quantityQui);

  if (!hasQuantitativeData) {
    // Inconclusivo — Sem medições
    conclusion.push({
      type: DocumentChildrenTypeEnum.H3,
      text: `Conclusão — ${characterizationName}`,
    });

    // Get the chemical substance name(s) for the inconclusivo message
    const substanceNames = [...new Set(quimicoRiskData.map((rd) => rd.risk.name))].join(', ');

    conclusion.push({
      type: DocumentChildrenTypeEnum.PARAGRAPH,
      text: `Não é possível concluir quanto à caracterização da insalubridade por exposição ocupacional à substância química ${substanceNames} para esta caracterização específica, uma vez que o critério de avaliação aplicável, conforme o Anexo 11 da NR-15, é quantitativo e depende da determinação da concentração média ponderada no tempo da jornada (CMTP), inexistente no GRO no momento da análise, condição indispensável para o julgamento técnico da insalubridade.\n\nEsta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, substâncias, processos ou ambientes.`,
    });
    return { conclusion, hasInsalubridade: false };
  }

  // Separate risk data by type (TETO vs CMTP) and by above/below limit
  // probability >= 5 means above tolerance limit (insalubre)
  const riskDataAboveLimit = quimicoRiskData.filter((rd) => {
    if (!rd.quantityQui) return false;
    return rd.quantityQui.nr15ltProb !== undefined && rd.quantityQui.nr15ltProb >= 5;
  });

  // probability < 5 and > 0 means below tolerance limit (não insalubre)
  const riskDataBelowLimit = quimicoRiskData.filter((rd) => {
    if (!rd.quantityQui) return false;
    const prob = rd.quantityQui.nr15ltProb;
    return prob !== undefined && prob > 0 && prob < 5;
  });

  // Helper to format chemical data for display
  const formatChemicalData = (rd: RiskDataModel): { name: string; value: string; limit: string; unit: string; isTeto: boolean } | null => {
    if (!rd.quantityQui) return null;
    const name = rd.risk.name;
    const value = rd.quantityQui.nr15ltValue || '';
    const limit = rd.quantityQui.nr15lt || rd.risk.nr15lt || '';
    const unit = rd.quantityQui.unit || rd.risk.unit || '';
    const isTeto = rd.quantityQui.isNr15Teto;
    return { name, value, limit, unit, isTeto };
  };

  // Get unique substance names for this group
  const substanceNames = [...new Set(quimicoRiskData.map((rd) => rd.risk.name))].join(', ');

  conclusion.push({
    type: DocumentChildrenTypeEnum.H3,
    text: `Conclusão — ${characterizationName}`,
  });

  if (riskDataAboveLimit.length > 0) {
    // Get data from the first risk data above limit
    const mainRiskData = riskDataAboveLimit[0];
    const chemicalData = formatChemicalData(mainRiskData);
    const grauFromRisk = mainRiskData.risk.grauInsalubridade;
    const grauInsalubridade = getGrauInsalubridadeLabel(grauFromRisk);

    // Check if there are efficient EPIs that can neutralize the risk
    const hasEfficientEPI = riskDataAboveLimit.some((rd) => rd.epis.some((epi) => epi.efficientlyCheck));

    const isTeto = chemicalData?.isTeto || false;
    const valueText = chemicalData?.value ? ` de ${chemicalData.value} ${chemicalData.unit}` : '';
    const limitText = chemicalData?.limit ? `${chemicalData.limit} ${chemicalData.unit}` : 'limite de tolerância';

    if (isTeto) {
      // LT TETO (Ceiling Value)
      if (hasEfficientEPI) {
        // CTeto > LT mas com EPI eficaz — Neutralizado
        conclusion.push({
          type: DocumentChildrenTypeEnum.PARAGRAPH,
          text: `Para a presente caracterização, verifica-se que a concentração da substância química ${substanceNames}, classificada no Anexo 11 da NR-15 como substância de valor teto, apresentou registros pontuais${valueText} superiores ao respectivo limite de tolerância ${limitText}, caracterizando, em princípio, condição insalubre em ${grauInsalubridade}.\n\nEntretanto, ficou comprovado no GRO que o Equipamento de Proteção Individual – EPI fornecido é tecnicamente adequado ao agente químico avaliado, possui Certificado de Aprovação válido, apresenta fator de proteção compatível com os níveis de exposição identificados e teve seu uso contínuo, correto e ininterrupto ao longo da jornada devidamente observado, incluindo treinamento, higienização, manutenção e substituição periódica, conforme exigências legais.\n\nDessa forma, nos termos do item 15.4 da NR-15, resta caracterizada a neutralização da insalubridade pelo uso eficaz do EPI, não sendo devido o adicional de insalubridade para esta caracterização específica, enquanto mantidas as mesmas condições de exposição, controle e uso efetivo do EPI.\n\nEsta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, substâncias, processos ou ambientes.`,
        });
        return { conclusion, hasInsalubridade: false }; // Neutralizado
      } else {
        // CTeto > LT — Insalubre
        conclusion.push({
          type: DocumentChildrenTypeEnum.PARAGRAPH,
          text: `Com base nos resultados das avaliações quantitativas da exposição ocupacional à substância química ${substanceNames}, classificada no Anexo 11 da NR-15 como substância de valor teto, verifica-se que a concentração medida${valueText} excedeu o respectivo limite de tolerância ${limitText} em ao menos um instante da jornada de trabalho, caracterizando condição insalubre.\n\nConsiderando que não foi comprovada no GRO a neutralização da exposição por meio de medidas de controle coletivo, organizacionais, administrativas ou pelo uso eficaz de Equipamento de Proteção Individual – EPI, conclui-se pela caracterização da insalubridade em ${grauInsalubridade}, conforme o Anexo 11 da NR-15, em decorrência da ultrapassagem do valor teto aplicável.\n\nEsta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, substâncias, processos ou ambientes.`,
        });
        return { conclusion, hasInsalubridade: true }; // Insalubre
      }
    } else {
      // LT CMTP Jornada (Time-Weighted Average)
      if (hasEfficientEPI) {
        // CMTP > LT mas com EPI eficaz — Neutralizado
        conclusion.push({
          type: DocumentChildrenTypeEnum.PARAGRAPH,
          text: `Para a presente caracterização, verifica-se que a concentração média ponderada no tempo da jornada (CMTP) da substância química ${substanceNames}${valueText} apresenta valor superior ao respectivo limite de tolerância ${limitText} estabelecido no Anexo 11 da NR-15, caracterizando, em princípio, condição insalubre em ${grauInsalubridade}.\n\nEntretanto, ficou comprovado no GRO que o Equipamento de Proteção Individual – EPI fornecido é tecnicamente adequado ao agente químico avaliado, possui Certificado de Aprovação válido, apresenta fator de proteção compatível com os níveis de exposição identificados e teve seu uso contínuo, correto e ininterrupto ao longo da jornada devidamente observado, incluindo treinamento, higienização, manutenção e substituição periódica, conforme exigências legais.\n\nDessa forma, nos termos do item 15.4 da NR-15, resta caracterizada a neutralização da insalubridade pelo uso eficaz do EPI, não sendo devido o adicional de insalubridade para esta caracterização específica, enquanto mantidas as mesmas condições de exposição, controle e uso efetivo do EPI.\n\nEsta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, substâncias, processos ou ambientes.`,
        });
        return { conclusion, hasInsalubridade: false }; // Neutralizado
      } else {
        // CMTP > LT — Insalubre
        conclusion.push({
          type: DocumentChildrenTypeEnum.PARAGRAPH,
          text: `Com base nos resultados das avaliações quantitativas da exposição ocupacional à substância química ${substanceNames}, verifica-se que a concentração média ponderada no tempo da jornada (CMTP)${valueText} apresenta valor superior ao respectivo limite de tolerância ${limitText} estabelecido no Anexo 11 da NR-15, caracterizando condição insalubre.\n\nConsiderando que não foi comprovada no GRO a neutralização da exposição por meio de medidas de controle coletivo, organizacionais, administrativas ou pelo uso eficaz de Equipamento de Proteção Individual – EPI, conclui-se pela caracterização da insalubridade em ${grauInsalubridade} para esta condição, em decorrência da exposição ocupacional acima do limite legal.\n\nEsta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, substâncias, processos ou ambientes.`,
        });
        return { conclusion, hasInsalubridade: true }; // Insalubre
      }
    }
  } else if (riskDataBelowLimit.length > 0) {
    // Get data from the first risk data below limit
    const mainRiskData = riskDataBelowLimit[0];
    const chemicalData = formatChemicalData(mainRiskData);
    const grauFromRisk = mainRiskData.risk.grauInsalubridade;
    const grauInsalubridade = getGrauInsalubridadeLabel(grauFromRisk);

    const isTeto = chemicalData?.isTeto || false;
    const limitText = chemicalData?.limit ? `${chemicalData.limit} ${chemicalData.unit}` : 'limite de tolerância';

    if (isTeto) {
      // CTeto < LT — Não Insalubre
      conclusion.push({
        type: DocumentChildrenTypeEnum.PARAGRAPH,
        text: `Caracteriza-se como não insalubre a exposição ocupacional à substância química ${substanceNames}, classificada no Anexo 11 da NR-15 como substância de valor teto, quando os resultados das avaliações quantitativas indicam que a concentração medida permaneceu igual ou inferior ao respectivo valor teto ${limitText} em todos os instantes da jornada de trabalho.\n\nNesta condição, verifica-se que o critério de exposição ocupacional aplicável foi atendido integralmente, não se configurando a caracterização da insalubridade em ${grauInsalubridade} prevista para este agente, não sendo devido o adicional de insalubridade, devendo, contudo, ser mantidas as condições operacionais existentes e adotadas boas práticas de prevenção, controle e monitoramento contínuo.\n\nEsta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, substâncias, processos ou ambientes.`,
      });
    } else {
      // CMTP < LT — Não Insalubre
      conclusion.push({
        type: DocumentChildrenTypeEnum.PARAGRAPH,
        text: `Caracteriza-se como não insalubre a exposição ocupacional à substância química ${substanceNames} quando a concentração média ponderada no tempo da jornada (CMTP), determinada conforme metodologia de avaliação quantitativa aplicável, apresenta valor igual ou inferior ao respectivo limite de tolerância ${limitText} estabelecido no Anexo 11 da NR-15.\n\nNesta condição, verifica-se que o limite de exposição ocupacional não foi excedido, não se configurando a caracterização da insalubridade em ${grauInsalubridade} prevista para este agente, não sendo devido o adicional de insalubridade, devendo, contudo, ser mantidas as condições operacionais existentes e adotadas boas práticas de prevenção, controle e monitoramento periódico.\n\nEsta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, substâncias, processos ou ambientes.`,
      });
    }
    return { conclusion, hasInsalubridade: false }; // Não insalubre
  }

  return { conclusion, hasInsalubridade: false };
};

// Helper function to get poeiras minerais (mineral dust) conclusion (Anexo 12 - Poeiras Minerais)
// Quantitative criterion - compares CMTP with LT (limite de tolerância)
// Uses the same quantityQui data structure as Anexo 11
// Returns: { conclusion: ISectionChildrenType[], hasInsalubridade: boolean }
const getPoeirasMineiraisInsalubridadeConclusion = ({
  group,
  hierarchyTree,
}: {
  group: HomogeneousGroupModel;
  hierarchyTree: IHierarchyMap;
}): { conclusion: ISectionChildrenType[]; hasInsalubridade: boolean } => {
  const conclusion: ISectionChildrenType[] = [];

  // Get all mineral dust risk data for this group
  const poeirasRiskData = group.allRiskData.filter((rd) => rd.risk.insalubridade === RiskInsalubridadeEnum.POEIRAS_MINERAIS_12);

  if (poeirasRiskData.length === 0) return { conclusion, hasInsalubridade: false };

  // Get the characterization name based on group type
  const characterizationName = getCharacterizationNameForConclusion(group, hierarchyTree);

  // Check if we have quantitative data
  const hasQuantitativeData = poeirasRiskData.some((rd) => rd.isQuantity && rd.quantityQui);

  if (!hasQuantitativeData) {
    // Inconclusivo — Sem medições
    conclusion.push({
      type: DocumentChildrenTypeEnum.H3,
      text: `Conclusão — ${characterizationName}`,
    });

    // Get the mineral dust substance name(s) for the inconclusivo message
    const substanceNames = [...new Set(poeirasRiskData.map((rd) => rd.risk.name))].join(', ');

    conclusion.push({
      type: DocumentChildrenTypeEnum.PARAGRAPH,
      text: `Não é possível concluir quanto à caracterização da insalubridade por exposição ocupacional à poeira mineral ${substanceNames} para esta caracterização específica, uma vez que o critério de avaliação aplicável, conforme o Anexo 12 da NR-15, é quantitativo e depende da determinação da concentração de poeira mineral no ambiente de trabalho, inexistente no GRO no momento da análise, condição indispensável para o julgamento técnico da insalubridade.\n\nEsta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, substâncias, processos ou ambientes.`,
    });
    return { conclusion, hasInsalubridade: false };
  }

  // Separate risk data by above/below limit
  // probability >= 5 means above tolerance limit (insalubre)
  const riskDataAboveLimit = poeirasRiskData.filter((rd) => {
    if (!rd.quantityQui) return false;
    return rd.quantityQui.nr15ltProb !== undefined && rd.quantityQui.nr15ltProb >= 5;
  });

  // probability < 5 and > 0 means below tolerance limit (não insalubre)
  const riskDataBelowLimit = poeirasRiskData.filter((rd) => {
    if (!rd.quantityQui) return false;
    const prob = rd.quantityQui.nr15ltProb;
    return prob !== undefined && prob > 0 && prob < 5;
  });

  // Helper to format mineral dust data for display
  const formatPoeirasData = (rd: RiskDataModel): { name: string; value: string; limit: string; unit: string } | null => {
    if (!rd.quantityQui) return null;
    const name = rd.risk.name;
    const value = rd.quantityQui.nr15ltValue || '';
    const limit = rd.quantityQui.nr15lt || rd.risk.nr15lt || '';
    const unit = rd.quantityQui.unit || rd.risk.unit || '';
    return { name, value, limit, unit };
  };

  // Get unique substance names for this group
  const substanceNames = [...new Set(poeirasRiskData.map((rd) => rd.risk.name))].join(', ');

  conclusion.push({
    type: DocumentChildrenTypeEnum.H3,
    text: `Conclusão — ${characterizationName}`,
  });

  if (riskDataAboveLimit.length > 0) {
    // Get data from the first risk data above limit
    const mainRiskData = riskDataAboveLimit[0];
    const poeirasData = formatPoeirasData(mainRiskData);
    const grauFromRisk = mainRiskData.risk.grauInsalubridade;
    const grauInsalubridade = getGrauInsalubridadeLabel(grauFromRisk);

    // Check if there are efficient EPIs that can neutralize the risk
    const hasEfficientEPI = riskDataAboveLimit.some((rd) => rd.epis.some((epi) => epi.efficientlyCheck));

    const valueText = poeirasData?.value ? ` de ${poeirasData.value} ${poeirasData.unit}` : '';
    const limitText = poeirasData?.limit ? `${poeirasData.limit} ${poeirasData.unit}` : 'limite de tolerância';

    if (hasEfficientEPI) {
      // Concentração > LT mas com EPI eficaz — Neutralizado
      conclusion.push({
        type: DocumentChildrenTypeEnum.PARAGRAPH,
        text: `Para a presente caracterização, verifica-se que a concentração média ponderada no tempo da jornada (CMTP) da poeira mineral ${substanceNames}${valueText} apresenta valor superior ao respectivo limite de tolerância ${limitText} estabelecido no Anexo 12 da NR-15, caracterizando, em princípio, condição insalubre em ${grauInsalubridade}.\n\nEntretanto, ficou comprovado no GRO que o Equipamento de Proteção Individual – EPI fornecido é tecnicamente adequado à poeira mineral avaliada, possui Certificado de Aprovação válido, apresenta fator de proteção compatível com os níveis de exposição identificados e teve seu uso contínuo, correto e ininterrupto ao longo da jornada devidamente observado, incluindo treinamento, higienização, manutenção e substituição periódica, conforme exigências legais.\n\nDessa forma, nos termos do item 15.4 da NR-15, resta caracterizada a neutralização da insalubridade pelo uso eficaz do EPI, não sendo devido o adicional de insalubridade para esta caracterização específica, enquanto mantidas as mesmas condições de exposição, controle e uso efetivo do EPI.\n\nEsta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, substâncias, processos ou ambientes.`,
      });
      return { conclusion, hasInsalubridade: false }; // Neutralizado
    } else {
      // Concentração > LT — Insalubre
      conclusion.push({
        type: DocumentChildrenTypeEnum.PARAGRAPH,
        text: `Com base nos resultados das avaliações quantitativas da exposição ocupacional à poeira mineral ${substanceNames}, verifica-se que a concentração média ponderada no tempo da jornada (CMTP)${valueText} apresenta valor superior ao respectivo limite de tolerância ${limitText} estabelecido no Anexo 12 da NR-15, caracterizando condição insalubre.\n\nConsiderando que não foi comprovada no GRO a neutralização da exposição por meio de medidas de controle coletivo, organizacionais, administrativas ou pelo uso eficaz de Equipamento de Proteção Individual – EPI, conclui-se pela caracterização da insalubridade em ${grauInsalubridade} para esta condição, em decorrência da exposição ocupacional acima do limite legal.\n\nEsta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, substâncias, processos ou ambientes.`,
      });
      return { conclusion, hasInsalubridade: true }; // Insalubre
    }
  } else if (riskDataBelowLimit.length > 0) {
    // Get data from the first risk data below limit
    const mainRiskData = riskDataBelowLimit[0];
    const poeirasData = formatPoeirasData(mainRiskData);
    const grauFromRisk = mainRiskData.risk.grauInsalubridade;
    const grauInsalubridade = getGrauInsalubridadeLabel(grauFromRisk);

    const limitText = poeirasData?.limit ? `${poeirasData.limit} ${poeirasData.unit}` : 'limite de tolerância';

    // Concentração < LT — Não Insalubre
    conclusion.push({
      type: DocumentChildrenTypeEnum.PARAGRAPH,
      text: `Caracteriza-se como não insalubre a exposição ocupacional à poeira mineral ${substanceNames} quando a concentração média ponderada no tempo da jornada (CMTP), determinada conforme metodologia de avaliação quantitativa aplicável, apresenta valor igual ou inferior ao respectivo limite de tolerância ${limitText} estabelecido no Anexo 12 da NR-15.\n\nNesta condição, verifica-se que o limite de exposição ocupacional não foi excedido, não se configurando a caracterização da insalubridade em ${grauInsalubridade} prevista para esta poeira mineral, não sendo devido o adicional de insalubridade, devendo, contudo, ser mantidas as condições operacionais existentes e adotadas boas práticas de prevenção, controle e monitoramento periódico.\n\nEsta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, substâncias, processos ou ambientes.`,
    });
    return { conclusion, hasInsalubridade: false }; // Não insalubre
  }

  return { conclusion, hasInsalubridade: false };
};

// Helper function to get agentes químicos qualitativo (qualitative chemical agents) conclusion (Anexo 13)
// Qualitative criterion - based on activities described in Anexo 13
// - Lista fechada de atividades
// - Um mesmo agente pode gerar graus distintos conforme a atividade (10%, 20% ou 40%)
// - NÃO exige exposição habitual e permanente
// - REQUER: atividade real E atividade equivalente cadastradas
// Returns: { conclusion: ISectionChildrenType[], hasInsalubridade: boolean }
const getAgentesQuimicosQualitativoInsalubridadeConclusion = ({
  group,
  hierarchyTree,
}: {
  group: HomogeneousGroupModel;
  hierarchyTree: IHierarchyMap;
}): { conclusion: ISectionChildrenType[]; hasInsalubridade: boolean } => {
  const conclusion: ISectionChildrenType[] = [];

  // Get all qualitative chemical agents risk data for this group
  const allQuimicoRiskData = group.allRiskData.filter((rd) => rd.risk.insalubridade === RiskInsalubridadeEnum.AGENTES_QUIMICOS_QUALITATIVO_13);

  // For qualitative risks, filter only those with realActivity AND equivalent activities
  const quimicoRiskData = filterQualitativeRiskDataWithActivities(allQuimicoRiskData);

  if (quimicoRiskData.length === 0) return { conclusion, hasInsalubridade: false };

  // Get the characterization name based on group type
  const characterizationName = getCharacterizationNameForConclusion(group, hierarchyTree);

  // Get grauInsalubridade from the first risk data
  // For Anexo 13, the grau is variable (MIN 10%, MED 20%, MAX 40%) depending on the activity
  const grauFromRisk = quimicoRiskData[0]?.risk?.grauInsalubridade;
  const grauInsalubridade = getGrauInsalubridadeLabel(grauFromRisk);

  // Get the chemical substance name(s)
  const substanceNames = [...new Set(quimicoRiskData.map((rd) => rd.risk.name))].join(', ');

  // Format activities text for all risk data
  const activitiesTexts = quimicoRiskData.map((rd) => formatQualitativeActivitiesText(rd)).filter((t) => t.length > 0);
  const activitiesSection = activitiesTexts.length > 0 ? `\n\n${activitiesTexts.join('\n\n')}` : '';

  // Check if there are efficient EPIs that can neutralize the risk
  const hasEfficientEPI = quimicoRiskData.some((rd) => {
    return rd.epis.some((epi) => epi.efficientlyCheck);
  });

  conclusion.push({
    type: DocumentChildrenTypeEnum.H3,
    text: `Conclusão — ${characterizationName}`,
  });

  if (hasEfficientEPI) {
    // Atividade com exposição + EPI eficaz — Neutralizado (NÃO é insalubre)
    conclusion.push({
      type: DocumentChildrenTypeEnum.PARAGRAPH,
      text: `Para a presente caracterização específica, vinculada aos cargos analisados, verifica-se que as atividades ou operações descritas no GRO envolvem exposição ocupacional ao agente químico ${substanceNames}, conforme disposto no Anexo 13 da NR-15, caracterizando, em princípio, condição insalubre em ${grauInsalubridade}.${activitiesSection}\n\nA análise técnica fundamenta-se na comparação entre a descrição da atividade real cadastrada no GRO e as atividades expressamente previstas no Anexo 13 da NR-15, considerando a similaridade operacional, o processo de trabalho, o agente químico manipulado e as condições em que ocorre a exposição.\n\nEntretanto, ficou comprovado no GRO que o Equipamento de Proteção Individual – EPI fornecido é tecnicamente adequado ao agente químico avaliado, possui Certificado de Aprovação válido, apresenta fator de proteção compatível com os níveis de exposição identificados e teve seu uso contínuo, correto e ininterrupto ao longo da jornada devidamente observado, incluindo treinamento, higienização, manutenção e substituição periódica, conforme exigências legais.\n\nDessa forma, nos termos do item 15.4 da NR-15, resta caracterizada a neutralização da insalubridade pelo uso eficaz do EPI, não sendo devido o adicional de insalubridade para esta caracterização específica, enquanto mantidas as mesmas condições de exposição, controle e uso efetivo do EPI.\n\nEsta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, substâncias, processos ou ambientes.`,
    });
    return { conclusion, hasInsalubridade: false }; // Neutralizado = NÃO insalubre
  } else {
    // Atividade com exposição ao agente químico — Insalubre
    // NOTA: Anexo 13 NÃO exige exposição habitual e permanente
    conclusion.push({
      type: DocumentChildrenTypeEnum.PARAGRAPH,
      text: `Com base na análise qualitativa das atividades registradas no GRO para esta caracterização, verifica-se que as atividades ou operações descritas envolvem exposição ocupacional ao agente químico ${substanceNames}, conforme disposto no Anexo 13 da NR-15.${activitiesSection}\n\nO Anexo 13 da NR-15 adota critério técnico de avaliação qualitativa, no qual a caracterização da insalubridade decorre da natureza da atividade executada, do agente químico envolvido e da forma de exposição, independentemente da realização de medições quantitativas ou da comparação com limites de tolerância. A análise técnica fundamenta-se na comparação entre a descrição da atividade real cadastrada no GRO e as atividades expressamente previstas no Anexo 13 da NR-15, considerando a similaridade operacional, o processo de trabalho, o agente químico manipulado e as condições em que ocorre a exposição.\n\nAs medidas de controle informadas no GRO não se mostraram eficazes para neutralizar a exposição ao agente químico.\n\nConclui-se, portanto, pela caracterização da insalubridade para os cargos vinculados a esta caracterização, em decorrência da exposição ocupacional ao agente químico ${substanceNames}. O grau de insalubridade aplicável é ${grauInsalubridade}, conforme estabelecido no Anexo 13 da NR-15 para a atividade caracterizada.\n\nEsta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, substâncias, processos ou ambientes.`,
    });
    return { conclusion, hasInsalubridade: true }; // Insalubre
  }
};

// Helper function to get benzeno conclusion (Anexo 13-A)
// Qualitative criterion - based on presence of benzene in work process
// - Critério predominantemente qualitativo
// - Grau MÁXIMO 40%
// - NÃO exige exposição habitual e permanente
// - IMPORTANTE: EPI NÃO pode neutralizar o risco para benzeno
// - REQUER: atividade real E atividade equivalente cadastradas
// Returns: { conclusion: ISectionChildrenType[], hasInsalubridade: boolean }
const getBenzenoInsalubridadeConclusion = ({
  group,
  hierarchyTree,
}: {
  group: HomogeneousGroupModel;
  hierarchyTree: IHierarchyMap;
}): { conclusion: ISectionChildrenType[]; hasInsalubridade: boolean } => {
  const conclusion: ISectionChildrenType[] = [];

  // Get all benzeno risk data for this group
  const allBenzenoRiskData = group.allRiskData.filter((rd) => rd.risk.insalubridade === RiskInsalubridadeEnum.BENZENO_13A);

  // For qualitative risks, filter only those with realActivity AND equivalent activities
  const benzenoRiskData = filterQualitativeRiskDataWithActivities(allBenzenoRiskData);

  if (benzenoRiskData.length === 0) return { conclusion, hasInsalubridade: false };

  // Get the characterization name based on group type
  const characterizationName = getCharacterizationNameForConclusion(group, hierarchyTree);

  // For Anexo 13-A, the grau is always MAX (40%)
  const grauInsalubridade = getGrauInsalubridadeLabel('MAX');

  // Format activities text for all risk data
  const activitiesTexts = benzenoRiskData.map((rd) => formatQualitativeActivitiesText(rd)).filter((t) => t.length > 0);
  const activitiesSection = activitiesTexts.length > 0 ? `\n\n${activitiesTexts.join('\n\n')}` : '';

  // NOTE: For Anexo 13-A (Benzeno), EPI CANNOT neutralize the risk
  // "não sendo admitida a neutralização do risco por meio de Equipamentos de Proteção Individual"
  // So we always conclude as insalubre if there are valid activities

  conclusion.push({
    type: DocumentChildrenTypeEnum.H3,
    text: `Conclusão — ${characterizationName}`,
  });

  conclusion.push({
    type: DocumentChildrenTypeEnum.PARAGRAPH,
    text: `Com base na análise qualitativa das atividades registradas no GRO para esta caracterização, verifica-se que as atividades ou operações descritas envolvem exposição ocupacional ao benzeno, conforme disposto no Anexo 13-A da NR-15.${activitiesSection}\n\nO Anexo 13-A da NR-15 adota critério técnico de avaliação predominantemente qualitativo, no qual a caracterização da insalubridade decorre da presença do benzeno no processo de trabalho e da natureza da atividade executada, independentemente da realização de medições quantitativas ou da comparação com limites de tolerância. A análise técnica fundamenta-se na identificação da utilização, manuseio, processamento, transporte, armazenamento ou qualquer outra forma de contato ocupacional com o benzeno, conforme caracterizado no GRO.\n\nConforme estabelecido no Anexo 13-A da NR-15 e na legislação específica aplicável a este agente químico, a exposição ocupacional ao benzeno caracteriza insalubridade em grau máximo, não sendo admitida a neutralização do risco por meio de Equipamentos de Proteção Individual. Considera-se, para fins de caracterização, apenas as medidas de controle coletivo, organizacionais e administrativas.\n\nConclui-se, portanto, pela caracterização da insalubridade para os cargos vinculados a esta caracterização, em decorrência da exposição ocupacional ao benzeno. O grau de insalubridade aplicável é ${grauInsalubridade}, conforme estabelecido no Anexo 13-A da NR-15.\n\nEsta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, substâncias, processos ou ambientes.`,
  });

  return { conclusion, hasInsalubridade: true }; // Always insalubre for benzene (EPI cannot neutralize)
};

// Helper function to get agentes biológicos conclusion (Anexo 14)
// Qualitative criterion - based on activities described in Anexo 14
// - Lista fechada de atividades
// - Um mesmo agente pode gerar graus distintos conforme a atividade (20% ou 40%)
// - EXIGE: Exposição habitual e permanente (diferente dos outros anexos qualitativos!)
// - REQUER: atividade real E atividade equivalente cadastradas
// Returns: { conclusion: ISectionChildrenType[], hasInsalubridade: boolean }
const getAgentesBiologicosInsalubridadeConclusion = ({
  group,
  hierarchyTree,
}: {
  group: HomogeneousGroupModel;
  hierarchyTree: IHierarchyMap;
}): { conclusion: ISectionChildrenType[]; hasInsalubridade: boolean } => {
  const conclusion: ISectionChildrenType[] = [];

  // Get all biological agents risk data for this group
  const allBiologicoRiskData = group.allRiskData.filter((rd) => rd.risk.insalubridade === RiskInsalubridadeEnum.AGENTES_BIOLOGICOS_14);

  // For qualitative risks, filter only those with realActivity AND equivalent activities
  const biologicoRiskData = filterQualitativeRiskDataWithActivities(allBiologicoRiskData);

  if (biologicoRiskData.length === 0) return { conclusion, hasInsalubridade: false };

  // Get the characterization name based on group type
  const characterizationName = getCharacterizationNameForConclusion(group, hierarchyTree);

  // Get grauInsalubridade from the first risk data
  // For Anexo 14, the grau is variable (MED 20% or MAX 40%) depending on the activity
  const grauFromRisk = biologicoRiskData[0]?.risk?.grauInsalubridade;
  const grauInsalubridade = getGrauInsalubridadeLabel(grauFromRisk);

  // Get the biological agent name(s)
  const agentNames = [...new Set(biologicoRiskData.map((rd) => rd.risk.name))].join(', ');

  // Format activities text for all risk data
  const activitiesTexts = biologicoRiskData.map((rd) => formatQualitativeActivitiesText(rd)).filter((t) => t.length > 0);
  const activitiesSection = activitiesTexts.length > 0 ? `\n\n${activitiesTexts.join('\n\n')}` : '';

  // CRITICAL: Anexo 14 REQUIRES habitual and permanent exposure (HP)
  // Check if the exposure is habitual and permanent
  const isHabitualPermanente = biologicoRiskData.some((rd) => rd.exposure === ExposureTypeEnum.HP);

  // Check if there are efficient EPIs that can neutralize the risk
  const hasEfficientEPI = biologicoRiskData.some((rd) => {
    return rd.epis.some((epi) => epi.efficientlyCheck);
  });

  conclusion.push({
    type: DocumentChildrenTypeEnum.H3,
    text: `Conclusão — ${characterizationName}`,
  });

  // If exposure is NOT habitual and permanent → Not insalubrious (even with equivalent activity)
  if (!isHabitualPermanente) {
    conclusion.push({
      type: DocumentChildrenTypeEnum.PARAGRAPH,
      text: `Com base na análise qualitativa das atividades efetivamente desenvolvidas neste grupo homogêneo de exposição, verifica-se que as tarefas executadas são equivalentes, do ponto de vista técnico, às atividades descritas no Anexo 14 da NR-15, envolvendo potencial contato com agentes biológicos (${agentNames}).${activitiesSection}\n\nEntretanto, conforme caracterização realizada no GRO, a exposição aos agentes biológicos ocorre de forma eventual ou intermitente, não se configurando como habitual e permanente, requisito indispensável para a caracterização da insalubridade nos termos da NR-15 para agentes avaliados por critério qualitativo.\n\nDessa forma, ainda que haja equivalência entre a atividade real e a atividade normatizada, a ausência de exposição habitual e permanente afasta o enquadramento como atividade insalubre, não sendo devido o adicional de insalubridade para este vínculo específico.\n\nEsta conclusão aplica-se exclusivamente a esta caracterização, limitada ao grupo homogêneo, atividade ou ambiente aqui analisado, não sendo extensível a outros vínculos ou formas de caracterização eventualmente existentes no GRO.`,
    });
    return { conclusion, hasInsalubridade: false }; // Not HP = NOT insalubrious
  }

  if (hasEfficientEPI) {
    // Atividade com exposição + EPI eficaz — Neutralizado (NÃO é insalubre)
    conclusion.push({
      type: DocumentChildrenTypeEnum.PARAGRAPH,
      text: `Para a presente caracterização específica, vinculada aos cargos analisados, verifica-se que as atividades ou operações descritas no GRO envolvem exposição ocupacional a agentes biológicos (${agentNames}), conforme disposto no Anexo 14 da NR-15, caracterizando, em princípio, condição insalubre em ${grauInsalubridade}.${activitiesSection}\n\nA análise técnica fundamenta-se na comparação entre a descrição da atividade real cadastrada no GRO e as atividades expressamente previstas no Anexo 14 da NR-15, considerando a similaridade operacional, o tipo de agente biológico envolvido e a forma de exposição. Constata-se que a exposição aos agentes biológicos ocorre de forma habitual e permanente, integrando a rotina normal de trabalho.\n\nEntretanto, ficou comprovado no GRO que o Equipamento de Proteção Individual – EPI fornecido é tecnicamente adequado ao agente biológico avaliado, possui Certificado de Aprovação válido, apresenta fator de proteção compatível com os níveis de exposição identificados e teve seu uso contínuo, correto e ininterrupto ao longo da jornada devidamente observado, incluindo treinamento, higienização, manutenção e substituição periódica, conforme exigências legais.\n\nDessa forma, nos termos do item 15.4 da NR-15, resta caracterizada a neutralização da insalubridade pelo uso eficaz do EPI, não sendo devido o adicional de insalubridade para esta caracterização específica, enquanto mantidas as mesmas condições de exposição, controle e uso efetivo do EPI.\n\nEsta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, agentes, processos ou ambientes.`,
    });
    return { conclusion, hasInsalubridade: false }; // Neutralizado = NÃO insalubre
  } else {
    // Atividade com exposição ao agente biológico + habitual e permanente — Insalubre
    conclusion.push({
      type: DocumentChildrenTypeEnum.PARAGRAPH,
      text: `Com base na análise qualitativa das atividades registradas no GRO para esta caracterização, verifica-se que as atividades ou operações descritas envolvem exposição ocupacional a agentes biológicos (${agentNames}), conforme disposto no Anexo 14 da NR-15.${activitiesSection}\n\nO Anexo 14 da NR-15 adota critério técnico de avaliação qualitativa, no qual a caracterização da insalubridade decorre da natureza da atividade executada e do contato com agentes biológicos previstos na norma, independentemente de medições quantitativas. A análise técnica fundamenta-se na comparação entre a descrição da atividade real cadastrada no GRO e as atividades expressamente previstas no Anexo 14 da NR-15, considerando a similaridade operacional, o tipo de agente biológico envolvido e a forma de exposição.\n\nConstata-se, conforme caracterização registrada no GRO, que a exposição aos agentes biológicos ocorre de forma habitual e permanente, integrando a rotina normal de trabalho dos trabalhadores vinculados a esta caracterização, não se tratando de situação eventual ou esporádica.\n\nAs medidas de controle informadas no GRO não se mostraram eficazes para neutralizar a exposição aos agentes biológicos.\n\nNessas condições, estando atendidos simultaneamente os critérios de equivalência da atividade real à atividade normatizada e de exposição habitual e permanente, caracteriza-se a insalubridade nos termos do Anexo 14 da NR-15.\n\nConclui-se, portanto, pela caracterização da insalubridade para os cargos vinculados a esta caracterização, em decorrência da exposição ocupacional a agentes biológicos. O grau de insalubridade aplicável é ${grauInsalubridade}, conforme estabelecido no Anexo 14 da NR-15 para a atividade caracterizada.\n\nEsta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, agentes, processos ou ambientes.`,
    });
    return { conclusion, hasInsalubridade: true }; // Insalubre
  }
};

export const activitiesInsalubridadeSections = (
  document: DocumentPGRModel,
  hierarchiesTreeOrg: IHierarchyData,
  homoGroupTree: IHomoGroupMap,
  hierarchyTree: IHierarchyMap,
  convertToDocx: (data: ISectionChildrenType[]) => (Paragraph | Table)[],
) => {
  const sections: (Paragraph | Table)[][] = [];

  const insalubridade = {} as Record<RiskInsalubridadeEnum, { groups: HomogeneousGroupModel[] }>;

  document.homogeneousGroups.forEach((group) => {

    group.allRiskData.forEach((riskData) => {
      if (riskData.risk.insalubridade) {
        if (!insalubridade[riskData.risk.insalubridade]) {
          insalubridade[riskData.risk.insalubridade] = {
            groups: [],
          };
        }

        const groupAlreadyAdded = insalubridade[riskData.risk.insalubridade].groups.some((g) => g.id === group.id);
        if (!groupAlreadyAdded) {
          insalubridade[riskData.risk.insalubridade].groups.push(group);
        }
      }
    });
  });

  insalubridadeOrder.forEach((insalubridadeType) => {
    const config = insalubridadeConfig[insalubridadeType];
    const groups = insalubridade[insalubridadeType]?.groups || [];
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

    // Track which groups have insalubridade for final conclusion
    const groupsWithInsalubridade = new Set<string>();

    if (hasGroups) {
      const groupsWithCharacterization = groups.filter((group) => group.characterization).sort((a, b) => sortNumber(a, b, 'order'));
      const groupsHierarchy = groups.filter((group) => group.isHierarchy);
      const groupsGHO = groups.filter((group) => group.isGHO);

      groupsWithCharacterization.forEach((group) => {
        const characterizationName = group.characterization!.name;

        const h2Section: ISectionChildrenType[] = [
          {
            type: DocumentChildrenTypeEnum.H2,
            text: characterizationName,
          },
        ];

        sectionElements.push(...convertToDocx(h2Section));

        const { activities, paragraphs, considerations, imageElements } = getCharacterizationData({ group, insalubridadeType });
        const { riskFactors, realActivities, normativeActivities } = getSharedData({ riskData: group.allRiskData, insalubridadeType });

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

        // Add conclusion based on insalubridade type
        const { conclusion, hasInsalubridade } = getInsalubridadeConclusion({
          group,
          insalubridadeType,
          hierarchyTree,
        });
        if (conclusion.length > 0) {
          sectionElements.push(...convertToDocx(conclusion));
        }
        // Track groups with insalubridade for final conclusion
        if (hasInsalubridade) {
          groupsWithInsalubridade.add(group.id);
        }
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

        const { riskFactors, realActivities, normativeActivities } = getSharedData({ riskData: group.allRiskData, insalubridadeType });

        sectionElements.push(...convertToDocx([...riskFactors, ...realActivities, ...normativeActivities]));

        // Add conclusion based on insalubridade type
        const { conclusion, hasInsalubridade } = getInsalubridadeConclusion({
          group,
          insalubridadeType,
          hierarchyTree,
        });
        if (conclusion.length > 0) {
          sectionElements.push(...convertToDocx(conclusion));
        }
        // Track groups with insalubridade for final conclusion
        if (hasInsalubridade) {
          groupsWithInsalubridade.add(group.id);
        }
      });

      // Process GHO (Grupo Homogêneo de Exposição) groups
      groupsGHO.forEach((group) => {
        const h2Section: ISectionChildrenType[] = [
          {
            type: DocumentChildrenTypeEnum.H2,
            text: `GSE: ${group.name}`,
          },
        ];

        sectionElements.push(...convertToDocx(h2Section));

        // Add description if available
        if (group.description) {
          sectionElements.push(
            ...convertToDocx([
              {
                type: DocumentChildrenTypeEnum.PARAGRAPH,
                text: group.description,
              },
            ]),
          );
        }

        const { riskFactors, realActivities, normativeActivities } = getSharedData({ riskData: group.allRiskData, insalubridadeType });

        // Add hierarchy table for GHO
        const { table: officesTable, missingBody } = hierarchyHomoOrgTable(hierarchiesTreeOrg, homoGroupTree, {
          showDescription: false,
          showHomogeneous: true,
          type: group.type,
          groupIdFilter: group.id,
        });

        if (!missingBody) {
          const titleTable: ISectionChildrenType[] = [
            {
              type: DocumentChildrenTypeEnum.PARAGRAPH_TABLE,
              text: `Cargos lotados no GSE ${group.name}`,
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

        sectionElements.push(...convertToDocx([...riskFactors, ...realActivities, ...normativeActivities]));

        // Add conclusion based on insalubridade type
        const { conclusion, hasInsalubridade } = getInsalubridadeConclusion({
          group,
          insalubridadeType,
          hierarchyTree,
        });
        if (conclusion.length > 0) {
          sectionElements.push(...convertToDocx(conclusion));
        }
        // Track groups with insalubridade for final conclusion
        if (hasInsalubridade) {
          groupsWithInsalubridade.add(group.id);
        }
      });

      // Collect all unique positions (offices) with their sectors ONLY for groups with insalubridade
      const allPositions = new Map<string, { name: string; sector: string }>();

      groups.forEach((group) => {
        // Only include groups that have insalubridade
        if (!groupsWithInsalubridade.has(group.id)) return;

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

      // Add final conclusion section ONLY if there are positions with insalubridade
      if (allPositions.size > 0) {
        const positionsList = Array.from(allPositions.values())
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((pos) => (pos.sector ? `${pos.name} (${pos.sector})` : pos.name));

        const conclusionHeader: ISectionChildrenType[] = [
          {
            type: DocumentChildrenTypeEnum.H2,
            text: 'Conclusão Final',
          },
          {
            type: DocumentChildrenTypeEnum.PARAGRAPH,
            text: `Considerando as informações técnicas apresentadas neste item, incluindo as evidências registradas, a descrição da atividade real e o enquadramento nas atividades e/ou operações insalubres previstas na NR-15, bem como a presença habitual dos trabalhadores vinculados acima nas condições avaliadas, conclui-se pela caracterização da insalubridade, nos termos da legislação vigente para os seguintes cargos:`,
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

