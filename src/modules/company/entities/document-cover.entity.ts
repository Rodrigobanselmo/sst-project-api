import { CoverTypeEnum, DocumentCover, Prisma } from '@prisma/client';

export class DocumentCoverEntity implements DocumentCover {
  id: number;
  name: string;
  json: Prisma.JsonValue;
  description: string;
  companyId: string;
  acceptType: CoverTypeEnum[];

  constructor(partial: Partial<DocumentCoverEntity>) {
    Object.assign(this, partial);
  }
}
