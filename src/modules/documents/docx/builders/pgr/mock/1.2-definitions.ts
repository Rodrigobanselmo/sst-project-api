import { AlignmentType } from 'docx';
import { VariablesPGREnum } from '../enums/variables.enum';
import { DocumentSectionChildrenTypeEnum } from '../types/elements.types';
import { IDocumentPGRSectionGroup, DocumentSectionTypeEnum } from '../types/section.types';

export const definitions2Section: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      type: DocumentSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_1}??`,
      children: [
        {
          type: DocumentSectionChildrenTypeEnum.H2,
          text: '**Definição do Risco de Acidente**',
          // alignment: AlignmentType.CENTER,
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Para melhor clareza se faz necessário se decompor o conceito, sendo assim vamos para as definições de risco e acidentes separadamente:',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Risco:** Exposição de pessoas a perigos. O risco pode ser dimensionado em função da probabilidade e da gravidade do dano possível.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: '**(GUIA DE ANÁLISE ACIDENTES DE TRABALHO – MTE 2010)**',
          alignment: AlignmentType.END,
          size: 8,
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Acidente:**',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: '1) acontecimento casual, fortuito, inesperado; ocorrência',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: '2) qualquer acontecimento, desagradável ou infeliz, que envolva dano, perda, sofrimento ou morte.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: '**(Dicionário Versão 2.3.0 (268) Copyright © 2005–2020 Apple Inc. Todos os direitos reservados.)**',
          alignment: AlignmentType.END,
          size: 8,
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Vale ressaltar que a definição de acidente pode ser muito mais abrangente com diversos significados, mas iremos aqui restringi-lo as definições acima que se aplica adequadamente a uma de suas locuções: Acidente de Trabalho.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Sendo assim, segue a definição de Acidente de Trabalho:',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: '**ACIDENTE DE TRABALHO:** Ocorrência geralmente não planejada que resulta em dano à saúde ou integridade física de trabalhadores ou de indivíduos do publico. Exemplo: andaime cai sobre a perna de um trabalhador que sofre fratura da tíbia.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: '**(GUIA DE ANÁLISE ACIDENTES DE TRABALHO – MTE 2010).**',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'É importante destacar que o Acidente do Trabalho também tem outras definições mais abrangentes, principalmente quando se refere a legislação previdenciária, mas ao aplicá-la com caráter prevencionista e didático a definição acima é mais adequada.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Diante do apresentado podemos definir Risco de Acidente para efeito do PGR como:',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Risco de Acidente:** Ocorrência de qualquer evento que possa expor as pessoas (trabalhadores/público) a perigos independente da probabilidade de sua ocorrência e da magnitude dos seus possíveis danos. (Marins, Alex);',
        },
      ],
    },
  ],
};
