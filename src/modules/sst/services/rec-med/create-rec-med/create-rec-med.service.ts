import { CacheEnum } from './../../../../../shared/constants/enum/cache';
import { BadRequestException, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { CreateRecMedDto } from '../../../dto/rec-med.dto';
import { RecMedRepository } from '../../../repositories/implementations/RecMedRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { isMaster } from '../../../../../shared/utils/isMater';
import { Cache } from 'cache-manager';

@Injectable()
export class CreateRecMedService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private readonly recMedRepository: RecMedRepository) {}

  async execute(createRecMedDto: CreateRecMedDto, userPayloadDto: UserPayloadDto, options?: { returnIfExist?: boolean }) {
    const user = isMaster(userPayloadDto, createRecMedDto.companyId);

    const system = user.isSystem && user.companyId === createRecMedDto.companyId;

    if (createRecMedDto.recName) {
      const foundRecFactor = await this.recMedRepository.find(
        { companyId: createRecMedDto.companyId, search: createRecMedDto.recName, recType: [createRecMedDto.recType], riskIds: [createRecMedDto.riskId] },
        { take: 1, skip: 0 },
      );

      if (foundRecFactor.count > 0) {
        if (options.returnIfExist) return foundRecFactor.data[0];
        throw new BadRequestException('Recomendação já exite');
      }
    }

    if (createRecMedDto.medName) {
      const foundMedFactor = await this.recMedRepository.find(
        { companyId: createRecMedDto.companyId, search: createRecMedDto.medName, medType: [createRecMedDto.medType], riskIds: [createRecMedDto.riskId] },
        { take: 1, skip: 0 },
      );

      if (foundMedFactor.count > 0) {
        if (options.returnIfExist) return foundMedFactor.data[0];
        throw new BadRequestException('Medida de controle já exite');
      }
    }

    const RecMedFactor = await this.recMedRepository.create(createRecMedDto, system || false);
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
