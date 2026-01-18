import { Address, Workspace } from '@prisma/client';
import { WorkspaceModel } from '../../domain/models/workspace.model';
import { AddressModel } from '../../domain/models/address.model';

export type IWorkspaceMapper = Workspace & {
  address: Address | null;
};

export class WorkspaceMapper {
  static toModel(data: IWorkspaceMapper): WorkspaceModel {
    const json = (data.companyJson as any) || {};

    return new WorkspaceModel({
      id: data.id,
      name: data.name,
      isOwner: data.isOwner,
      address: data.address ? new AddressModel(data.address) : null,
      customSectionHTML: json.useCustomSection ? json.customSectionHTML || null : null,

      cnpj: data.cnpj,
      razaoSocial: json.name || null,
      riskDegree: json.primaryActivity?.riskDegree || null,
      cnaeLabel: json.primaryActivity?.name || null,
      cnaeCode: json.primaryActivity?.code || null,
      workSchedule: json.workSchedule || null,
      logoUrl: data.logoUrl || null,
    });
  }
}
