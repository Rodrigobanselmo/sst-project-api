import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import {
  IDocumentPGRSectionGroup,
  PGRSectionTypeEnum,
} from '../types/section.types';

export const document: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      type: PGRSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_1}??`,
      children: [
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'Documentação, Manutenção dos Registros e Divulgação de Dados (NR-01 Item 1.5.7)',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Todos os documentos relativos ao PGR estarão arquivados na Coordenação de Segurança, Higiene e Meio Ambiente e deverão estar sempre acessíveis e disponíveis aos membros da CIPA, aos colaboradores ou seus representantes e aos órgãos de fiscalização (NR-01 Item 1.5.7.3.3).',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Os seguintes documentos deverão estar arquivados e de fácil acesso (NR-01 Item 1.5.7.2):',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Documento-Base do PGR e seus anexos;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Inventário de riscos (NR-01 item 1.5.7.1 alínea a);',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Plano de Ação (NR-01 item 1.5.7.1 alínea b);',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Programa de Monitoramento Ambiental e Pessoal para Controle de Agentes Químicos e Físicos;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Procedimentos escritos contendo as normas de segurança;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Relatórios de investigação de acidentes;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Relatórios de inspeções internas;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Registro de treinamentos recebidos;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Relatórios de inspeções ou auditorias externas;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Relatórios de avaliações ambientais.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Os documentos integrantes do PGR devem ser elaborados sob a responsabilidade da organização, respeitado o disposto nas demais Normas Regulamentadoras, datados e assinados (NR-01 Item 1.5.7.2).',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Os documentos e dados deverão ser preservados por um período mínimo de 20 (vinte) anos. A divulgação dos dados será feita através de reuniões de divulgação, Boletins de Circulação Interna, reuniões da CIPA e Quadros de Avisos **(NR-01 Item 1.5.7.3.3.1).**',
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'PLANO DE ATENDIMENTO E RESPOSTA A EMERGÊNCIAS (NR-01 Item 1.5.6)',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Deve ser elaborado um Plano para respostas aos cenários de emergências, de acordo com os riscos, as características e as circunstâncias das atividades, caso seja identificado algum cenário de emergência que se justifique essa ação. (NR-01 Item 1.5.6.1)',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Os procedimentos de respostas aos cenários de emergências devem prever: (NR-01 Item 1.5.6.2)',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'g) Os meios e recursos necessários para os primeiros socorros, encaminhamento de acidentados e abandono; e',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'h) As medidas necessárias para os cenários de emergências de grande magnitude, quando aplicável.',
        },
      ],
    },
  ],
};