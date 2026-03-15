import { BadRequestException, Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { WorkspaceRepository } from '../../../repositories/implementations/WorkspaceRepository';

@Injectable()
export class DeleteWorkspaceService {
  constructor(private readonly workspaceRepository: WorkspaceRepository) {}

  async execute(workspaceId: string, user: UserPayloadDto): Promise<void> {
    const workspace = await this.workspaceRepository.findById(workspaceId);

    if (!workspace) {
      throw new BadRequestException('Estabelecimento não encontrado');
    }

    if (workspace.companyId !== user.targetCompanyId) {
      throw new BadRequestException('Estabelecimento não pertence à empresa');
    }

    await this.workspaceRepository.softDelete(workspaceId);
  }
}
