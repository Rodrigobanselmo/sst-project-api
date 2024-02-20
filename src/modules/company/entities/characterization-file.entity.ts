import { CompanyCharacterizationFile } from '@prisma/client';

export class CharacterizationFileEntity implements CompanyCharacterizationFile {
  id: string;
  url: string | null;
  created_at: Date;
  deleted_at: Date;
  updated_at: Date;
  companyCharacterizationId: string;

  constructor(partial: Partial<CharacterizationFileEntity>) {
    Object.assign(this, partial);
  }
}
