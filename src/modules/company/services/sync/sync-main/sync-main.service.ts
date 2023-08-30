import { Injectable } from '@nestjs/common';

import { SyncDto } from '../../../../../modules/company/dto/sync.dto';
import { SyncRepository } from '../../../../../modules/company/repositories/implementations/SyncRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class SyncMainService {
  constructor(private readonly syncRepository: SyncRepository) { }

  async execute(data: SyncDto, user: UserPayloadDto) {
    const changes = await this.syncRepository.findSyncChanges({
      companyId: user.companyId,
      lastPulledVersion: data.lastPulledVersion,
      userId: user.userId,
      companyIds: data.companyIds,
      companyStartIds: data.companyStartIds,
    })

    function substituteArraysForLengths(obj) {
      if (Array.isArray(obj)) {
        return obj.length;
      } else if (typeof obj === 'object' && obj !== null) {
        const result = Array.isArray(obj) ? [] : {};

        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            result[key] = substituteArraysForLengths(obj[key]);
          }
        }

        return result;
      } else {
        return obj;
      }
    }

    console.log(JSON.stringify(substituteArraysForLengths(changes), null, 2))

    return {
      latestVersion: new Date().getTime(),
      changes
    }
  }
}
