import { WorkspaceEntity } from './../../../../../company/entities/workspace.entity';
import { AlignmentType, Paragraph, Table, WidthType } from 'docx';
import { arrayChunks } from '../../../../../../shared/utils/arrayChunks';

import { ProfessionalEntity } from '../../../../../users/entities/professional.entity';
import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { ISectionChildrenType } from '../../../../../../domain/types/elements.types';
import { DocumentSectionChildrenTypeEnum } from '@/@v2/documents/domain/types/DocumentSectionChildrenTypeEnum';
import { IDocVariables } from '../../../../../../domain/types/section.types';
import { UserEntity } from './../../../../../users/entities/user.entity';
import { TableBodyElements } from './elements/body';
import { SignaturesConverter } from './signatures.converter';

export const signaturesIterable = (
  signatureEntity: (ProfessionalEntity | UserEntity)[],
  workspace: WorkspaceEntity,
  convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[],
) => {
  if (!signatureEntity?.length) return [];

  const signaturesVariablesArray = SignaturesConverter(signatureEntity, workspace);

  const iterableSections = signaturesVariablesArray.map((variables) => {
    const credentials = [] as string[];

    if (variables[VariablesPGREnum.PROFESSIONAL_NAME])
      credentials.push(`**??${VariablesPGREnum.PROFESSIONAL_NAME}??**`);

    if (variables[VariablesPGREnum.PROFESSIONAL_FORMATION])
      credentials.push(`??${VariablesPGREnum.PROFESSIONAL_FORMATION}??`);

    if (variables[VariablesPGREnum.PROFESSIONAL_CREA]) credentials.push(`??${VariablesPGREnum.PROFESSIONAL_CREA}??`);

    if (variables[VariablesPGREnum.PROFESSIONAL_CPF])
      credentials.push(`CPF: ${variables[VariablesPGREnum.PROFESSIONAL_CPF]}`);

    // if (variables[VariablesPGREnum.PROFESSIONAL_CERTIFICATIONS]) text = `${text}${variables[VariablesPGREnum.PROFESSIONAL_CERTIFICATIONS]}`
    return convertToDocx(
      [
        ...credentials.map<ISectionChildrenType>((credential) => ({
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
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
  };

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableBodyElements.tableRow([marginParagraph]),
      ...iterableSectionsChunks.map((dataChuck) => tableBodyElements.tableRow([...getRows(dataChuck)])),
    ],
  });

  return [table];
};
