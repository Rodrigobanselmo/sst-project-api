import { Address, Workspace } from '@prisma/client';
import { WorkspaceModel } from '../../domain/models/workspace.model';
import { AddressModel } from '../../domain/models/address.model';

export type IWorkspaceMapper = Workspace & {
  address: Address | null
}

export class WorkspaceMapper {
  static toModel(data: IWorkspaceMapper): WorkspaceModel {
    return new WorkspaceModel({
      id: data.id,
      name: data.name,
      cnpj: data.cnpj,
      isOwner: data.isOwner,
      address: data.address ? new AddressModel(data.address) : null,
    })
  }
}