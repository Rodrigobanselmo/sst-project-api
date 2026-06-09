import { CacheEnum } from './../../../../../shared/constants/enum/cache';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateRecMedDto } from '../../../dto/rec-med.dto';
import { RecMedRepository } from '../../../repositories/implementations/RecMedRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { isMaster } from '../../../../../shared/utils/isMater';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CreateRecMedService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly recMedRepository: RecMedRepository,
  ) {}

  async execute(
    createRecMedDto: CreateRecMedDto,
    userPayloadDto: UserPayloadDto,
    options?: { returnIfExist?: boolean; skipIfExist?: boolean },
  ) {
    const user = isMaster(userPayloadDto, createRecMedDto.companyId);

    const system = user.isSystem && user.companyId === createRecMedDto.companyId;

    // Quando o cliente (app offline) envia um `id` próprio, esse id é a fonte da verdade: o mesmo
    // id é reutilizado depois ao vincular RecMedOnRiskData / engs ao risco-dado. Por isso honramos
    // o id em vez de retornar um RecMed existente com id diferente (via returnIfExist por nome), o
    // que faria a FK quebrar ao salvar o risco-dado (RecMedOnRiskData_rec_med_id_fkey).
    if (createRecMedDto.id) {
      const existingById = await this.recMedRepository.findNude({
        where: { id: createRecMedDto.id },
      });

      if (existingById.count > 0) return existingById.data[0];

      const created = await this.recMedRepository.create(createRecMedDto, system || false);
      await this.invalidateRepresentAllCache();
      return created;
    }

    if (createRecMedDto.recName) {
      const foundRecFactor = await this.recMedRepository.find(
        {
          companyId: createRecMedDto.companyId,
          name: createRecMedDto.recName,
          // ...(createRecMedDto.recType && { recType: [createRecMedDto.recType] }),
          riskIds: [createRecMedDto.riskId],
          onlyRec: true,
          representAll: true,
        },
        { take: 1, skip: 0 },
      );

      if (foundRecFactor.count > 0) {
        if (options.skipIfExist) return;
        if (options?.returnIfExist) return foundRecFactor.data[0];
        throw new BadRequestException('Recomendação já exite');
      }
    }

    if (createRecMedDto.medName) {
      const foundMedFactor = await this.recMedRepository.find(
        {
          companyId: createRecMedDto.companyId,
          name: createRecMedDto.medName,
          medType: [createRecMedDto.medType],
          riskIds: [createRecMedDto.riskId],
          onlyMed: true,
          representAll: true,
        },
        { take: 1, skip: 0 },
      );

      if (foundMedFactor.count > 0) {
        if (options.skipIfExist) return;
        if (options?.returnIfExist) return foundMedFactor.data[0];
        throw new BadRequestException('Medida de controle já exite');
      }
    }

    const RecMedFactor = await this.recMedRepository.create(createRecMedDto, system || false);
    await this.invalidateRepresentAllCache();

    return RecMedFactor;
  }

  private async invalidateRepresentAllCache() {
    const cacheKey = CacheEnum.REC_MED_REPRESENT_ALL;

    // const keys = await this.cacheManager.store.reset(cacheKey);
    const keys = (await this.cacheManager.store.keys()) as string[];
    await Promise.all(
      keys.map(async (key) => {
        if (key.includes(cacheKey)) await this.cacheManager.del(key);
      }),
    );
  }
}
