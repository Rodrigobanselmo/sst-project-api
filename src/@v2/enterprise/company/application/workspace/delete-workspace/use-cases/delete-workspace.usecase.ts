import { BadRequestException, Injectable } from '@nestjs/common';
import { WorkspaceDAO } from '@/@v2/enterprise/company/database/dao/workspace/workspace.dao';

export namespace IDeleteWorkspaceUseCase {
  export type Params = {
    workspaceId: string;
    companyId: string;
  };
}

@Injectable()
export class DeleteWorkspaceUseCase {
  constructor(private readonly workspaceDAO: WorkspaceDAO) {}

  async execute(params: IDeleteWorkspaceUseCase.Params): Promise<void> {
    const count = await this.workspaceDAO.softDelete(params.workspaceId, params.companyId);
    if (count === 0) {
      throw new BadRequestException('Estabelecimento não encontrado');
    }
  }
}
