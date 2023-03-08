import { VariablesPGREnum } from '../enums/variables.enum';
import { DocumentSectionChildrenTypeEnum } from '../types/elements.types';
import { IDocumentPGRSectionGroup, DocumentSectionTypeEnum } from '../types/section.types';

export const prioritizationSection: IDocumentPGRSectionGroup = {

  data: [
    {
      type: DocumentSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_3}??`,
      children: [
        {
          type: DocumentSectionChildrenTypeEnum.H1,
          text: 'PRIORIZAÇÃO (NR-01 ‘item’ 1.5.7.3.2 alínea e)',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: "A graduação dos riscos de exposição estabelecida para os GSE's e/ou cargos é utilizada para definir prioridades. Iniciado o processo de avaliações quantitativas, as novas campanhas de monitoramento serão definidas, em princípio, pelo Índice de Julgamento obtido da análise estatística dos resultados da campanha anterior e os critérios estabelecidos no Programa de Monitoramento Ambiental e Pessoal.",
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Um grau de risco **MUITO ALTO** pode indicar situações de risco grave e iminente, em que são necessárias medidas imediatas de controle. ',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Um grau de risco **ALTO**, ou seja, com exposição entre o Nível de Ação e o Limite de Tolerância, recomenda-se monitoramento do grupo através de exames médicos e das exposições ao agente de risco. O Risco Ocupacional não deve ser o único critério de escolha do agente a ser monitorado. Evidências de desvios à saúde (não somente de doença do trabalho com nexo causal), registradas no setor médico e o número de pessoas expostas são condições básicas a considerar no julgamento profissional. Há também outros fatores tais como: referência dos trabalhadores quanto aos riscos mais graves, a existência de demanda de órgãos fiscalizadores, as possibilidades analíticas para sua avaliação e, também, para melhor adequar os EPI’s, que devem ser utilizados até que se implemente as medidas de proteção coletiva, que eliminem a exposição ao risco.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: "Em seguida apresentamos Planilhas Resumo dos Graus de Risco de Exposição estabelecidos, tanto pelo critério dos resultados das avaliações quantitativas da exposição dos GSE's e/ou cargos a diversos agentes, quanto pelo critério qualitativo para outros que ainda não foram avaliados.",
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Para os Fatores de Risco químicos (TWA, STEL ou TETO) e GSE e/ou cargos não avaliados, a empresa deverá programar campanha de monitoramento para conhecer os níveis de exposição correspondentes.',
        },
      ],
    },
  ],
};
