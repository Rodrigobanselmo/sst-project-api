import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import {
  IDocumentPGRSectionGroup,
  PGRSectionTypeEnum,
} from '../types/section.types';

//* document example (TOXILAB) form page 12 to 30

export const developmentSection: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      type: PGRSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_1}??`,
      children: [
        {
          type: PGRSectionChildrenTypeEnum.H1,
          text: 'DESENVOLVIMENTO DO PGR – METODOLOGIA APLICADA',
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'Antecipação dos Riscos (NR-01 item 1.5.3.2 alínea a)',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'A antecipação dos riscos será efetuada através da avaliação e do estudo de todas as modificações, novos projetos, novos produtos, novos resíduos e novas tarefas que venham a ser introduzidas no ambiente ocupacional. A avaliação deverá ser feita com enfoque nos riscos ocupacionais e, quando necessário, envolver uma pessoa com conhecimento técnico do assunto. A empresa deverá elaborar um procedimento para assegurar que todas as modificações a serem implantadas, sejam avaliadas preliminarmente com relação aos riscos potencialmente presentes.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'A antecipação dos riscos será efetuada através da análise preliminar de perigos de todas as intervenções nos processos produtivos, e caso o risco seja relevante será incorporados ao PGR e demais programas que se façam necessários.',
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'Reconhecimento dos Riscos – Caracterização Básica (NR-01 item 1.5.3.2 alínea b) / (NR-01 item 1.5.4)',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'O reconhecimento dos riscos ambientais deverá conter os seguintes itens, quando aplicáveis:',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'a) **Reconhecimento do Agente:** Consiste em perceber / aceitar / admitir que tem o Risco.',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'b) **Identificação – Determinação de sua Localização e Fonte Geradora:** Consiste em localizar a(s) principal (is) fontes geradoras do contaminante **(NR-01 item 1.5.4.3.1 alínea b).**',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'c) **Trajetória e Meios de Propagação:** Consiste em Identificar a trajetória e formas de propagação do agente.',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'd) **Funções e Trabalhadores Expostos:** Consistem em identificar o número de trabalhadores expostos ao agente agressivo as atividades desenvolvidas? / Gestos profissionais.',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'e) **Caracterização da Atividade e do Tipo de Exposição:** Consiste em estimar o tempo e a frequência de exposição ao agente durante a jornada de trabalho. A ferramenta proposta é a matriz AIHA.',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'f) **Obtenção Dados Epidemiológicos da Empresa:** Consiste em examinar, quando disponível, o histórico clínico, estatísticas, casos e demais informações sobre queixas mais comum, acidentes ou doenças do trabalho ocorrido na empresa.',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'g) **Possíveis Danos a Saúde:** Consiste em identificar na literatura técnica (Ex. Lista B Decreto 3048/99 INSS – Agentes Etiológicos, Base do TLV da ACGIH) Agentes Etiológicos – os possíveis danos a saúde relacionados aos riscos identificados (NR-01 item 1.5.4.3.1 alínea a).',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'h) **Medidas de Controle Já Existentes:** Consiste em descrever as tecnologias de proteção individual e coletiva existentes.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'A identificação e o reconhecimento dos Perigos e Fatores de Riscos requerem a aplicação de uma ferramenta específica que auxilie a sistematizar o risco no ambiente de trabalho e apresente como resultado as prioridades de controle ambiental do ponto de vista técnico. O reconhecimento dos riscos será um processo contínuo na empresa e incluirá a caracterização do ambiente de trabalho, da mão de obra e dos Fatores de Risco:',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Caracterização do Ambiente de Trabalho (NR-01 item 1.5.7.3.2 alínea a)**',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Consistirá na descrição dos processos da empresa baseado em fluxogramas de processo, layout, contemplando as áreas, sistemas, principais equipamentos, identificação dos riscos e agentes associados, momentos de maior exposição e resultados de avaliações quantitativas pregressas.',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Caracterização da Mão de Obra (NR-01 item 1.5.4.3.1 alínea c) / (NR-01 item 1.5.7.3.2 alínea b)**',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Para cada função integrante do organograma funcional da empresa, serão relacionadas às diferentes tarefas e atividades executadas, os riscos de exposição associados, a mobilidade entre as diversas áreas, o tempo de exposição aos agentes ambientais e as medidas de controle existentes. Estas informações serão tabuladas na Planilha “Inventário de Risco”, integrante do capítulo de Caracterização da Mão de Obra. Esse sumário pode variar em função do Fator de Riscos a ser caracterizado, sendo assim, mais de um modelo poderá ser utilizado.',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Caracterização dos Fatores de Risco (NR-01 item 1.5.7.3.2 alínea c)',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Será elaborado um inventário (Rol) dos Perigos/Fatores de Riscos e para todos que possuam relevância de causar dano a saúde dos trabalhadores serão caracterizados e a depender da sua Severidade e/ou Probabilidade serão quantificados qualitativamente e/ou quantitativamente.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'No mínimo serão levantadas as seguintes informações quando possível (Aplicável):',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Principais sintomas e efeitos crônicos à saúde;',
          level: 1,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Grau de Efeito à Saúde – GES; conforme item 6.3.1;',
          level: 1,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Pressão de Vapor – PV;',
          level: 1,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Ponto de Ebulição – PE;',
          level: 1,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Número internacional CAS;',
          level: 1,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Carcinogenicidade ACGIH **(NR-01 item 1.5.4.1);**',
          level: 1,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Carcinogenicidade LINACH **(NR-01 item 1.5.4.1);**',
          level: 1,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'BEI/Exame Complementar (ACGIH/NR07) **(NR-01 item 1.5.4.1);**',
          level: 1,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Concentração Imediatamente Perigoso a Vida e a Saúde – IPVS (IDLH);',
          level: 1,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Limites de Tolerância (NR-15, ACGIH, acordos coletivos) **(NR-01 item 1.5.4.1);**',
          level: 1,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Método Amostragem.',
          level: 1,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Como resultado desta Caracterização Básica serão definidos e constituídos os Grupos Similares de Exposição – GSE’s, que serão avaliados anualmente, quanto à sua consistência, baseados nos resultados das avaliações quantitativas.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'A identificação dos perigos deve abordar os perigos externos previsíveis relacionados ao trabalho que possam afetar a saúde e segurança no trabalho **(NR-01 item 1.5.4.3.2).**',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Avaliação dos Fatores de Riscos (NR-01 item 1.5.7.3.2 alínea d)**',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'No Desenvolvimento do PGR deve constar os dados da análise preliminar ou do monitoramento das exposições a agentes físicos, químicos, biológicos, ergonômicos e de acidentes.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Para os postos de trabalho onde a Análise Ergonômica Preliminar (AEP) considerar necessário, deverá ser elaborada a Análise Ergonômica do Trabalho (AET) para determinar a origem dos fatores de risco e medidas de eliminação ou redução do risco.',
        },
      ],
    },
  ],
};
