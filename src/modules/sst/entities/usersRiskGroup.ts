import { ProfessionalEntity } from '../../users/entities/professional.entity';
import { DocumentDataToProfessional } from '@prisma/client';

import { UserEntity } from '../../users/entities/user.entity';

export class ProfessionalDocumentDataEntity implements DocumentDataToProfessional {
  documentDataId: string;
  professionalId: number;
  isSigner: boolean;
  isElaborator: boolean;
  professional?: ProfessionalEntity;
  constructor(partial: Partial<ProfessionalDocumentDataEntity>) {
    Object.assign(this, partial);
  }
}
