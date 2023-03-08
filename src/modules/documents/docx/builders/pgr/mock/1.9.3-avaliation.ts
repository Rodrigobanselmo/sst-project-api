import { VariablesPGREnum } from '../enums/variables.enum';
import { DocumentSectionChildrenTypeEnum } from '../types/elements.types';
import { IDocumentPGRSectionGroup, DocumentSectionTypeEnum } from '../types/section.types';

export const available: IDocumentPGRSectionGroup = {
  data: [
    {
      type: DocumentSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_1}??`,
      children: [
        {
          type: DocumentSectionChildrenTypeEnum.H1,
          text: 'PERIODICIDADE E FORMA DE AVALIAÇÃO',
        },
        {
          type: DocumentSectionChildrenTypeEnum.H2,
          text: 'Avaliação Obrigatória',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'O acompanhamento do programa deverá ser feito pelo Coordenador Geral que promoverá pelo menos uma reunião a cada 2 meses com todos aqueles a quem delegou competência para o desempenho de atividades específicas do programa visando fazer os ajustes necessários no Plano de Ação.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.H2,
          text: 'A avaliação de riscos deve constituir um processo contínuo e ser revista a cada dois anos ou quando da ocorrência das seguintes situações (NR-01 item 1.5.4.4.6):',
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'a) Após implementação das medidas de prevenção, para avaliação de riscos residuais;',
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'b) Após inovações e modificações nas tecnologias, ambientes, processos, condições, procedimentos e organização do trabalho que impliquem em novos riscos ou modifiquem os riscos existentes;',
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'c) Quando identificadas inadequações, insuficiências ou ineficácias das medidas de prevenção;',
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'd) Na ocorrência de acidentes ou doenças relacionadas ao trabalho;',
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'e) Quando houver mudança nos requisitos legais aplicáveis.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'No caso de organizações que possuírem certificações em sistema de gestão de SST, o prazo poderá ser de até 3 (três) anos **(NR-01 item 1.5.4.4.6.1)**.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'O levantamento preliminar de perigos deve ser realizado **(NR-01 item 1.5.4.2)**:',
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'a) Antes do início do funcionamento do estabelecimento ou novas instalações;',
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'b) Para as atividades existentes; e',
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'c) Nas mudanças e introdução de novos processos ou atividades de trabalho.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.H3,
          text: 'Validade máxima deste PGR',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: `Como a empresa ??${VariablesPGREnum.COMPANY_SHORT_NAME}?? não possui sistemas de Gestão em SST esse PGR terá validade de dois anos.`,
          removeWithAllValidVars: [VariablesPGREnum.COMPANY_HAS_SST_CERTIFICATION],
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: `Como a empresa ??${VariablesPGREnum.COMPANY_SHORT_NAME}?? possui sistemas de Gestão em SST esse PGR terá validade de três anos.`,
          removeWithSomeEmptyVars: [VariablesPGREnum.COMPANY_HAS_SST_CERTIFICATION],
        },
      ],
    },
  ],
};
