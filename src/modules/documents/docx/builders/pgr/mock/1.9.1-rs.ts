import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import {
  IDocumentPGRSectionGroup,
  PGRSectionTypeEnum,
} from '../types/section.types';

export const rs: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      type: PGRSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_1}??`,
      removeWithSomeEmptyVars: [VariablesPGREnum.IS_RS],
      children: [
        {
          type: PGRSectionChildrenTypeEnum.H4,
          text: 'Comunicação e Registro do Acidente de Trabalho – SES-RS',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'A Secretaria Estadual da Saúde do Rio Grande do Sul – SES-RS – através do Decreto 40.222/2000, implantou o Sistema de Informação em Saúde do Trabalhador – SIST/RS – com o objetivo de estabelecer a notifica- ção compulsória de todos os acidentes e doenças relacionadas ao trabalho no Rio Grande do Sul. Para viabilizar o fluxo de informação das notificações foram elaborados os formulários em papel do RINA (Re- latório Individual de Notificação de Agravos) e uma base de dados em EPINFO onde estes formulários em papel deveriam ser digitados. Agora o Sistema de Informação em Saúde do Trabalhador avançou, já se encontra disponível a notificação pela rede de Internet. O endereço é <link>http://www.sist.saude.rs.gov.br|www.sist.saude.rs.gov.br<link>.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Para a formalização da comunicação e registro, bem como da investigação do Acidente de Trabalho, poderá ser utilizado o modelo de formulário abaixo, customizado de acordo com as características da empresa:',
        },
        {
          type: PGRSectionChildrenTypeEnum.RS_IMAGE,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH_FIGURE,
          text: 'Exemplo de relatório de investigação de acidents',
        },
      ],
    },
  ],
};