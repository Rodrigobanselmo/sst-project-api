import { Injectable } from '@nestjs/common';

import { SyncDto } from '../../../dto/sync.dto';
import { SyncRepository } from '../../../repositories/implementations/SyncRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { HierarchyEntity } from '../../../../../modules/company/entities/hierarchy.entity';

@Injectable()
export class SyncHierarchyService {
  constructor(private readonly syncRepository: SyncRepository) { }

  async execute(data: SyncDto, user: UserPayloadDto) {
    const hierarchies = await this.syncRepository.findHierarchiesSync({
      // companyId: user.companyId,
      workspaceId: data.workspaceId,
    })

    return hierarchies
  }

  async executeSync(data: SyncDto, user: UserPayloadDto) {
    const hierarchyChanges = await this.syncRepository.findHierarchySyncChanges({
      companyIds: [user.companyId],
      lastPulledVersion: data.lastPulledVersion,
      userId: user.userId,
    })

    const changes = {
      Hierarchy: hierarchyChanges,
      MMWorkspaceHierarchy: {
        created: ([...hierarchyChanges.created, ...hierarchyChanges.updated] as HierarchyEntity[]).map((data) => {
          return data.workspaces.map((workspace) => ({ id: workspace.id + data.id, hierarchyId: data.id, workspaceId: workspace.id, created_at: new Date(), updated_at: new Date() }))
        }).flat(1),
        updated: [],
        deleted: [],
      },
    }

    return {
      latestVersion: new Date().getTime(),
      changes
    }
  }
}
