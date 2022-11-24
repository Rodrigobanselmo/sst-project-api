"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.investigation = void 0;
const variables_enum_1 = require("../enums/variables.enum");
const elements_types_1 = require("../types/elements.types");
const section_types_1 = require("../types/section.types");
exports.investigation = {
    footer: true,
    header: true,
    data: [
        {
            type: section_types_1.PGRSectionTypeEnum.SECTION,
            footerText: `??${variables_enum_1.VariablesPGREnum.CHAPTER_1}??`,
            children: [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'Ainda Relativo à investigação, será necessário:',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'Após a investigação deverá ser elaborado um relatório sintético o qual será encaminhado ao gerente da empresa para as providências necessárias. Tal relatório deverá ser arquivado como um documento do programa.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'As análises de acidentes e doenças relacionadas ao trabalho devem ser documentadas e (NR-01 item 1.5.5.5.2):',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET_SPACE,
                    text: 'd) Considerar as situações geradoras dos eventos, considerando as atividades efetivamente desenvolvidas, ambiente de trabalho, materiais e organização da produção e do trabalho;',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET_SPACE,
                    text: 'e) Identificar os fatores relacionados com o evento; e',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET_SPACE,
                    text: 'f) Fornecer evidências para subsidiar e revisar as medidas de prevenção existentes.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'A Norma ABNT NBR 14.280 fixa critérios para o registro, comunicação, estatística, investigação e análise de acidentes do trabalho, suas causas e consequências, aplicando-se a quaisquer atividades laborativas. Esta Norma aplica-se a qualquer empresa, entidade ou estabelecimento interessado no estudo do acidente do trabalho, suas causas e consequências.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '**Transcrevemos a seguir alguns conceitos:**',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Acidente do trabalho:** Ocorrência imprevista e indesejável, instantânea ou não, relacionada com o exercício do trabalho, de que resulte ou possa resultar lesão pessoal.',
                    level: 0,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Acidente sem lesão:** Acidente que não causa lesão pessoal.',
                    level: 0,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Acidente de trajeto:** Acidente sofrido pelo empregado no percurso da residência para o local de trabalho ou deste para aquela, independentemente do meio de locomoção, inclusive veículo de propriedade do empregado, desde que não haja interrupção ou alteração de percurso por motivo alheio ao trabalho.',
                    level: 0,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Acidente impessoal:** Acidente cuja caracterização independe de existir acidentado, não podendo ser considerado como causador direto da lesão pessoal.',
                    level: 0,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Acidente inicial:** Acidente impessoal desencadeador de um ou mais acidentes.',
                    level: 0,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Espécie de acidente impessoal (espécie):** Caracterização da ocorrência de acidente impessoal de que resultou ou poderia ter resultado acidente pessoal.',
                    level: 0,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Acidente pessoal:** Acidente cuja caracterização depende de existir acidentado.',
                    level: 0,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Tipo de acidente pessoal (tipo):** Caracterização da forma pela qual a fonte da lesão causou a lesão.',
                    level: 0,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Agente do acidente (agente):** Coisa, substância ou ambiente que, sendo inerente à condição ambiente de segurança, tenha provocado o acidente.',
                    level: 0,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Fonte da lesão:** Coisa, substância, energia ou movimento do corpo que diretamente provocou a lesão.',
                    level: 0,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '**Causas do Acidente:**',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: 'Fator pessoal de insegurança (fator pessoal): Causa relativa ao comportamento humano, que pode levar à ocorrência do acidente ou à prática do ato inseguro.',
                    level: 0,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: 'Fator pessoal de insegurança (fator pessoal): Causa relativa ao comportamento humano, que pode levar à ocorrência do acidente ou à prática do ato inseguro.',
                    level: 0,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: 'Condição ambiente de insegurança (condição ambiente): Condição do meio que causou o acidente ou contribuiu para a sua ocorrência.',
                    level: 0,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'Consequências do Acidente:',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: 'Lesão pessoal: Qualquer dano sofrido pelo organismo humano, como consequência de acidente do trabalho.',
                    level: 0,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: 'Natureza da lesão: Expressão que identifica a lesão, segundo suas características principais.',
                    level: 0,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: 'Localização da lesão: Indicação da sede da lesão.',
                    level: 0,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: 'Lesão imediata: Lesão que se manifesta no momento do acidente.',
                    level: 0,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: 'Lesão mediata (lesão tardia): Lesão que não se manifesta imediatamente após a circunstância acidental da qual resultou.',
                    level: 0,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: 'Doença do trabalho: Doença decorrente do exercício continuado ou intermitente de atividade laborativa capaz de provocar lesão por ação mediata.',
                    level: 0,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: 'Doença profissional: Doença do trabalho causada pelo exercício de atividade específica, constante de relação oficial.',
                    level: 0,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: 'Morte: Cessação da capacidade de trabalho pela perda da vida, independentemente do tempo decorrido desde a lesão.',
                    level: 0,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: 'Lesão com afastamento (lesão incapacitante ou lesão com perda de tempo): Lesão pessoal que impede o acidentado de voltar ao trabalho no dia imediato ao do acidente ou de que resulte incapacidade permanente.',
                    level: 0,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: 'Lesão sem afastamento (lesão não incapacitante ou lesão sem perda de tempo): Lesão pessoal que não impede o acidentado de voltar ao trabalho no dia imediato ao do acidente, desde que não haja incapacidade permanente.',
                    level: 0,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: 'Acidentado: Vítima de acidente.',
                    level: 0,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: 'Incapacidade permanente total: Perda total da capacidade de trabalho, em caráter permanente, sem morte.',
                    level: 0,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: 'Incapacidade permanente parcial: Redução parcial da capacidade de trabalho, em caráter permanente que, não provocando morte ou incapacidade permanente total, é causa de perda de qualquer membro ou parte do corpo, perda total do uso desse membro ou parte do corpo, ou qualquer redução permanente de função orgânica.',
                    level: 0,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'Incapacidade temporária total: Perda total da capacidade de trabalho de que resulte um ou mais dias perdidos, excetuadas a morte, a incapacidade permanente parcial e a incapacidade permanente total.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'A íntegra da Norma poderá ser adquirida no site <link>https://www.abntcatalogo.com.br|www.abntcatalogo.com.br/norma.aspx?ID=002449<link>.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H3,
                    text: 'Comunicação do Acidente de Trabalho – CAT',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'Todas as empresas são obrigadas a informar à Previdência Social todos os acidentes de trabalho ocorridos com seus empregados, mesmo que não haja afastamento das atividades, até o primeiro dia útil seguinte ao da ocorrência.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'A CAT deve ser gerada através do evento S-2210 do eSocial e deve ser registrada até o primeiro dia útil seguinte ao da ocorrência e, em caso de morte, de imediato.',
                },
            ],
        },
    ],
};
//# sourceMappingURL=1.9-investigation.js.map