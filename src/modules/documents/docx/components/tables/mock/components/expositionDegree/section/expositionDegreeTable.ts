import { Paragraph, Table } from 'docx';

import {
  ISectionChildrenType,
  DocumentSectionChildrenTypeEnum,
} from '../../../../../../builders/pgr/types/elements.types';
import { IDocVariables } from '../../../../../../builders/pgr/types/section.types';
import { expositionDegreeATable } from '../tables/expositionDegreeATable';
import { expositionDegreeBTable } from '../tables/expositionDegreeBTable';
import { expositionDegreeETable } from '../tables/expositionDegreeETable';
import { expositionDegreeFQTable } from '../tables/expositionDegreeFQTable';

export const expositionDegreeTable = (
  convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[],
) => {
  const table1 = convertToDocx([
    {
      type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE,
      text: 'Grau de Exposição dos Trabalhadores dos Fatores de Riscos Químicos & Físicos (Probabilidade)',
    },
    {
      type: DocumentSectionChildrenTypeEnum.LEGEND,
      text: '**Fonte:** [AIHA - A Strategy for Assessing and Managing Occupational Exposures, 2015]; NHO-01; NHO-06; NHO-09; NHO-10; [JMV GOBAL - Adaptado: NR 03 - Embargo e Interdição; NRB 31000/2018; NBR 31010/2012; NBR 12100/2014; ISO 45001/2018; NBR 14153/2014; SCIS DNV; HRN;]',
    },
  ]);

  const table2 = convertToDocx([
    {
      type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE,
      text: 'Grau de Exposição dos Trabalhadores dos Fatores de Riscos Biológicos (Probabilidade)',
    },
    {
      type: DocumentSectionChildrenTypeEnum.LEGEND,
      text: '**Fonte:** [JMV Global – Biológicos]',
    },
  ]);

  const table3 = convertToDocx([
    {
      type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE,
      text: 'Grau de Exposição dos Trabalhadores aos Fatores de Riscos Ergonômicos (Probabilidade)',
    },
    {
      type: DocumentSectionChildrenTypeEnum.LEGEND,
      text: '**Fonte:** [JMV GLOBAL Ergonômicos]',
    },
  ]);

  const table4 = convertToDocx([
    {
      type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE,
      text: 'Grau de Exposição dos Trabalhadores Perigos ou Fatores de Riscos de Acidentes (Probabilidade)',
    },
    {
      type: DocumentSectionChildrenTypeEnum.LEGEND,
      text: '**Fonte:** [JMV Global – Acidentes]	',
    },
    {
      type: DocumentSectionChildrenTypeEnum.LEGEND,
      text: '**Obs.:** Para análise de acidentes pode ser necessário se adotar critérios e metodologias específicas para melhor adequar ao cenário de risco **(NR-01 item 1.5.3.4.4.2.1)**.',
    },
  ]);

  table1.splice(1, 0, expositionDegreeFQTable());
  table2.splice(1, 0, expositionDegreeBTable());
  table3.splice(1, 0, expositionDegreeETable());
  table4.splice(1, 0, expositionDegreeATable());

  return [...table1, ...table2, ...table3, ...table4];
};
