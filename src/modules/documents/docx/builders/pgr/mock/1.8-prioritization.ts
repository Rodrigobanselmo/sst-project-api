import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import {
  IDocumentPGRSectionGroup,
  PGRSectionTypeEnum,
} from '../types/section.types';

export const prioritization: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      type: PGRSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_1}??`,
      children: [
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'Priorização de GSE’s e Fatores de Risco (NR-01 item 1.5.3.2 alínea d) / (NR-01 item 1.5.7.3.2 alínea e)',
        },
        {
          type: PGRSectionChildrenTypeEnum.H3,
          text: 'Priorização de GSE’s e Fatores de Risco (NR-01 item 1.5.3.2 alínea d) / (NR-01 item 1.5.7.3.2 alínea e)',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Utilizando-se os critérios da metodologia adotada, serão identificadas as necessidades de avaliações quantitativas das exposições dos GSE’s que apresentarem, em princípio, Risco Ocupacional **(RO)** classificado como **ALTO** e **MUITO ALTO** aos Fatores de Riscos ambientais físicos, químicos e biológicos analisados e da adoção, melhoria ou manutenção de medidas de controle.',
        },
        {
          type: PGRSectionChildrenTypeEnum.H3,
          text: 'Priorização de Tarefas/atividades e Ambientes (NR-01 item 1.5.7.3.2 alínea e)',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Serão priorizadas aquelas tarefas/atividades, quando o empregado estiver exposto diretamente ao Fator de Risco (Exposição Primária), por exemplo: coleta de amostras, drenagem, preparo de soluções padrão no laboratório, etc. ou exerce atividade em ambiente com alta concentração de agentes químicos agressivos classificados nos Níveis 4 e 5 de Efeitos à Saúde, mesmo que não esteja envolvido diretamente na atividade em questão (Exposição Secundária), assim como, as atividades que envolvem Fatores de Riscos Químicos o qual o possuem Limites de Exposição Ocupacional para Curta Duração (STEL) ou Valor Teto – VT.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Quanto aos ambientes, serão priorizados aqueles locais onde existe o risco de exposição a agentes químicos agressivos e a presença significativa de funcionários.',
        },
        {
          type: PGRSectionChildrenTypeEnum.H3,
          text: 'Recomendações de Metas de Avaliação e Controle (NR-01 item 1.4.1 alínea g)',
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'Avaliação do Grau de Exposição Estimados – GEE (Probabilidade)',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'As recomendações das metas com relação às medidas de controle serão feitas levando-se em conta a hierarquia proposta na NR-01 item 1.4.1, que prevê a adoção preferencial de medidas de caráter coletivo ou de engenharia, atuando na fonte de risco. As medidas administrativas ou de proteção individual terão caráter complementar, temporário ou emergencial, ou ainda quando a implantação da primeira não for viável ou estiver em implantação.',
        },
        {
          type: PGRSectionChildrenTypeEnum.MEASURE_IMAGE,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH_FIGURE,
          text: 'Hierarquia frente aos principais tipos de medidas de controle',
        },
        {
          type: PGRSectionChildrenTypeEnum.H4,
          text: 'Acompanhamento e Controle dos Riscos Ocupacionais (NR-01 item 1.5.3.2 alínea d)',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'As recomendações serão organizadas na forma de uma versão preliminar de um Plano de Ações do PGR, contendo para cada ação sugerida os objetivos e metas, prioridades, estratégia e metodologia de ação. Esta sugestão de plano servirá como instrumento de discussão com todos os setores da empresa envolvidos no processo e para consolidação do Plano de Ações do PGR a ser implementado após cada revisão.',
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'Planos de Ação (NR-01 item 1.5.5.2 / NR-01 item 1.5.3.2 alínea f)',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Plano de Ação deve indicar as medidas de prevenção a serem introduzidas, aprimoradas ou mantidas.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Para as medidas de prevenção deve ser definido cronograma, formas de acompanhamento e aferição de resultados. Implementação e acompanhamento das medidas de prevenção',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'A implementação das medidas de prevenção e respectivos ajustes devem ser registrados.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'O desempenho das medidas de prevenção deve ser acompanhado de forma planejada e contemplar:',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'a) a verificação da execução das ações planejadas;',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'b) as inspeções dos locais e equipamentos de trabalho; e',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'c) o monitoramento das condições ambientais e exposições a agentes nocivos, quando aplicável.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'As medidas de prevenção devem ser corrigidas quando os dados obtidos no acompanhamento indicarem ineficácia em seu desempenho.',
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'Implantação de Medidas de Controle e Avaliação de Sua Eficácia (NR-01 item 1.5.3.4 / 1.5.5)',
        },
        {
          type: PGRSectionChildrenTypeEnum.H3,
          text: 'Implantação de Medidas de Controle (NR-01 item 1.5.3.4)',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Deverão ser adotadas as medidas necessárias e suficientes para a eliminação, a minimização ou o controle dos riscos ambientais sempre que forem verificadas uma ou mais das seguintes situações:',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Identificação, na fase de antecipação, de risco potencial à saúde;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Constatação, na fase de reconhecimento, de risco evidente à saúde;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Quando os resultados das avaliações quantitativas da exposição dos trabalhadores excederem os valores limites previstos na NR-15, na ausência destes, os valores adotados pela ACGIH, ou aqueles estabelecidos em negociações coletivas de trabalho, desde que mais rigorosos que os critérios técnico-legais estabelecidos;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Quando, através do controle médico da saúde, for caracterizado o nexo causal entre danos observados na saúde dos colaboradores e a situação de trabalho a que eles ficam expostos.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'As ações relativas ao gerenciamento e controle dos riscos ambientais serão implantadas de acordo com o cronograma, a alocação de recursos, definição de responsabilidades e prazos, discriminados no Plano de Ação do PGR. O acompanhamento da implantação das medidas de controle é atribuição do Coordenador Geral, bem como a sua divulgação.',
        },
        {
          type: PGRSectionChildrenTypeEnum.H3,
          text: 'Avaliação da Eficácia das Medidas de Controle',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Para avaliação da eficácia das medidas de controle, o critério adotado será a realização de inspeções para análise e avaliação das condições de higiene e segurança dos locais e vizinhanças onde tais medidas foram implantadas. Essas inspeções serão feitas:',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Rotineiramente pelos responsáveis de cada setor;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'No mínimo anualmente pela CIPA, buscando identificar a existência de novas situações de riscos e a observância os procedimentos propostos;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Anualmente, pelo coordenador do PGR ou quem ele designar para checar as avaliações anteriores e identificar novas situações de risco;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'E sempre que for concluída uma ação do Plano de Ação relativa a Medidas de Controle, para que seja avaliado o risco residual.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Relatos simplificados destas inspeções devem ser registrados e arquivados como um documento do programa.',
        },
        {
          type: PGRSectionChildrenTypeEnum.H4,
          text: 'Risco “Puro” ou “Inerente” & Risco Residual',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Ao realizar uma avaliação de risco, o primeiro passo é identificar o risco inerente e, em seguida, considerar os controles eficazes e eficientes ainda não implementados para então se chegar ao risco residual que teoricamente deve possuir um nível aceitável, pelo menos essa é a expectativa.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Definições:**',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Risco inerente (ou Risco Puro):** Representa a quantidade de risco constatada com os controles existentes no momento da caracterização dos riscos.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Risco residual:** É a quantidade de risco que permaneceria após a inclusão dos controles adicionais e/ou ajustes dos controles existentes, ou seja, o risco que não seria eliminado mesmo com a adoção das medidas de controle recomendadas.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Parece simples, mas esses dois termos tendem a confundir quando colocados em prática.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'O estado de risco verdadeiramente inerente (Puro), em caráter teórico, pressupõe que não sejam consideradas nenhuma das medidas de controles já existentes. Se isso realmente for feito teremos como resultado quase certo um risco **Alto ou Muito Alto (Situações de risco fora de controle)**, o que na prática não seria aplicável visto que a maioria dos ambientes de trabalho que envolvem algum tipo de risco já implementam alguma medida de controle. Sendo assim, o recomendado é analisar o risco considerando sempre as medidas de controles já existentes.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Se, após a Caracterização dos Fatores de Riscos e Perigos, conforme orientação descrita acima, o RO resultante for Alto ou Muito Alto, sugestões de Medidas de Controles devem ser aplicadas com intuito de se obter um novo **RO aceitável (Moderado, Baixo e Muito Baixo)**.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Sendo assim, o objetivo é tornar o Risco Residual aceitável, independentemente da existência de medidas de controles prévias ou não. Devemos considerar, portanto, o Risco Puro aquele avaliado in loco, e, mesmo que já existam medidas de controle aplicadas, se estas não garantirem um nível aceitável outras medidas deverão ser sugeridas a fim de tornar o Risco Residual Moderado, Baixo ou Muito Baixo.',
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'Monitoração da Exposição aos Riscos – Avaliação Quantitativa',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Para o monitoramento da exposição dos colaboradores, deverá ser realizada uma avaliação sistemática e repetitiva da exposição a um dado risco, devendo ser estabelecido em um Programa de Monitoramento Ambiental e Pessoal para Controle de Agentes Químicos e Ruído, visando à introdução ou modificação das medidas de controle, sempre que necessário.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Deverão ser objeto de controle sistemático as situações que apresentem exposição ocupacional acima dos Níveis de Ação, conforme explicitado na NR-15 e apresentados a seguir:',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Agentes Químicos:**',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Metade dos limites de exposição ocupacional (NR-15, ACGIH, acordos coletivos).',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `A ??${VariablesPGREnum.COMPANY_SHORT_NAME}??. adotará o MVUE e quanto ao Limite de Tolerância irá sempre considerar o mais restritivo dentre aqueles da NR-15 e ACGIH e monitorará sistematicamente todos aqueles que apresentarem o MVUE acima do Nível de Ação.`,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Agente Físico – Ruído:',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Dose > 0,5 (dose superior a 50%), conforme critério da NR-15, Anexo no 1, item 6.',
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'Investigação de Acidentes ou Doenças Ocupacionais (NR-01 item 1.5.5)',
        },
        {
          type: PGRSectionChildrenTypeEnum.H3,
          text: 'Investigação de Acidente de Trabalho',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Todo acidente, independentemente do tipo deve ser comunicado imediatamente ao supervisor responsável pelo setor, a equipe de segurança do trabalho, quando houver e ao Coordenador do PGR.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Os mecanismos e o fluxo da comunicação dos acidentes deves ser amplamente divulgados aos empregados próprios e aos empregados de empresas contratadas.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Conforme a NR 18, item, 18.16.23, em caso de ocorrência de acidente fatal, é obrigatória a adoção das seguintes medidas:',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'a) Comunicar de imediato e por escrito ao órgão regional competente em matéria de segurança e saúde no trabalho, que repassará a informação ao sindicato da categoria profissional;',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'b) Isolar o local diretamente relacionado ao acidente, mantendo suas características até sua liberação pela autoridade policial competente e pelo órgão regional competente em matéria de segurança e saúde no trabalho;',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'c) A liberação do local, pelo órgão regional competente em matéria de segurança e saúde no trabalho, será concedida em até 72 (setenta e duas) horas, contadas do protocolo de recebimento da comunicação escrita ao referido órgão.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Vale ressaltar que a NR-18 é uma Norma Regulamentadora Setorial (CONDIÇÕES DE SEGURANÇA E SAÚDE NO TRABALHO NA INDÚSTRIA DA CONSTRUÇÃO), logo, embora todas as orientações acima seja uma boa prática independente da empresa, nem todos os prazos e quesitos técnicos se aplica aos demais seguimentos.',
        },
      ],
    },
  ],
};
//??${VariablesPGREnum.COMPANY_SHORT_NAME}??
