import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import {
  IDocumentPGRSectionGroup,
  PGRSectionTypeEnum,
} from '../types/section.types';

//* document example (TOXILAB) form page 12 to 30

export const organizationSection: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      type: PGRSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_1}??`,
      children: [
        {
          type: PGRSectionChildrenTypeEnum.H1,
          text: 'POLÍTICA DE SAÚDE E SEGURANÇA OCUPACIONAL',
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'Atribuições e Responsabilidades (NR-01 item 1.5.3)',
        },
        {
          type: PGRSectionChildrenTypeEnum.H3,
          text: `Responsável Legal da Empresa (Responsável pelo PGR) – ??${VariablesPGREnum.COMPANY_RESPONSIBLE}??`,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Assegurar a implantação do PGR **(NR-01 item 1.5.3.1.);**',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Indicar o Coordenador Geral do PGR;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Estabelecer, implementar e assegurar o cumprimento do PGR, como atividade permanente da empresa no gerenciamento dos riscos ambientais **(NR-01 item 1.5.1.);**',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Garantir que os trabalhadores possam interromper suas tarefas sempre que constatar evidências que representem riscos graves e iminentes para sua segurança e saúde ou de terceiros, comunicando imediatamente o fato a seu superior hierárquico que diligenciará as medidas cabíveis **(NR-01 item 1.4.3);**',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Comunicar aos trabalhadores sobre os riscos consolidados no inventário de riscos e as medidas de prevenção do plano de ação do PGR **(NR-01 item 1.5.3.3 alínea b);**',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Manter disponíveis os recursos financeiros para a execução das atividades deste programa sejam por recursos próprios ou de terceiros;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Manter disponíveis os recursos financeiros para a execução das atividades deste programa sejam por recursos próprios ou de terceiros;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Aprovar o PGR encaminhado através da Coordenação de Segurança, Higiene e Meio Ambiente.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.H3,
          text: `Coordenador Geral do Programa – ??${VariablesPGREnum.DOCUMENT_COORDINATOR}??`,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Coordenar a implantação e desenvolvimento do PGR;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Promover reuniões periódicas de Coordenação do PGR',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Rever informações sobre o controle do programa;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Delegar responsabilidade e autoridade;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Coordenar a implementação das medidas relativas à segurança e saúde dos trabalhadores da empresa e das empresas contratadas, integrando-as com as demais Normas Regulamentadoras;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Supervisionar os trabalhadores para assegurar que os procedimentos corretos de trabalho estão sendo observados;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Supervisionar os trabalhadores para assegurar que os procedimentos corretos de trabalho estão sendo observados;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Comunicar informações sobre os riscos ambientais e procedimentos de controle adotados;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Consultar os trabalhadores sobre questões de segurança e saúde e orientá-los quando necessário;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Consultar os trabalhadores sobre questões de segurança e saúde e orientá-los quando necessário;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Colaborar com a CIPA na investigação de acidentes ou doenças e na adoção de medidas preventivas;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Solicitar a atualização do PGR de demais planos sempre que houver necessidade;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Elaborar os orçamentos anuais do Programa, alocando recursos financeiros necessários à execução do Plano de Ação Anual;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Gerar indicadores e acompanhar o desempenho do PGR e da SSO como um todo.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.H3,
          text: `Contratadas (NR-01 item 1.5.8)`,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Sempre que várias organizações realizem, simultaneamente, atividades no mesmo local de trabalho devem executar ações integradas para aplicar as medidas de prevenção, visando à proteção de todos os trabalhadores expostos aos riscos ocupacionais **(NR-01 item 1.5.8.1).**',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'O PGR da empresa contratante poderá incluir as medidas de prevenção para as empresas contratadas para prestação de serviços que atuem em suas dependências ou local previamente convencionado em contrato ou referenciar os programas das contratadas **(NR-01 item 1.5.8.2).**',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'A EMPRESA CONTRATANTE coordenará a implementação das medidas relativas à segurança e saúde dos trabalhadores das empresas contratadas e proverá os meios e condições para que estas atuem em conformidade com esta Norma. A EMPRESA CONTRATANTE deve:',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Fornecer às contratadas informações sobre os riscos ocupacionais sob sua gestão e que possam impactar nas atividades das contratadas (NR-01 item 1.5.8.3).',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Cabe as empresas contratadas dá a sua contrapartida promovendo as seguintes ações:',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Fornecer ao contratante o Inventário de Riscos Ocupacionais específicos de suas atividades que são realizadas nas dependências da contratante ou local previamente convencionado em contrato (NR-01 item 1.5.8.4).',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Supervisionar os trabalhadores para assegurar que os procedimentos corretos de trabalho estão sendo observados;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Participar das reuniões de Coordenação do PGR quando convocados;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Assegurar que os equipamentos e máquinas estão em perfeito estado de funcionamento;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Garantir ordem e limpeza em seus setores/áreas de trabalho;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Comunicar informações sobre os riscos ambientais e procedimentos de controle adotados;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Consultar os trabalhadores sobre questões de segurança e saúde e orientá-los quando necessário;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Manter a área de Segurança/Higiene informada das questões de segurança e saúde dos seus setores/áreas;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Colaborar com a CIPA na investigação de acidentes ou doenças e na adoção de medidas preventivas.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.H3,
          text: `Coordenação de Segurança Industrial (Quando Não Houver Caberá ao Coordenador do PGR)`,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Manter toda documentação relativa ao programa;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Assegurar que todos os trabalhadores recebam treinamento adequado para as funções que desempenham ou venham desempenhar, relativos ao escopo do PGR;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Manter a integridade dos equipamentos de Segurança e Higiene Ocupacional no que se refere à manutenção, calibração e guarda (Estes serviços podem ser terceirizados, neste caso é necessário auditar os consultores);',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Prever os recursos financeiros para a execução das atividades deste programa sejam por recursos próprios ou de terceiros;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Divulgar os dados e resultados relativos ao programa.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.H3,
          text: `Trabalhadores (colaboradores e contratados – agentes do PGR) (NR-01 item 1.4.2)`,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '• Colaborar e participar na implantação e execução do PGR – Zelar pela sua segurança e saúde ou de terceiros que possam ser afetados por suas ações ou omissões no trabalho, colaborando com a empresa para o cumprimento das disposições legais e regulamentares, inclusive das normas internas de segurança e saúde;',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Comunicar ao seu superior hierárquico ocorrências que, a seu julgamento, possam implicar em riscos à saúde dos trabalhadores **(NR-01 item 1.4.3)**;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Interromper suas tarefas sempre que constatar evidências que representem riscos graves e iminentes para sua segurança e saúde ou de terceiros, comunicando imediatamente o fato a seu superior hierárquico que diligenciará as medidas cabíveis **(NR-01 item 1.4.3);**',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Cumprir todas as orientações recebidas nos treinamentos oferecidos dentro do PGR;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Cooperar com a CIPA na prevenção de acidentes;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Cumprir as disposições legais e regulamentares sobre segurança e saúde no trabalho, inclusive as ordens de serviço expedidas pelo empregador **(NR-01 item 1.4.2 alínea a);**',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Submeter-se aos exames médicos previstos nas NR **(NR-01 item 1.4.2 alínea b);**',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Colaborar com a organização na aplicação das NR **(NR-01 item 1.4.2 alínea c);**',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Usar o equipamento de proteção individual fornecido pelo empregador. **(NR-01 item 1.4.2 alínea d);**',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Utilizar obrigatoriamente o Equipamento de Proteção Individual – EPI, onde sinalizado e quando julgar necessário **(NR-06 item 6.7.1 alínea a);**',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Constitui ato faltoso a recusa injustificada do empregado ao cumprimento do disposto nas alíneas a, b, c, e d da NR01. **(NR-01 item 1.4.2.1);**',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Informar-se sobre a implementação do PGR e os resultados das avaliações.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.H3,
          text: `CIPA – Titulares e Suplentes (Ou Designado) – Presidente`,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Acompanhar e avaliar o desempenho deste programa;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Zelar pelo cumprimento das medidas preventivas e corretivas;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Realizar as investigações de acidentes, incidentes e doenças ocupacionais;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Colaborar nas inspeções e fazer recomendações sobre segurança, higiene e saúde;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Manter em seus arquivos cópia atualizada do PGR, de forma a facilitar o acompanhamento do programa.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: `Integração`,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'O PGR deve contemplar ou estar integrado com planos, programas e outros documentos previstos na legislação de segurança e saúde no trabalho **(NR-01 item 1.5.3.1.3).**',
        },
        {
          type: PGRSectionChildrenTypeEnum.H3,
          text: `Integração Interna`,
        },
        {
          type: PGRSectionChildrenTypeEnum.H4,
          text: `Departamento Médico (NR-01 item 1.5.5.4.1)`,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Este documento é parte complementar de outros programas e ações na área de Segurança, Meio Ambiente e Saúde Ocupacional desenvolvidos na empresa, em particular o PCMSO – Programa de Controle Médico da Saúde Ocupacional, previsto na NR-07.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'O PGR articula-se com o PCMSO de modo a se complementarem, pois o PGR tem foco no ambiente de trabalho e o PCMSO tem foco na saúde do trabalhador.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Para tanto, os riscos ambientais identificados serão informados e discutidos com o Médico do Trabalho, a fim de otimizar o conjunto de exames e acompanhamentos necessários para a adequada avaliação da saúde dos trabalhadores.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Os principais desvios de saúde encontrados nos exames médicos periódicos, fornecerão indicações das prováveis áreas de risco mais críticas para a empresa. Deste modo maximiza-se o uso das informações disponíveis em prol de uma efetiva prevenção de ocorrência de desvios de saúde, através de um bem- sucedido controle de riscos ambientais **(NR-01 item 1.5.5.4.2).**',
        },
        {
          type: PGRSectionChildrenTypeEnum.H4,
          text: `Departamento Pessoal`,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'O PGR articula-se ainda com o Setor de Recursos Humanos, pois fornece informações relacionadas aos Fatores de Risco podendo indicar a necessidade de elaborar programas adicionais tais como:',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'LTCAT para os Agentes Nocivos (Ensejadores de Aposentadoria Especial) – Decreto 3048/99 INSS;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Laudo de Insalubridade para os Agentes Insalubres (Passíveis de Adicional de Insalubridade) NR-15 MTE',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Laudo de Periculosidade para os Agentes Periculosos (Passíveis de Adicional de Periculosidade) NR-16 MTE.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'É importante salientar que embora o PGR possa ser aceito como demonstração ambiental servindo de substituto de laudos como por exemplo, LTCAT e LIP este documento não foi elaborado com tal finalidade e não dispõem de todos os requisitos necessários para tal aplicação, pois o foco central é a gestão dos perigos e fatores de riscos a que os trabalhadores estão expostos, deixando os aspectos técnicos e legais relacionados a aposentadoria especial e pagamento de adicionais para os seus respectivos documentos.',
        },
        {
          type: PGRSectionChildrenTypeEnum.H4,
          text: `Participação dos Trabalhadores (CIPA) e Comunicação dos Riscos (NR-01 item 1.5.3.3 alínea a)`,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'A participação dos trabalhadores no processo de identificação de situações de risco e proposição de medidas de controle será garantida através do diálogo contínuo com seu Coordenador/Subcoordenadores do PGR, líderes de serviços, profissionais da Área de Segurança/Higiene e Meio Ambiente e membros da CIPA.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Na etapa de reconhecimento de riscos e priorização de ações será considerada a percepção de riscos dos trabalhadores, expressa nos Mapas de Riscos elaborados pelas CIPA, com a participação dos mesmos.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Cada trabalhador será informado dos riscos relacionados com suas atividades por ocasião de sua contratação e durante os treinamentos recebidos, bem como através de orientações de seus Líderes e atualizações periódicas do PGR.',
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: `Integração Externa`,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'O PGR, além de cumprir com um requisito legal, está disponível para os órgãos fiscalizadores, para o representante dos empregados e para o sindicato.',
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: `Informação, Qualificação e Treinamento (NR-01 item 1.7)`,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `A ??${VariablesPGREnum.COMPANY_SHORT_NAME}??. deve proporcionar aos trabalhadores treinamento, qualificação, informações, instruções e reciclagem necessárias para preservação da sua segurança e saúde, levando-se em consideração o Grau de Risco e a natureza das operações (NR-01 item 1.7.1).`,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `A ??${VariablesPGREnum.COMPANY_SHORT_NAME}??. deverá Desenvolver um Programa de Treinamento, com reciclagem anual e aplicação de teste para validação do aprendizado, abordando pelo menos os seguintes temas:`,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**PGR:**',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Aspectos Legais;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Política de Saúde, Segurança e Meio Ambiente;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Objetivos do PGR;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Atribuições e Responsabilidades;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Caracterização do Ambiente de Trabalho;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Caracterização da Mão de Obra;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Caracterização dos Fatores de Risco;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Grupos Similares de Exposição;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Avaliação Qualitativa/Quantitativa de Riscos;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: "Priorização de Riscos e GHE's;",
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Plano de Metas Anual.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Programa de Conservação Auditiva – PCA (Quando Identificado Ruído Acima do NA)**',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Conceitos Básicos Sobre Ruído;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Efeitos do Ruído e Limite de Tolerância;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Objetivos do PCA;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Atribuições e Responsabilidades;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Monitoramento Ambiental – Mapas de Ruído;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Monitoramento Pessoal – Dosimetrias;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Protetores Auriculares;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Avaliação Audiológica;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Auditorias;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: `Ações da ??${VariablesPGREnum.COMPANY_SHORT_NAME}??. no Controle de Ruído.`,
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Programa de Proteção Respiratória – PPR (Quando Identificado Riscos Químicos com FPMR4 > 1 ou seja Menor que o LEO)**',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Conceitos Básicos sobre Agentes Químicos;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Efeitos dos Agentes Químicos e Limite de Tolerância;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Objetivos do PPR;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Atribuições e Responsabilidades;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Monitoramento Ambiental – TLV-TWA (8 horas);',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Monitoramento Pessoal – TLV-TWA (8 horas);',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Monitoramento de Curta Duração – STEL (15 minutos);',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Monitoramento Pessoal – Valor Teto (Instantâneo);',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Ensaio de Vedação',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Protetores Respiratórios;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Investigação de Doenças Ocupacionais Respiratória;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Auditorias;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: `Ações da ??${VariablesPGREnum.COMPANY_SHORT_NAME}??. no controle de agentes químicos.`,
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Para a concentração mais crítica de exposição prevista, caso contrário o FPMR para dispensa do PPR deve ser < 0,1 (10% do LEO – Risco Ocupacional Muito Baixo).',
          size: 8,
        },
      ],
    },
  ],
};