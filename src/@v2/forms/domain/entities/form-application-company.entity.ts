import { generateCuid } from '@/@v2/shared/utils/helpers/generate-cuid';

export type FormApplicationCompanyEntityConstructor = {
  id?: string;
  companyId: string;
  isNew?: boolean;
};

export class FormApplicationCompanyEntity {
  id: string;
  companyId: string;
  isNew: boolean;

  constructor(params: FormApplicationCompanyEntityConstructor) {
    this.id = params.id || generateCuid();
    this.companyId = params.companyId;
    this.isNew = params.isNew ?? true;
  }
}
