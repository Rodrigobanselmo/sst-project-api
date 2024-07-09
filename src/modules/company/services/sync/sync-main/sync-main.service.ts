import { Injectable } from '@nestjs/common';

import { SyncDto } from '../../../../../modules/company/dto/sync.dto';
import { SyncRepository } from '../../../../../modules/company/repositories/implementations/SyncRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class SyncMainService {
  constructor(private readonly syncRepository: SyncRepository) {}

  async execute(data: SyncDto, user: UserPayloadDto) {
    const changes = await this.syncRepository.findSyncChanges({
      companyId: user.companyId,
      lastPulledVersion: data.lastPulledVersion,
      userId: user.userId,
      companyIds: data.companyIds,
      companyStartIds: data.companyStartIds,
    });

    return {
      latestVersion: new Date().getTime(),
      changes,
    };
  }
}
