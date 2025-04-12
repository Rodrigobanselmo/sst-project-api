export type FormParticipantsAnswersEntityConstructor = {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  employeeId?: number;
};

export class FormParticipantsAnswersEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  employeeId?: number;

  constructor(params: FormParticipantsAnswersEntityConstructor) {
    this.id = params.id ?? 0;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.employeeId = params.employeeId;
  }
}
