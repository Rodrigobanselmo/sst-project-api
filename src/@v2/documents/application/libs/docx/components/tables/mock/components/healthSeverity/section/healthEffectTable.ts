import { Paragraph, Table } from 'docx';

import {
  ISectionChildrenType,
} from '../../../../../../../../../domain/types/elements.types';
import { DocumentSectionChildrenTypeEnum } from '@/@v2/documents/domain/types/DocumentSectionChildrenTypeEnum';
import { IDocVariables } from '../../../../../../../../../domain/types/section.types';
import { healthSeverityAciTable } from '../tables/healthSeverityATable';
import { healthSeverityBioTable } from '../tables/healthSeverityBTable';
import { healthSeverityErgTable } from '../tables/healthSeverityETable';
import { healthSeverityFisQuiTable } from '../tables/healthSeverityFQTable';

export const healthEffectTable = (
  convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[],
) => {
  const table1 = convertToDocx([
    {
      type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE,
      text: 'Grau de Efeito à Saúde dos Fatores de Risco Químicos & Físicos – (Severidade)',
    },
    {
      type: DocumentSectionChildrenTypeEnum.LEGEND,
      text: '**Fonte:** [AIHA – A Strategy for Assessing and Managing Occupational Exposures, 2015]; [JMV GOBAL - Adaptado:  NR 03 - Embargo e Interdição; NRB 31000/2018; NBR 31010/2012; NBR 12100/2014; ISO 45001/2018; NBR 14153/2014; SCIS DNV; HRN;]',
    },
  ]);

  const table2 = convertToDocx([
    {
      type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE,
      text: 'Grau de Efeito à Saúde dos Fatores de Risco Biológicos – (Severidade)',
    },
    {
      type: DocumentSectionChildrenTypeEnum.LEGEND,
      text: '**Fonte:** [AIHA – A Strategy for Assessing and Managing Occupational Exposures, 2015]; [JMVGLOBAL - Biológicos]',
    },
  ]);

  const table3 = convertToDocx([
    {
      type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE,
      text: 'Grau de Efeito à Saúde dos Fatores de Risco Ergonômicos (Severidade)',
    },
    {
      type: DocumentSectionChildrenTypeEnum.LEGEND,
      text: '**Fonte:** [JMV GLOBAL Ergonômicos]',
    },
  ]);

  const table4 = convertToDocx([
    {
      type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE,
      text: 'Grau de Efeito à Saúde dos Fatores de Risco Acidentes (Severidade)',
    },
    {
      type: DocumentSectionChildrenTypeEnum.LEGEND,
      text: '**Fonte:** [JMV Global – Acidentes]	',
    },
  ]);

  table1.splice(1, 0, healthSeverityFisQuiTable());
  table2.splice(1, 0, healthSeverityBioTable());
  table3.splice(1, 0, healthSeverityErgTable());
  table4.splice(1, 0, healthSeverityAciTable());

  return [...table1, ...table2, ...table3, ...table4];
};
