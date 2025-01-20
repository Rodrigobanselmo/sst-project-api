import { SharedModule } from '@/@v2/shared/shared.module';
import { Module } from '@nestjs/common';
import { UserAggregateRepository } from './database/repositories/user-aggregate/user-aggregate.repository';
import { AccessGroupRepository } from './database/repositories/access-group/access-group.repository';

@Module({
  imports: [SharedModule],
  controllers: [],
  providers: [
    // Database
    UserAggregateRepository,
    AccessGroupRepository,

    // Use Cases
  ],
  exports: [],
})
export class CompanyModule {}
