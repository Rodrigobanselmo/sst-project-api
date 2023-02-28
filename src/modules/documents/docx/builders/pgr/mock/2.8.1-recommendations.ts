import { VariablesPGREnum } from '../enums/variables.enum';
import { DocumentSectionChildrenTypeEnum } from '../types/elements.types';
import { IDocumentPGRSectionGroup, DocumentSectionTypeEnum } from '../types/section.types';

export const recommendations1Section: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      type: DocumentSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_3}??`,
      removeWithAllEmptyVars: [VariablesPGREnum.HAS_HEAT, VariablesPGREnum.HAS_VFB, VariablesPGREnum.HAS_VL],
      children: [
        {
          type: DocumentSectionChildrenTypeEnum.H3,
          text: 'Calor',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.H4,
          text: 'Medidas preventivas',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'As medidas preventivas são ações que visam minimizar a probabilidade de as exposições ocupacionais ao calor atingirem a região de incerteza, podendo causar prejuízos à saúde do trabalhador. Devem incluir:',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Monitoramento periódico da exposição, que consiste em uma avaliação sistemática e repetitiva da exposição dos trabalhadores, visando a um acompanhamento dos níveis de exposição e das medidas de controle para identificar a necessidade de introdução de novas medidas ou modificação das já existentes;',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Disponibilização de água e sais minerais para reposição adequada da perda pelo suor, segundo orientação médica; ',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Treinamento e informação aos trabalhadores;',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Controle médico, envolvendo exames médicos admissionais e periódicos, com foco na exposição ao calor, visando à determinação e ao monitoramento da aptidão física e à manutenção de um histórico ocupacional;',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Permissão para interromper o trabalho quando o trabalhador sentir extremo desconforto ao calor ou identificar sinais de alerta ou condições de risco à sua saúde.',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Nos programas de treinamento, os trabalhadores devem ser informados e orientados sobre:',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Riscos decorrentes da exposição ao calor;',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Aclimatização, hidratação e pausas no trabalho;',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Reconhecimento dos sinais e dos sintomas decorrentes da exposição;',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Condutas a serem adotadas em situações de emergência;',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Necessidade de comunicar a seus superiores quaisquer situações de risco e sinais de sintomas relacionados à exposição ao calor;',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Cuidados e procedimentos recomendáveis para redução da sobrecarga fisiológica;',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Eventuais limitações de proteção das medidas de controle, sua importância e seu uso correto;',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Outros fatores não ocupacionais agravantes da exposição, tais como, uso de medicação, consumo de bebidas alcoólicas e drogas;',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Doenças que possam limitar o trabalho sob condições de sobrecarga térmica, tais como, doenças cardiovasculares, hipertensão arterial, diabetes e obesidade.',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'As medidas de caráter preventivo descritas neste ‘subitem’ não excluem outras medidas que possam ser consideradas necessárias ou recomendáveis em função das particularidades de cada situação e de cada trabalhador exposto.',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.H4,
          text: ' Medidas corretivas',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'As medidas corretivas visam reduzir a exposição a valores abaixo do limite considerado, devendo ser adotadas conforme as recomendações estabelecidas no critério de julgamento e na tomada de decisão.',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Entre as diversas medidas corretivas, podem ser citadas:',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Modificação do processo ou da operação de trabalho, tais como, redução da temperatura ou da emissividade das fontes de calor, mecanização ou automatização do processo;',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Utilização de barreiras refletoras ou absorventes;',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Adequação da ventilação;',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Redução da umidade relativa do ar;',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Alternância de operações que geram exposições a níveis mais elevados de calor com outras que não apresentem exposições ou impliquem exposições a menores níveis, resultando na redução da exposição horária;',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Reorganização de bancadas e postos de trabalho;',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Alteração das rotinas ou dos procedimentos de trabalho;',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Introdução de pausas;',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Disponibilização de locais climatizados ou termicamente mais amenos para recuperação térmica.',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'As medidas de caráter corretivo descritas neste ‘subitem’ não excluem outras medidas que possam ser consideradas necessárias ou recomendáveis em função das particularidades de cada situação e de cada trabalhador exposto.',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_HEAT],
        },
        {
          type: DocumentSectionChildrenTypeEnum.H3,
          text: 'Vibrações de Corpo Inteiro',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_VFB],
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Entre as diversas medidas corretivas podem ser citadas:',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_VFB],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Modificação do processo ou da operação de trabalho, podendo envolver: o reprojeto de plataformas de trabalho; a reformulação, a reorganização ou a alteração das rotinas ou dos procedimentos de trabalho; a adequação de veículos utilizados, especialmente pela adoção de assentos antivibratórios; a melhoria das condições e das características dos pisos e pavimentos utilizados para circulação das máquinas e dos veículos;',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_VFB],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Manutenção de veículos e máquinas, envolvendo especialmente os sistemas de suspensão e amortecimento, assento do operador, calibração de pneus, alinhamento e balanceamento, troca de componentes defeituosos ou desgastados de forma a mantê-los em bom estado de conservação;',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_VFB],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Redução do tempo de exposição diária;',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_VFB],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Alternância de atividades ou operações que geram exposições a níveis mais elevados de vibração com outras que não apresentem exposições ou impliquem exposições a menores níveis, resultando na redução da exposição diária.',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_VFB],
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'As medidas de caráter corretivo descritas neste ‘subitem’ não excluem outras medidas que possam ser consideradas necessárias ou recomendáveis em função das particularidades de cada situação.',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_VFB],
        },
        {
          type: DocumentSectionChildrenTypeEnum.H3,
          text: 'Vibrações de Mãos e Braços',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_VL],
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Entre as diversas medidas corretivas podem ser citadas:',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_VL],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Modificação do processo ou da operação de trabalho, podendo envolver a substituição de ferramentas e acessórios, a reformulação ou a reorganização de bancadas e postos de trabalho, a alteração das rotinas ou dos procedimentos de trabalho, a adequação do tipo de ferramenta, do acessório utilizado e das velocidades operacionais;',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_VL],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Manutenção das ferramentas, em especial aquelas com eixo excêntrico, de forma a mantê-las em bom estado de conservação;',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_VL],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Troca de componentes gastos ou defeituosos, tais como: discos, rebolos, ponteiras, correntes de corte, mancais, rolamentos e acoplamentos;',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_VL],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Troca de componentes novos quando identificado que estes produzem vibração excessiva, resultante, por exemplo, de defeitos de fabricação ou da má qualidade dos produtos;',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_VL],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Redução do tempo de exposição diária;',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_VL],
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: 'Alternância de atividades ou operações que gerem exposições a níveis mais elevados de vibração com outras que não apresentem exposições ou impliquem exposições a menores níveis, resultando na redução da exposição diária',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_VL],
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'As medidas de caráter corretivo descritas neste ‘subitem’ não excluem outras medidas que possam ser consideradas necessárias ou recomendáveis em função das particularidades de cada situação.',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_VL],
        },
      ],
    },
  ],
};
