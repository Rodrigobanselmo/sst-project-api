import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';

type IHierarchy = {
  id: string;
  name: string;
  type: HierarchyTypeEnum;
};

export type IFormParticipantsBrowseResultModel = {
  id: number;
  name: string;
  cpf: string;
  email: string;
  phone: string | null;
  status: string;
  companyId: string;
  hierarchyId: string;
  hierarchyName: string;
  hierarchies: IHierarchy[];
  hasResponded: boolean;
  emailSent: boolean;
  emailSentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  encryptedEmployeeId: string;
};

export class FormParticipantsBrowseResultModel {
  id: number;
  name: string;
  cpf: string;
  email: string;
  phone: string | null;
  status: string;
  companyId: string;
  hierarchyId: string;
  hierarchyName: string;
  hierarchies: IHierarchy[];
  hasResponded: boolean;
  emailSent: boolean;
  emailSentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  encryptedEmployeeId: string;

  constructor(params: IFormParticipantsBrowseResultModel) {
    this.id = params.id;
    this.name = params.name;
    this.cpf = params.cpf;
    this.email = params.email;
    this.phone = params.phone;
    this.status = params.status;
    this.companyId = params.companyId;
    this.hierarchyId = params.hierarchyId;
    this.hierarchyName = params.hierarchyName;
    this.hierarchies = params.hierarchies;
    this.hasResponded = params.hasResponded;
    this.emailSent = params.emailSent;
    this.emailSentAt = params.emailSentAt;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.encryptedEmployeeId = params.encryptedEmployeeId;
  }
}
