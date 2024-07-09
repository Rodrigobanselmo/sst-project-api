import { GenerateSource } from '.prisma/client';
import { StatusEnum } from '@prisma/client';

export class GenerateSourceEntity implements GenerateSource {
  id: string;
  riskId: string;
  name: string;
  companyId: string;
  system: boolean;
  status: StatusEnum;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;

  constructor(partial: Partial<GenerateSourceEntity>) {
    Object.assign(this, partial);
  }
}
