"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendationsSection = void 0;
const variables_enum_1 = require("../enums/variables.enum");
const elements_types_1 = require("../types/elements.types");
const section_types_1 = require("../types/section.types");
exports.recommendationsSection = {
    footer: true,
    header: true,
    data: [
        {
            type: section_types_1.PGRSectionTypeEnum.SECTION,
            footerText: `??${variables_enum_1.VariablesPGREnum.CHAPTER_3}??`,
            children: [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H1,
                    text: 'RECOMENDAÇÕES (NR-01 ‘item’ 1.5.3.4)',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: `Os itens a seguir, foram compilados do Plano de Ação, onde encontra-se os fatores de risco e perigos incluindo as fontes geradoras e Cargos/GSE's expostos e demais informações que justificam as recomendações abaixo`,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H2,
                    text: 'Monitoramento (Quando aplicável)',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: `A **??${variables_enum_1.VariablesPGREnum.COMPANY_SHORT_NAME}??** deve dar início a uma estratégia de avaliação quantitativa para os Fatores de Risco físicos e químicos priorizados. Portanto recomenda-se:`,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Elaborar/Revisar** o Programa de Monitoramento e Controle Ambiental de Agentes Químicos e Físicos com base na planilha de priorização e Plano de Ação deste PGR.',
                    level: 0,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H2,
                    text: 'Plano de Atendimento a Emergência',
                    removeWithSomeEmptyVars: [variables_enum_1.VariablesPGREnum.HAS_EMERGENCY],
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '**Aplicável devido a caracterização dos perigos listados a seguir:**',
                    removeWithSomeEmptyVars: [variables_enum_1.VariablesPGREnum.HAS_EMERGENCY],
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.ITERABLE_EMERGENCY_RISKS,
                    removeWithSomeEmptyVars: [variables_enum_1.VariablesPGREnum.HAS_EMERGENCY],
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: `A ??${variables_enum_1.VariablesPGREnum.COMPANY_SHORT_NAME}?? deverá divulgar e manter atualizado o Plano de Resposta a Emergência para todos os colaboradores da empresa.`,
                    removeWithSomeEmptyVars: [variables_enum_1.VariablesPGREnum.HAS_EMERGENCY],
                    addWithAllVars: [variables_enum_1.VariablesPGREnum.HAS_EMERGENCY_PLAN, variables_enum_1.VariablesPGREnum.IS_WORKSPACE_OWNER],
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: `A ??${variables_enum_1.VariablesPGREnum.COMPANY_SHORT_NAME}?? deverá elaborar o seu Plano de Resposta a Emergência, para saber qual conduta adotar, em casos de acidentes ou mal súbito de colaborador próprio, princípio de incêndio, ou outros eventos de consequências catastróficas.  Para isso, também será de fundamental importância, formar a sua Brigada de Emergência e promover simulados de abandono do local de trabalho, se for o caso.`,
                    removeWithSomeEmptyVars: [variables_enum_1.VariablesPGREnum.HAS_EMERGENCY],
                    addWithAllVars: [variables_enum_1.VariablesPGREnum.IS_WORKSPACE_OWNER],
                    removeWithAllValidVars: [variables_enum_1.VariablesPGREnum.HAS_EMERGENCY_PLAN],
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'O Plano de Atendimento à Emergência deve conter as definições de responsabilidade e ações para atender a uma emergência. Deverá analisar os riscos inerentes a cada ponto sensível levantado e deverá prever todas as ações a serem desenvolvidas para neutralizar ou minimizar as consequências de acidentes, proteger a vida humana, descontaminação e recuperação do meio ambiente e proteção da propriedade particular. É um documento desenvolvido com o intuito de treinar, organizar, orientar, facilitar, agilizar e uniformizar as ações necessárias às respostas de controle e combate às ocorrências anormais.',
                    removeWithSomeEmptyVars: [variables_enum_1.VariablesPGREnum.HAS_EMERGENCY],
                    addWithAllVars: [variables_enum_1.VariablesPGREnum.IS_WORKSPACE_OWNER],
                    removeWithAllValidVars: [variables_enum_1.VariablesPGREnum.HAS_EMERGENCY_PLAN],
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '**Quando executar as atividades em estabelecimento de terceiros**',
                    removeWithSomeEmptyVars: [variables_enum_1.VariablesPGREnum.HAS_EMERGENCY],
                    addWithAllVars: [variables_enum_1.VariablesPGREnum.IS_NOT_WORKSPACE_OWNER],
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: `A ??${variables_enum_1.VariablesPGREnum.COMPANY_SHORT_NAME}?? deverá ter acesso ao Plano de Resposta a Emergência da Empresa do condômino a qual pertence, para saber qual conduta adotar, em casos de acidentes ou mal súbito de colaborador próprio, princípio de incêndio, derramamento acidental de produtos químicos, ou outros eventos de consequências catastróficas.  Para isso, também será de fundamental importância participar ativamente da Brigada de Emergência e dos simulados de abandono do local de trabalho se houver.`,
                    removeWithSomeEmptyVars: [variables_enum_1.VariablesPGREnum.HAS_EMERGENCY],
                    addWithAllVars: [variables_enum_1.VariablesPGREnum.IS_NOT_WORKSPACE_OWNER],
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.ITERABLE_RECOMMENDATIONS,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H2,
                    text: 'Orientações Genéricas (Quando aplicável):',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'As orientações a seguir não se aplicam a nenhuma situação específica encontrada na empresa, são sugestões de boas práticas de gestão de Higiene Ocupacional, Saúde e Segurança do Trabalho, possuem caráter informativo. As situações específicas estão listadas acima e constam no Plano de Ação.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Revisar o PGR:** Reavaliar anualmente o PGR, conforme exigência legal prevista na NR-1, para avaliação do seu desenvolvimento, cumprimento das metas estabelecidas, ajustes necessários e estabelecimento de novas metas e prioridades.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Divulgação de Dados:** Programar reuniões de divulgação, tanto do desenvolvimento e resultados de avaliação dos riscos – PGR, quanto aos resultados dos exames periódicos – PCMSO, acompanhados pelo Setor Médico, fazendo a correlação pertinente.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Sinalização:** Melhorar a sinalização das áreas quanto às informações acerca dos Fatores de Riscos e Perigos presentes.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H3,
                    text: 'Treinamentos Prover treinamento sobre os seguintes aspectos (Quando aplicável):',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Saúde Ocupacional:** aspectos toxicológicos dos agentes, efeitos à saúde, primeiros socorros, divulgação de parâmetros de saúde ocupacional dos exames médicos periódicos, PCMSO;',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Segurança Industrial:** utilização de EPI’s, Ficha de Informação de Segurança dos Produtos e Resíduos, análise sobre melhores práticas/procedimentos de trabalho;',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Higiene Ocupacional:** PGR, PCA – Programa de Conservação Auditiva e PPR – Programa de Proteção Respiratória;',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Ergonomia:** Correção postural, levantamento de carga;',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Prevenção de Acidentes de Trânsito:** Direção defensiva para os condutores.',
                },
            ],
        },
    ],
};
//# sourceMappingURL=2.8-recommendations.js.map