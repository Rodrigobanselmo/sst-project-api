import { BorderStyle } from 'docx';
import { palette } from '../../../../../../shared/constants/palette';
import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import {
  IDocumentPGRSectionGroup,
  PGRSectionTypeEnum,
} from '../types/section.types';

export const initSection: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      type: PGRSectionTypeEnum.COVER,
    },
    {
      type: PGRSectionTypeEnum.TOC,
    },
    {
      type: PGRSectionTypeEnum.CHAPTER,
      text: `??${VariablesPGREnum.CHAPTER_1}??`,
    },
    {
      type: PGRSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_1}??`,
      children: [
        {
          type: PGRSectionChildrenTypeEnum.TITLE,
          text: `??${VariablesPGREnum.CHAPTER_1}??`,
        },
        {
          type: PGRSectionChildrenTypeEnum.H1,
          text: 'INTRODUÇÃO',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `O Documento Base do PGR tem como finalidade sintetizar todos os aspectos estruturais do programa e definir as diretrizes relativas ao gerenciamento dos riscos ambientais, que possam afetar a saúde e a integridade física dos trabalhadores da **??${VariablesPGREnum.COMPANY_SHORT_NAME}??**. e de suas Contratadas (NR-01 Item 1.5.1).`,
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'Objetivo',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'O PROGRAMA DE GERENCIAMENTO DE RISCO – PGR visa disciplinar os preceitos a serem observados na organização e no ambiente de trabalho, de forma a tornar compatível o planejamento e o desenvolvimento da atividade da empresa com a busca permanente da segurança e saúde dos trabalhadores em consonância com a NR-01 Subitem 1.5 Gerenciamento de Riscos Ocupacionais (GRO) em cumprimento ao determinado no subitem 1.5.3.1.1 que institui o PGR como ferramenta de Gerenciamento de Riscos Ocupacionais.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'O PGR deve:',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          level: 0,
          text: 'Contemplar Riscos Físicos, Químicos, Biológicos, de Acidentes e Ergonômicos;',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          level: 0,
          text: 'Providências quanto à eliminação ou minimização na maior extensão possível dos riscos ambientais;',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          level: 0,
          text: 'Inspeções periódicas para identificar, avaliar e controlar os riscos à saúde e segurança;',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          level: 0,
          text: 'Incluir a participação dos colaboradores no reconhecimento dos riscos e proposição de medidas preventivas;',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          level: 0,
          text: 'Acionar de forma imediata e completa de todo acidente ou doença ocupacional para encontrar a causa e corrigir o problema de forma a evitar a reincidência (NR-01 Item 1.4.1, Alínea e).',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Esse programa é parte integrante do GRO (Gerenciamento de Riscos Ocupacionais) e está articulado com todas as Normas Regulamentadoras instituídas pela Portaria MTb n° 3.214, de 08 de junho de 1978.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'O PGR não substitui os programas/ações listados a seguir, mas deve a pontar quando necessário do desenvolvimento dos mesmos:',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          level: 0,
          text: 'Programa de Treinamento para todos os empregados e contratados em boas práticas de saúde, segurança e preservação ambiental – INFORMAÇÃO, QUALIFICAÇÃO E TREINAMENTO (NR-01 Item 1.4.4);',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          level: 0,
          text: 'Desenvolvimento de normas e procedimentos de saúde e segurança e a exigência de que os colaboradores cooperem no cumprimento das mesmas;',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          level: 0,
          text: 'CONTROLE DE ATMOSFERAS EXPLOSIVA – Quando Aplicável; (NR-22 Item 22.3.7 alíneas b);',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          level: 0,
          text: 'CONTROLE DA DEFICIÊNCIA DE OXIGÊNIO – Quando Aplicável; (NR-22 Item 22.3.7 alíneas c);',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          level: 0,
          text: 'CONTROLE DA VENTILAÇÃO – Quando Aplicável; (NR-22 Item 22.3.7 alíneas d);',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          level: 0,
          text: 'PROGRAMA DE PROTEÇÃO RESPIRATÓRIA – Quando Aplicável; (A Instrução Normativa – IN No 1 da Secretaria de Segurança e Saúde no Trabalho, datada de 11 de abril de 1994);',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          level: 0,
          text: 'INVESTIGAÇÃO E ANÁLISE DE ACIDENTES DO TRABALHO – Quando Aplicável (NR-01 Item 1.4.1, Alínea e);',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          level: 0,
          text: 'AET – ANÁLISE ERGONÔMICA DO TRABALHO – NR 17 – Quando Aplicável (NR-01 Item 1.5.3.2.1);',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          level: 0,
          text: 'RISCOS DECORRENTES DO TRABALHO EM ALTURA – NR 35 – Quando Aplicável; (NR-22 Item 22.3.7alíneas h);',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          level: 0,
          text: 'RISCOS DECORRENTES DO TRABALHO EM PROFUNDIDADE E EM ESPAÇOS CONFINADOS NR 33 – Quando Aplicável; (NR-22 Item 22.3.7 alíneas h);',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          level: 0,
          text: 'RISCOS DECORRENTES DA UTILIZAÇÃO DE ENERGIA ELÉTRICA NR 10 – Quando Aplicável; (NR-22 Item 22.3.7 alíneas i);',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          level: 0,
          text: 'RISCOS DECORRENTES DE MÁQUINAS E EQUIPAMENTOS (NR-12) – Quando Aplicável; (NR-22 Item 22.3.7 alíneas i);',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          level: 0,
          text: 'RISCOS DECORRENTES DE VEÍCULOS – Quando Aplicável; (NR-22 Item 22.3.7 alíneas i);',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          level: 0,
          text: 'EPI’s (NR-06)',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          level: 0,
          text: 'ESTABILIDADE DO MACIÇO (NR-22) – Quando Aplicável; (NR-22 Item 22.3.7 alíneas l);',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          level: 0,
          text: 'PLANO DE ATENDIMENTO E RESPOSTA A EMERGÊNCIAS (NR-01 Item 1.5.6.);',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          level: 0,
          text: 'SINALIZAÇÃO DE ÁREA DE TRABALHO E DE CIRCULAÇÃO – Quando Aplicável; (NR-22 Item 22.19);',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          level: 0,
          text: 'PLANO DE TRÂNSITO – Quando Aplicável; (NR-22 Item 22.7.1);',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          level: 0,
          text: 'GESTÃO DE MUDANÇAS.',
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'Identificação da Empresa',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `**Razão Social**: ??${VariablesPGREnum.COMPANY_NAME}??`,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `**Endereço**: ??${VariablesPGREnum.COMPANY_STREET}??, ??${VariablesPGREnum.COMPANY_NUMBER}??, ??${VariablesPGREnum.COMPANY_NEIGHBOR}?? - ??${VariablesPGREnum.COMPANY_CITY}??/??${VariablesPGREnum.COMPANY_STATE}??, CEP: ??${VariablesPGREnum.COMPANY_CEP}??`,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `**TELEFONE**: ??${VariablesPGREnum.COMPANY_TELEPHONE}??`,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `**E-mail**: ??${VariablesPGREnum.COMPANY_EMAIL}??`,
          removeWithSomeEmptyVars: [VariablesPGREnum.COMPANY_EMAIL],
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `**CNPJ**: ??${VariablesPGREnum.COMPANY_CNPJ}??`,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `**Grau de Risco**: ??${VariablesPGREnum.COMPANY_RISK_DEGREE}??`,
          removeWithSomeEmptyVars: [VariablesPGREnum.COMPANY_RISK_DEGREE],
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `**CNAE**: ??${VariablesPGREnum.COMPANY_CNAE}??`,
          removeWithSomeEmptyVars: [VariablesPGREnum.COMPANY_CNAE],
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `**Horário de Funcionamento do Estabelecimento**: ??${VariablesPGREnum.COMPANY_WORK_TIME}??`,
          removeWithSomeEmptyVars: [VariablesPGREnum.COMPANY_WORK_TIME],
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'Abrangência',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'A critério da organização, o PGR pode ser implementado por unidade operacional, setor ou atividade. \n**(NR-01 Item 1.5.3.1.1.1)**',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `Este PGR compreende todo Estabelecimento inscrito no CNPJ: ??${VariablesPGREnum.WORKSPACE_CNPJ}??.`,
        },
        {
          type: PGRSectionChildrenTypeEnum.BREAK,
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'RESPONSÁVEIS PELA ELABORAÇÃO DO PGR',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `**??${VariablesPGREnum.CONSULTANT_NAME}??**`,
        },
        {
          type: PGRSectionChildrenTypeEnum.PROFESSIONAL,
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'REVISÕES DO DOCUMENTO',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
          text: 'Controle das Revisões do Documento',
        },
        {
          type: PGRSectionChildrenTypeEnum.TABLE_VERSION_CONTROL,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '',
          size: 8,
          spacing: { before: 0, after: 0, line: 50 },
          shading: { fill: palette.table.header.string },
          border: {
            right: {
              style: BorderStyle.SINGLE,
              size: 4,
              color: palette.common.white.string,
            },
            left: {
              style: BorderStyle.SINGLE,
              size: 4,
              color: palette.common.white.string,
            },
          },
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: ` VIGÊNCIA: ??${VariablesPGREnum.DOC_VALIDITY}??`,
          size: 8,
          spacing: { before: 0, after: 0, line: 300 },
          shading: { fill: palette.table.header.string },
        },
      ],
    },
  ],
};
