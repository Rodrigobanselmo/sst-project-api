import { Injectable } from '@nestjs/common';

import { SyncCharacterizationDto } from '../../../../../modules/company/dto/sync-characterization.dto';
import { SyncRepository } from '../../../repositories/implementations/SyncRepository';

@Injectable()
export class SyncCharacterizationService {
  constructor(private readonly syncRepository: SyncRepository) { }

  async execute(data: SyncCharacterizationDto) {
    const characterizations = await this.syncRepository.findCharacterizationChanges({
      companyId: data.companyId,
      workspaceId: data.workspaceId,
      lastSync: data.lastSync
    });

    return {
      latestVersion: new Date().getTime(),
      characterizations,
    };
  }
}
