import { generateCuid } from '@/@v2/shared/utils/helpers/generate-cuid';

export type FormParticipantsEntityConstructor = {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class FormParticipantsEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: FormParticipantsEntityConstructor) {
    this.id = params.id ?? generateCuid();
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }
}
