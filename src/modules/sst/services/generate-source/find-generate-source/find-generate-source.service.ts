import { FindGenerateSourceDto } from './../../../dto/generate-source.dto';
import { GenerateSourceEntity } from '../../../entities/generateSource.entity';
import { CacheEnum } from '../../../../../shared/constants/enum/cache';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { GenerateSourceRepository } from '../../../repositories/implementations/GenerateSourceRepository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class FindGenerateSourceService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly generateSourceRepository: GenerateSourceRepository,
  ) { }

  async execute({ skip, take, riskType, ...query }: FindGenerateSourceDto, user: UserPayloadDto) {
    const GenerateSource = await this.generateSourceRepository.find(
      { companyId: user.targetCompanyId, ...query },
      { skip, take },
    );

    const cacheKey = CacheEnum.GS_REPRESENT_ALL;

    let GenerateSourceAll: {
      data: GenerateSourceEntity[];
      count: number;
    } = await this.cacheManager.get(cacheKey);

    if (!GenerateSourceAll) {
      GenerateSourceAll = await this.generateSourceRepository.findNude({
        where: {
          deleted_at: null,
          risk: { representAll: true, ...(riskType && { type: riskType }) },
        },
        distinct: ['name'],
      });

      GenerateSourceAll.data = GenerateSourceAll.data.map((x) => ({
        ...x,
        isAll: true,
      }));
      await this.cacheManager.set(cacheKey, GenerateSourceAll, 360);
    }

    if (GenerateSourceAll.data) GenerateSource.data.unshift(...GenerateSourceAll.data);

    return GenerateSource;
  }
}
