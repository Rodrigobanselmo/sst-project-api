import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';

export type IFormParticipantStructureBrowseModel = {
  participantsAnswersId: string;
  companyId: string | null;
  companyName: string | null;
  workspaceId: string | null;
  workspaceName: string | null;
  hierarchies: {
    id: string;
    name: string;
    type: HierarchyTypeEnum;
  }[];
};

export class FormParticipantStructureBrowseModel {
  participantsAnswersId: string;
  companyId: string | null;
  companyName: string | null;
  workspaceId: string | null;
  workspaceName: string | null;
  hierarchies: {
    id: string;
    name: string;
    type: HierarchyTypeEnum;
  }[];

  constructor(params: IFormParticipantStructureBrowseModel) {
    this.participantsAnswersId = params.participantsAnswersId;
    this.companyId = params.companyId ?? null;
    this.companyName = params.companyName ?? null;
    this.workspaceId = params.workspaceId;
    this.workspaceName = params.workspaceName;
    this.hierarchies = params.hierarchies;
  }
}
