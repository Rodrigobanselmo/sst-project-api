import { ChecklistData, Prisma } from '.prisma/client';

export class ChecklistDataEntity implements ChecklistData {
  checklistId: number;
  json: Prisma.JsonValue;
  companyId: string;

  constructor(partial: Partial<ChecklistDataEntity>) {
    Object.assign(this, partial);
  }
}
