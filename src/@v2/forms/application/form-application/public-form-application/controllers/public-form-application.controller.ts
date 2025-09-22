import { Controller, Get, Param, Query, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { FormRoutes } from '@/@v2/forms/constants/routes';
import { Public } from '@/@v2/shared/decorators/metadata/public.decorator';
import { PublicFormApplicationUseCase } from '../use-cases/public-form-application.usecase';
import { PublicFormApplicationPath } from './public-form-application.path';
import { PublicFormApplicationQuery } from './public-form-application.query';
import { CacheProvider } from '@/shared/providers/CacheProvider/CacheProvider';
import { CacheTtlEnum } from '@/shared/interfaces/cache.types';
import { CacheEnum } from '@/shared/constants/enum/cache';

@Controller(FormRoutes.FORM_APPLICATION.PATH_PUBLIC)
export class PublicFormApplicationController {
  constructor(
    private readonly publicFormApplicationUseCase: PublicFormApplicationUseCase,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Get()
  @Public()
  async execute(@Param() path: PublicFormApplicationPath, @Query() query: PublicFormApplicationQuery) {
    // Create cache key based on parameters
    const cacheKey = `${CacheEnum.PUBLIC_FORM_APPLICATION}_${path.applicationId}_${query.employeeId || 'no-employee'}`;

    // Initialize cache provider
    const cache = new CacheProvider({
      cacheManager: this.cacheManager,
      ttlSeconds: CacheTtlEnum.HOUR_24, // Cache for 10 minutes
    });

    // Try to get cached result or execute use case
    return cache.funcResponse(
      () =>
        this.publicFormApplicationUseCase.execute({
          applicationId: path.applicationId,
          employeeId: query.employeeId,
        }),
      cacheKey,
    );
  }
}
