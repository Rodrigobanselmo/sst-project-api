import { generateCuid } from '@/@v2/shared/utils/helpers/generate-cuid';

export type FormParticipantsAnswersEntityConstructor = {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  employeeId?: number;
};

export class FormParticipantsAnswersEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  employeeId?: number;

  constructor(params: FormParticipantsAnswersEntityConstructor) {
    this.id = params.id ?? generateCuid();
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.employeeId = params.employeeId;
  }
}
