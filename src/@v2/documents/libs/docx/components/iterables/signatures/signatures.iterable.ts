import { AlignmentType, Paragraph, Table, WidthType } from 'docx';

import { DocumentChildrenTypeEnum } from '@/@v2/documents/domain/enums/document-children-type.enum';
import { ProfessionalSignatureModel } from '@/@v2/documents/domain/models/professional-signature.model';
import { arrayChunks } from '@/@v2/shared/utils/helpers/array-chunks';
import { ISectionChildrenType } from '../../../../../domain/types/elements.types';
import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { IDocVariables } from '../../../builders/pgr/types/documet-section-groups.types';
import { TableBodyElements } from './elements/body';
import { SignaturesConverter } from './signatures.converter';

export const signaturesIterable = (signatureEntity: ProfessionalSignatureModel[], convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[]) => {
  if (!signatureEntity?.length) return [];

  const signaturesVariablesArray = SignaturesConverter(signatureEntity);

  const iterableSections = signaturesVariablesArray.map((variables) => {
    const credentials = [] as string[];

    if (variables[VariablesPGREnum.PROFESSIONAL_NAME]) credentials.push(`**??${VariablesPGREnum.PROFESSIONAL_NAME}??**`);

    if (variables[VariablesPGREnum.PROFESSIONAL_FORMATION]) credentials.push(`??${VariablesPGREnum.PROFESSIONAL_FORMATION}??`);

    if (variables[VariablesPGREnum.PROFESSIONAL_CREA]) credentials.push(`??${VariablesPGREnum.PROFESSIONAL_CREA}??`);

    if (variables[VariablesPGREnum.PROFESSIONAL_CPF]) credentials.push(`CPF: ${variables[VariablesPGREnum.PROFESSIONAL_CPF]}`);

    // if (variables[VariablesPGREnum.PROFESSIONAL_CERTIFICATIONS]) text = `${text}${variables[VariablesPGREnum.PROFESSIONAL_CERTIFICATIONS]}`
    return convertToDocx(
      [
        ...credentials.map<ISectionChildrenType>((credential) => ({
          type: DocumentChildrenTypeEnum.PARAGRAPH,
          text: credential,
          align: AlignmentType.CENTER,
          spacing: { after: 0, before: 0 },
          size: 8,
        })),
      ],
      variables,
    );
  });

  const tableBodyElements = new TableBodyElements();

  const iterableSectionsChunks = arrayChunks(iterableSections, 3, {
    balanced: true,
  });

  const emptyParagraph = tableBodyElements.tableCell({
    data: [new Paragraph({})],
    empty: true,
  });

  const marginParagraph = tableBodyElements.tableCell({
    data: [new Paragraph({})],
    empty: true,
    width: { size: 5, type: WidthType.PERCENTAGE },
  });

  const getRows = (dataChuck: (Paragraph | Table)[][]) => {
    if (dataChuck.length == 0) {
      return [
        emptyParagraph,
        tableBodyElements.tableCell({
          data: [new Paragraph({ text: 'NOME DO ASSINANTE' })],
        }),
        emptyParagraph,
      ];
    }

    if (dataChuck.length == 1) {
      return [emptyParagraph, tableBodyElements.tableCell({ data: dataChuck[0] as Paragraph[] }), emptyParagraph];
    }
    if (dataChuck.length == 2) {
      return [
        marginParagraph,
        tableBodyElements.tableCell({ data: dataChuck[0] as Paragraph[] }),
        marginParagraph,
        tableBodyElements.tableCell({ data: dataChuck[1] as Paragraph[] }),
        marginParagraph,
      ];
    }
    if (dataChuck.length == 3) {
      return [
        marginParagraph,
        tableBodyElements.tableCell({ data: dataChuck[0] as Paragraph[] }),
        marginParagraph,
        tableBodyElements.tableCell({ data: dataChuck[1] as Paragraph[] }),
        marginParagraph,
        tableBodyElements.tableCell({ data: dataChuck[2] as Paragraph[] }),
        marginParagraph,
      ];
    }

    return [];
  };

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [tableBodyElements.tableRow([marginParagraph]), ...iterableSectionsChunks.map((dataChuck) => tableBodyElements.tableRow([...getRows(dataChuck)]))],
  });

  return [table];
};
