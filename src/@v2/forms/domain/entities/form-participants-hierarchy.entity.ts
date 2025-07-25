import { generateCuid } from '@/@v2/shared/utils/helpers/generate-cuid';

export type FormParticipantsHierarchyEntityConstructor = {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  hierarchyId: string;
};

export class FormParticipantsHierarchyEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  hierarchyId: string;

  constructor(params: FormParticipantsHierarchyEntityConstructor) {
    this.id = params.id ?? generateCuid();
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.hierarchyId = params.hierarchyId;
  }
}
