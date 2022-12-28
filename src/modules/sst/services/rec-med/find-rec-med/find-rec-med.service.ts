import { RecMedEntity } from './../../../entities/recMed.entity';
import { CacheEnum } from './../../../../../shared/constants/enum/cache';
import { FindRecMedDto } from './../../../dto/rec-med.dto';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { RecMedRepository } from '../../../../../modules/sst/repositories/implementations/RecMedRepository';

@Injectable()
export class FindRecMedService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private readonly recMedRepository: RecMedRepository) {}

  async execute({ skip, take, riskType, ...query }: FindRecMedDto, user: UserPayloadDto) {
    const RecMed = await this.recMedRepository.find({ companyId: user.targetCompanyId, ...query }, { skip, take });

    const extCacheString = JSON.stringify({ onlyRec: query.onlyRec, onlyMed: query.onlyMed, riskType });
    const cacheKey = CacheEnum.REC_MED_REPRESENT_ALL + extCacheString;

    let RecMedAll: {
      data: RecMedEntity[];
      count: number;
    } = await this.cacheManager.get(cacheKey);

    if (!RecMedAll) {
      RecMedAll = await this.recMedRepository.findNude({
        where: {
          ...(query.onlyRec && { AND: [{ recName: { not: null } }, { recName: { not: '' } }] }),
          ...(query.onlyMed && { AND: [{ medName: { not: null } }, { medName: { not: '' } }] }),
          risk: { representAll: true, ...(riskType && { type: riskType }) },
        },
        distinct: ['medName', 'recName'],
      });

      RecMedAll.data = RecMedAll.data.map((x) => ({ ...x, isAll: true }));

      await this.cacheManager.set(cacheKey, RecMedAll, 360);
    }

    if (RecMedAll?.data) RecMed.data.unshift(...RecMedAll.data);

    return RecMed;
  }
}