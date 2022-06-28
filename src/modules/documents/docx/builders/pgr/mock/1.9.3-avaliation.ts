import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import {
  IDocumentPGRSectionGroup,
  PGRSectionTypeEnum,
} from '../types/section.types';

export const available: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      type: PGRSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_1}??`,
      children: [
        {
          type: PGRSectionChildrenTypeEnum.H1,
          text: 'PERIODICIDADE E FORMA DE AVALIAÇÃO',
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'Avaliação Obrigatória',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'O acompanhamento do programa deverá ser feito pelo Coordenador Geral que promoverá pelo menos uma reunião a cada 2 meses com todos aqueles a quem delegou competência para o desempenho de atividades específicas do programa com o objetivo de fazer os ajustes necessários no Plano de Ação.',
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'A avaliação de riscos deve constituir um processo contínuo e ser revista a cada dois anos ou quando da ocorrência das seguintes situações **(NR-01 item 1.5.4.4.6):**',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'a) Após implementação das medidas de prevenção, para avaliação de riscos residuais;',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'b) Após inovações e modificações nas tecnologias, ambientes, processos, condições, procedimentos e organização do trabalho que impliquem em novos riscos ou modifiquem os riscos existentes;',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'c) Quando identificadas inadequações, insuficiências ou ineficácias das medidas de prevenção;',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'd) Na ocorrência de acidentes ou doenças relacionadas ao trabalho;',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'e) Quando houver mudança nos requisitos legais aplicáveis.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'No caso de organizações que possuírem certificações em sistema de gestão de SST, o prazo poderá ser de até 3 (três) anos (NR-01 item 1.5.4.4.6.1).',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'O levantamento preliminar de perigos deve ser realizado (NR-01 item 1.5.4.2):',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'a) Antes do início do funcionamento do estabelecimento ou novas instalações;',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'b) Para as atividades existentes; e',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'c) Nas mudanças e introdução de novos processos ou atividades de trabalho.',
        },
        {
          type: PGRSectionChildrenTypeEnum.H3,
          text: 'Validade máxima deste PGR',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `Como a empresa ??${VariablesPGREnum.COMPANY_SHORT_NAME}?? não possui sistemas de Gestão em SST esse PGR terá validade de dois anos.`,
          removeWithAllValidVars: [
            VariablesPGREnum.COMPANY_HAS_SST_CERTIFICATION,
          ],
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `Como a empresa ??${VariablesPGREnum.COMPANY_SHORT_NAME}?? possui sistemas de Gestão em SST esse PGR terá validade de três anos.`,
          removeWithSomeEmptyVars: [
            VariablesPGREnum.COMPANY_HAS_SST_CERTIFICATION,
          ],
        },
      ],
    },
  ],
};
