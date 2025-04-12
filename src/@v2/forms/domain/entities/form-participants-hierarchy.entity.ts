export type FormParticipantsHierarchyEntityConstructor = {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  hierarchyId: string;
};

export class FormParticipantsHierarchyEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  hierarchyId: string;

  constructor(params: FormParticipantsHierarchyEntityConstructor) {
    this.id = params.id ?? 0;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.hierarchyId = params.hierarchyId;
  }
}
