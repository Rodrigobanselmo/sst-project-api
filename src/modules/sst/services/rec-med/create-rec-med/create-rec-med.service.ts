import { CacheEnum } from './../../../../../shared/constants/enum/cache';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { CreateRecMedDto } from '../../../dto/rec-med.dto';
import { RecMedRepository } from '../../../repositories/implementations/RecMedRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { isMaster } from '../../../../../shared/utils/isMater';
import { Cache } from 'cache-manager';

@Injectable()
export class CreateRecMedService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private readonly recMedRepository: RecMedRepository) {}

  async execute(createRecMedDto: CreateRecMedDto, userPayloadDto: UserPayloadDto) {
    const user = isMaster(userPayloadDto, createRecMedDto.companyId);

    const system = user.isSystem && user.companyId === createRecMedDto.companyId;

    const RecMedFactor = await this.recMedRepository.create(createRecMedDto, system);
    const cacheKey = CacheEnum.REC_MED_REPRESENT_ALL;

    // const keys = await this.cacheManager.store.reset(cacheKey);
    const keys = (await this.cacheManager.store.keys()) as string[];
    Promise.all(
      keys.map(async (key) => {
        if (key.includes(cacheKey)) await this.cacheManager.del(key);
      }),
    );

    return RecMedFactor;
  }
}
