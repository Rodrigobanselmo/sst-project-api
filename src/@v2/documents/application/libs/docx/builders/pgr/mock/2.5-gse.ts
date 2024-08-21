import { VariablesPGREnum } from '../enums/variables.enum';
import { DocumentSectionChildrenTypeEnum } from '@/@v2/documents/domain/types/DocumentSectionChildrenTypeEnum';
import { IDocumentPGRSectionGroup } from '../../../../../../domain/types/section.types';
import { DocumentSectionTypeEnum } from '@/@v2/documents/domain/enums/document-section-type.enum';

export const gseSection: IDocumentPGRSectionGroup = {
  data: [
    {
      type: DocumentSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_2}??`,
      removeWithSomeEmptyVars: [VariablesPGREnum.COMPANY_HAS_GSE_RISK],
      children: [
        {
          type: DocumentSectionChildrenTypeEnum.H1,
          text: 'DEFINIÇÃO DOS GRUPOS SIMILARES DE EXPOSIÇÃO (GSE)',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Na Tabela a seguir é apresentada toda estrutura organizacional da empresa. Entende-se por GSE, um grupo de empregados que potencialmente apresentam um perfil de exposição a certos Fatores de Risco igual ou semelhante, de modo que o resultado da amostragem de exposição de um indivíduo é representativo para os demais membros do grupo.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'De modo a definir os GSE, foram feitas avaliações do local de trabalho, das atividades, mobilidade entre áreas de trabalho que cada função realiza e os Fatores de Risco envolvidos na exposição.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'As ferramentas usadas na obtenção das informações necessárias foram:',
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Organograma da empresa;',
          level: 0,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Entrevistas com empregados de todos os níveis funcionais;',
          level: 0,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Análise das funções, atribuições e responsabilidades;',
          level: 0,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Análise dos processos de trabalho e fluxogramas das instalações operacionais;',
          level: 0,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Visitas às instalações operacionais e observação das atividades desenvolvidas.',
          level: 0,
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Os empregados foram classificados por funções. Isto é importante por se tratar de uma forma padronizada de classificação que permite realizar estudos epidemiológicos no futuro ou em andamento, além de permitir projeções e estimativas de diversos parâmetros.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'O potencial de risco de exposição aos Fatores de Risco e Perigos está diretamente relacionado com a localização do posto de trabalho, tempo de permanência e atividades executadas por empregado.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'A localização é importante porque o potencial de exposição é proveniente da contaminação ambiental presente. Portanto, a exposição de um empregado será provavelmente bem diferente dependendo se ele trabalha no prédio administrativo, sala de controle ou na área operacional. Neste sentido, o conhecimento da MOBILIDADE do empregado é importante porque estabelece o percentual de tempo gasto em cada local, em média, durante sua jornada diária de trabalho.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'As atividades são importantes porque, em alguns casos, faz com que o empregado entre em contato ou libere o agente de risco (ex: limpeza de tanques, coleta de amostras, drenagem de equipamentos, manuseio e mistura de resíduos etc.). ',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'As planilhas de “Inventário de Riscos (APR)”, apresentadas no Anexo I, estabelecem para cada função a quantidade de empregados, uma descrição de atividades e responsabilidades, a mobilidade, os Fatores de Risco, causas e fontes e medidas de controle existentes para eliminação ou atenuação das exposições com relação aos agentes identificados. Com estas informações foram definidos os Grupos Similares de Exposição, conforme apresentado na Tabela a seguir. A Tabela apresentada na sequência, relaciona os componentes (nomes e funções) de cada Grupo Homogêneo de Exposição.',
        },
      ],
    },
  ],
};
