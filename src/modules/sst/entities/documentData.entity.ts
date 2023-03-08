import { ApiProperty } from '@nestjs/swagger';
import { StatusEnum } from '@prisma/client';

import { dayjs } from '../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { CompanyEntity } from '../../company/entities/company.entity';
import { ProfessionalEntity } from '../../users/entities/professional.entity';
import { DocumentModelEntity } from './../../documents/entities/document-model.entity';
import { ProfessionalDocumentDataEntity } from './usersRiskGroup';
import { DocumentData, DocumentTypeEnum, Prisma } from '.prisma/client';

export class DocumentDataEntity implements DocumentData {
  @ApiProperty({ description: 'The id of the risk group data' })
  id: string;

  @ApiProperty({ description: 'The name of the risk group data' })
  name: string;

  @ApiProperty({ description: 'The company id related to the risk group data' })
  companyId: string;

  @ApiProperty({
    description: 'The current status of the risk group data',
    examples: ['ACTIVE', 'CANCELED'],
  })
  status: StatusEnum;

  @ApiProperty({ description: 'The creation date of the risk group data' })
  created_at: Date;

  @ApiProperty({
    description: 'The array with risks data',
  })
  workspaceId: string;

  elaboratedBy: string;
  coordinatorBy: string;
  revisionBy: string;
  approvedBy: string;

  validity: string;
  validityStart: Date;
  validityEnd: Date;

  type: DocumentTypeEnum;
  json: Prisma.JsonValue;

  company?: Partial<CompanyEntity>;
  professionals?: ProfessionalEntity[];
  professionalsSignatures?: ProfessionalDocumentDataEntity[];
  modelId: number;
  model: DocumentModelEntity;

  constructor(partial: Partial<DocumentDataEntity>) {
    Object.assign(this, partial);

    if (!this?.professionals) this.professionals = [];
    if (partial?.professionalsSignatures) {
      this.professionalsSignatures = partial.professionalsSignatures.map((professionalSig) => new ProfessionalDocumentDataEntity(professionalSig));

      this.professionals = this.professionalsSignatures.map(
        ({ professional, ...rest }) =>
          new ProfessionalEntity({
            ...professional,
            professionalDocumentDataSignature: rest,
          }),
      );
    }

    if (this.validityStart && this.validityEnd) {
      this.validity = dayjs(this.validityStart).format('MM/YYYY') + ' a ' + dayjs(this.validityEnd).format('MM/YYYY');
    }
  }
}
