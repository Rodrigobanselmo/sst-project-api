import { IsString } from 'class-validator';

export class HierarchyGroupApplicationPath {
  @IsString()
  companyId!: string;

  @IsString()
  applicationId!: string;
}

export class HierarchyGroupIdPath extends HierarchyGroupApplicationPath {
  @IsString()
  groupId!: string;
}
