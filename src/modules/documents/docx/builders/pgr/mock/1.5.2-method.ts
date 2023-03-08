import { VariablesPGREnum } from '../enums/variables.enum';
import { DocumentSectionChildrenTypeEnum } from '../types/elements.types';
import { IDocumentPGRSectionGroup, DocumentSectionTypeEnum } from '../types/section.types';

export const methodSection: IDocumentPGRSectionGroup = {
  data: [
    {
      type: DocumentSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_1}??`,
      children: [
        {
          type: DocumentSectionChildrenTypeEnum.H1,
          text: 'METODOLOGIA APLICADA',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'A Metodologia aplicada para a determinação do Nível de Risco Ocupacional aos diversos Fatore de Risco e Perigos aplicada neste PGR foi baseada na Metodologia de **MATRIZ DE PROBABILIDADE/CONSEQUÊNCIA** conforme o anexo B29 da **ABNT NBR ISO/IEC 31010:2012**. A seguir é apresentado as características dessa metodologia que nortearam a sua escolha.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'A **matriz de probabilidade/consequência** é utilizada para classificar os riscos, fontes de risco ou tratamentos de risco com base no nível de risco. É comumente utilizada como uma ferramenta de seleção, quando muitos riscos foram identificados, por exemplo, para definir quais riscos necessitam de análise adicional ou mais detalhada, quais riscos **necessitam primeiro de tratamento**, ou quais riscos necessitam ser referidos a um nível mais alto de gestão. Também pode ser utilizada para selecionar **quais riscos não precisam de maior consideração neste momento**. Este tipo de matriz de risco é também amplamente utilizado para determinar se um dado risco é de uma forma geral **aceitável** ou **não aceitável**, de acordo coma sua localização na matriz. (ABNT, 2012',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'A **matriz de probabilidade/consequência** também pode ser utilizada para auxiliar a comunicação de uma compreensão comum dos níveis qualitativos dos riscos em toda a organização. Convém que a maneira como os níveis de risco são estabelecidos e as regras de decisão a eles atribuídos sejam alinhados com o apetite pelo risco da organização. (ABNT, 2012)',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Uma forma de matriz de probabilidade/consequência é utilizada para análise de criticidade em **FMECA** ou para estabelecer prioridades após o **HAZOP**. Também pode ser utilizada em situações em que **há dados insuficientes para uma análise detalhada ou a situação não assegura o tempo e esforço para uma análise mais quantitativa**. (ABNT, 2012)',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'O processo de avaliação de riscos pode ser conduzido em diferentes graus de profundidade e detalhes, que podem ir do mais simples, aos mais complexos. Cada organização deve optar por métodos e técnicas que sejam adequadas para a sua situação, de acordo com sua natureza, e que atendam às suas necessidades em termos de detalhes, complexidade, tempo, custo etc. (ABNT, 2012; ABNT, 2018b).',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'A avaliação de riscos consiste em aprimorar as análises de riscos a fim de melhor compreendê-los e auxiliar na tomada de decisão sobre as futuras ações, podendo incluir prioridades de tratamento de riscos e avaliar se uma determinada atividade deve ou não ser realizada (RIBEIRO et al., 2012).',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Pontos fortes:**',
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: `Relativamente fácil de usar (ABNT, 2012);`,
          level: 0,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: `Fornece uma rápida classificação dos riscos em diferentes níveis de significância (ABNT, 2012);`,
          level: 0,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: `Flexível, aplicável para uma generosa gama de processos;`,
          level: 0,
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Limitações** (ABNT, 2012):',
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: `Uma matriz deve ser projetada para ser apropriada às circunstâncias de forma que pode ser difícil ter um sistema comum aplicável a uma faixa de circunstâncias pertinentes para uma organização;`,
          level: 0,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: `**Forma Aplicada para Minimizar a Limitação**: Elaborado critérios específicos em função das características dos Fatores de Riscos e Perigos Conforme apresentado abaixo:`,
          level: 1,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: `**Eixo de X (Severidade):**`,
          level: 2,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: `**5 Categorias** com critérios próprios para os Fatores de Risco **Químicos e Físicos**;`,
          level: 3,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: `**5 Categorias** com critérios próprios para os Fatores de Risco **Biológicos**;`,
          level: 3,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: `**5 Categorias** com critérios próprios para os Fatores de Risco **Ergonômicos**;`,
          level: 3,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: `**5 Categorias** com critérios próprios para os Fatores de Risco e/ou Perigos de **Acidentes**;`,
          level: 3,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: `**Eixo Y (Probabilidade):**`,
          level: 2,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: `**5 Categorias** com critérios próprios para os Fatores de Risco **Químicos e Físicos**;`,
          level: 3,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: `**5 Categorias** com critérios próprios para os Fatores de Risco **Biológicos**;`,
          level: 3,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: `**5 Categorias** com critérios próprios para os Fatores de Risco **Ergonômicos**;`,
          level: 3,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: `**5 Categorias** com critérios próprios para os Fatores de Risco e/ou Perigos de **Acidentes**;`,
          level: 3,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: `É difícil definir as escalas de forma não ambígua;`,
          level: 0,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: `**Forma Aplicada para Minimizar a Limitação**: Idem item anterior, basta categorizar a **Severidade** e **Probabilidades** com rigor seguindo os critérios pré-estabelecidos.`,
          level: 1,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: `É difícil de combinar ou comparar o nível de risco para diferentes categorias de consequências;`,
          level: 0,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: `**Forma Aplicada para Minimizar a Limitação**: Idem aos dois últimos itens anteriores, basta categorizar a Severidade e Probabilidades com rigor seguindo os critérios pré-estabelecidos.`,
          level: 1,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: `A utilização é muito subjetiva e tende a haver uma variação significativa entre os classificadores;`,
          level: 0,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: `**Forma Aplicada para Minimizar a Limitação**: Recomenda-se que a aplicação da metodologia seja executada por quem realizou o levantamento preliminar de risco e/ou caracterização básica dos ambientes de trabalho, mão de obra e fatores de riscos e perigos.`,
          level: 1,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: `Os riscos não podem ser agregados (ou seja, não se pode definir que um número específico de baixos riscos ou um baixo risco identificado um número específico de vezes seja equivalente a um risco médio);`,
          level: 0,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: `**Forma Aplicada para Minimizar a Limitação**: Como os Fatores de Riscos e Perigos (FR/P) dos ambientes de trabalho demandam  mecanismos de controles específicos em função de suas características intrínsecas, tipo de processo, ramo de atividade do estabelecimento, características dos Postos de Trabalho, da Mão de Obra e até mesmo de características pessoais/individuais; o ideal e recomendo é que cada FR/P seja tratado individualmente, logo, neste caso, não trata-se de uma limitação, mas sim, uma característica positiva.`,
          level: 1,
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: `Os resultados dependerão do nível de detalhes da análise, ou seja, quanto mais detalhada a análise, maior o número de cenários, cada um com probabilidade mais baixa. Isto subestimará o nível real de risco. A forma em que os cenários são agrupados na descrição do risco deve ser consistente e definida no início do estudo (ABNT, 2012).`,
        },
      ],
    },
  ],
};
