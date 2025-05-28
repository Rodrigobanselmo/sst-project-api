import { SharedModule } from '@/@v2/shared/shared.module';
import { Module } from '@nestjs/common';
import { BrowseAbsenteeismHierarchTotalController as BrowseAbsenteeismHierarchyTotalController } from './application/dashboard/browse-absenteeism-hierarchy-total/controllers/browse-absenteeism.controller';
import { BrowseAbsenteeismHierarchyTotalUseCase } from './application/dashboard/browse-absenteeism-hierarchy-total/use-cases/browse-absenteeism.usecase';
import { AbsenteeismMetricsDAO } from './database/dao/absenteeism-metrics/absenteeism-metrics.dao';
import { ReadAbsenteeismTimelineTotalController } from './application/dashboard/read-absenteeism-timeline-total/controllers/read-absenteeism.controller';
import { ReadAbsenteeismTimelineTotalUseCase } from './application/dashboard/read-absenteeism-timeline-total/use-cases/read-absenteeism.usecase';
import { ReadAbsenteeismDaysCountUseCase } from './application/dashboard/read-absenteeism-days-count/use-cases/read-absenteeism.usecase';
import { ReadAbsenteeismDaysCountController } from './application/dashboard/read-absenteeism-days-count/controllers/read-absenteeism.controller';
import { ReadAbsenteeismMotiveCountUseCase } from './application/dashboard/read-absenteeism-motive-count/use-cases/read-absenteeism.usecase';
import { ReadAbsenteeismMotiveCountController } from './application/dashboard/read-absenteeism-motive-count/controllers/read-absenteeism.controller';
import { BrowseAbsenteeismEmployeeTotalUseCase } from './application/dashboard/browse-absenteeism-employee-total/use-cases/browse-absenteeism.usecase';
import { BrowseAbsenteeismEmployeeTotalController } from './application/dashboard/browse-absenteeism-employee-total/controllers/browse-absenteeism.controller';

@Module({
  imports: [SharedModule],
  controllers: [
    BrowseAbsenteeismHierarchyTotalController,
    ReadAbsenteeismTimelineTotalController,
    ReadAbsenteeismDaysCountController,
    ReadAbsenteeismMotiveCountController,
    BrowseAbsenteeismEmployeeTotalController,
  ],
  providers: [
    // Database
    AbsenteeismMetricsDAO,

    // Use Cases
    BrowseAbsenteeismHierarchyTotalUseCase,
    ReadAbsenteeismTimelineTotalUseCase,
    ReadAbsenteeismDaysCountUseCase,
    ReadAbsenteeismMotiveCountUseCase,
    BrowseAbsenteeismEmployeeTotalUseCase,
  ],
  exports: [],
})
export class AbsenteeismModule {}
