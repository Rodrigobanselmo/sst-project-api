import { Injectable } from '@nestjs/common';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { FindWorkspaceDto } from './../../../dto/workspace.dto';
import { WorkspaceRepository } from './../../../repositories/implementations/WorkspaceRepository';

@Injectable()
export class FindWorkspaceService {
  constructor(private readonly workspaceRepository: WorkspaceRepository) {}

  async execute({ skip, take, ...query }: FindWorkspaceDto, user: UserPayloadDto) {
    const access = await this.workspaceRepository.find({ companyId: user.targetCompanyId, ...query }, { skip, take });

    return access;
  }
}
