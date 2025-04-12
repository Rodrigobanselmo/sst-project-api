export type FormParticipantsEntityConstructor = {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export class FormParticipantsEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: FormParticipantsEntityConstructor) {
    this.id = params.id ?? 0;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }
}
