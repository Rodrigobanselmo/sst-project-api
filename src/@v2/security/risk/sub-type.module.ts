import { SharedModule } from '@/@v2/shared/shared.module';
import { Module } from '@nestjs/common';
import { SubTypeDAO } from './database/dao/sub-type/sub-type.dao';
import { BrowseSubTypeController } from './application/sub-type/browse-sub-type/controllers/browse-sub-type.controller';
import { BrowseSubTypeUseCase } from './application/sub-type/browse-sub-type/use-cases/browse-sub-type.usecase';

@Module({
  imports: [SharedModule],
  controllers: [BrowseSubTypeController],
  providers: [
    // Database
    SubTypeDAO,

    // Use Cases
    BrowseSubTypeUseCase,
  ],
  exports: [],
})
export class SubTypeModule {}
