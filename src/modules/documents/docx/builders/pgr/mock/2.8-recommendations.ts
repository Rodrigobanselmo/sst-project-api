import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import { IDocumentPGRSectionGroup, PGRSectionTypeEnum } from '../types/section.types';

export const recommendationsSection: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      type: PGRSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_3}??`,
      children: [
        {
          type: PGRSectionChildrenTypeEnum.H1,
          text: 'RECOMENDAÇÕES (NR-01 ‘item’ 1.5.3.4)',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `Os itens a seguir, foram compilados do Plano de Ação, onde encontra-se os fatores de risco e perigos incluindo as fontes geradoras e Cargos/GSE's expostos e demais informações que justificam as recomendações abaixo`,
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'Monitoramento (Quando aplicável)',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `A **??${VariablesPGREnum.COMPANY_SHORT_NAME}??** deve dar início a uma estratégia de avaliação quantitativa para os Fatores de Risco físicos e químicos priorizados. Portanto recomenda-se:`,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Elaborar/Revisar** o Programa de Monitoramento e Controle Ambiental de Agentes Químicos e Físicos com base na planilha de priorização e Plano de Ação deste PGR.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'Plano de Atendimento a Emergência',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_EMERGENCY],
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Aplicável devido a caracterização dos perigos listados a seguir:**',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_EMERGENCY],
        },
        {
          type: PGRSectionChildrenTypeEnum.ITERABLE_EMERGENCY_RISKS,
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_EMERGENCY],
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `A ??${VariablesPGREnum.COMPANY_SHORT_NAME}?? deverá divulgar e manter atualizado o Plano de Resposta a Emergência para todos os colaboradores da empresa.`,
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_EMERGENCY],
          addWithAllVars: [VariablesPGREnum.HAS_EMERGENCY_PLAN, VariablesPGREnum.IS_WORKSPACE_OWNER],
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `A ??${VariablesPGREnum.COMPANY_SHORT_NAME}?? deverá elaborar o seu Plano de Resposta a Emergência, para saber qual conduta adotar, em casos de acidentes ou mal súbito de colaborador próprio, princípio de incêndio, ou outros eventos de consequências catastróficas.  Para isso, também será de fundamental importância, formar a sua Brigada de Emergência e promover simulados de abandono do local de trabalho, se for o caso.`,
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_EMERGENCY],
          addWithAllVars: [VariablesPGREnum.IS_WORKSPACE_OWNER],
          removeWithAllValidVars: [VariablesPGREnum.HAS_EMERGENCY_PLAN],
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'O Plano de Atendimento à Emergência deve conter as definições de responsabilidade e ações para atender a uma emergência. Deverá analisar os riscos inerentes a cada ponto sensível levantado e deverá prever todas as ações a serem desenvolvidas para neutralizar ou minimizar as consequências de acidentes, proteger a vida humana, descontaminação e recuperação do meio ambiente e proteção da propriedade particular. É um documento desenvolvido com o intuito de treinar, organizar, orientar, facilitar, agilizar e uniformizar as ações necessárias às respostas de controle e combate às ocorrências anormais.',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_EMERGENCY],
          addWithAllVars: [VariablesPGREnum.IS_WORKSPACE_OWNER],
          removeWithAllValidVars: [VariablesPGREnum.HAS_EMERGENCY_PLAN],
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Quando executar as atividades em estabelecimento de terceiros**',
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_EMERGENCY],
          addWithAllVars: [VariablesPGREnum.IS_NOT_WORKSPACE_OWNER],
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `A ??${VariablesPGREnum.COMPANY_SHORT_NAME}?? deverá ter acesso ao Plano de Resposta a Emergência da Empresa do condômino a qual pertence, para saber qual conduta adotar, em casos de acidentes ou mal súbito de colaborador próprio, princípio de incêndio, derramamento acidental de produtos químicos, ou outros eventos de consequências catastróficas.  Para isso, também será de fundamental importância participar ativamente da Brigada de Emergência e dos simulados de abandono do local de trabalho se houver.`,
          removeWithSomeEmptyVars: [VariablesPGREnum.HAS_EMERGENCY],
          addWithAllVars: [VariablesPGREnum.IS_NOT_WORKSPACE_OWNER],
        },
        {
          type: PGRSectionChildrenTypeEnum.ITERABLE_RECOMMENDATIONS,
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'Orientações Genéricas (Quando aplicável):',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'As orientações a seguir não se aplicam a nenhuma situação específica encontrada na empresa, são sugestões de boas práticas de gestão de Higiene Ocupacional, Saúde e Segurança do Trabalho, possuem caráter informativo. As situações específicas estão listadas acima e constam no Plano de Ação.',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Revisar o PGR:** Reavaliar anualmente o PGR, conforme exigência legal prevista na NR-1, para avaliação do seu desenvolvimento, cumprimento das metas estabelecidas, ajustes necessários e estabelecimento de novas metas e prioridades.',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Divulgação de Dados:** Programar reuniões de divulgação, tanto do desenvolvimento e resultados de avaliação dos riscos – PGR, quanto aos resultados dos exames periódicos – PCMSO, acompanhados pelo Setor Médico, fazendo a correlação pertinente.',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Sinalização:** Melhorar a sinalização das áreas quanto às informações acerca dos Fatores de Riscos e Perigos presentes.',
        },
        {
          type: PGRSectionChildrenTypeEnum.H3,
          text: 'Treinamentos Prover treinamento sobre os seguintes aspectos (Quando aplicável):',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Saúde Ocupacional:** aspectos toxicológicos dos agentes, efeitos à saúde, primeiros socorros, divulgação de parâmetros de saúde ocupacional dos exames médicos periódicos, PCMSO;',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Segurança Industrial:** utilização de EPI’s, Ficha de Informação de Segurança dos Produtos e Resíduos, análise sobre melhores práticas/procedimentos de trabalho;',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Higiene Ocupacional:** PGR, PCA – Programa de Conservação Auditiva e PPR – Programa de Proteção Respiratória;',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Ergonomia:** Correção postural, levantamento de carga;',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Prevenção de Acidentes de Trânsito:** Direção defensiva para os condutores.',
        },
      ],
    },
  ],
};
