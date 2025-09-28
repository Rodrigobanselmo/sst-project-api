export type IEmailLogEntity = {
  id?: number;
  email: string;
  template: string; //should be EmailsEnum
  data?: Record<string, any>;
  deduplicationId?: string;
  createdAt?: Date;
};

export class EmailLogEntity {
  id: number;
  email: string;
  template: string; //should be EmailsEnum
  data?: Record<string, any>;
  deduplicationId?: string;
  createdAt?: Date;

  constructor(params: IEmailLogEntity) {
    this.id = params.id || -1;
    this.email = params.email;
    this.template = params.template;
    this.data = params.data || {};
    this.deduplicationId = params.deduplicationId;
    this.createdAt = params.createdAt || new Date();
  }
}
