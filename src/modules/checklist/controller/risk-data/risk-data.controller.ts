import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { DeleteManyRiskDataService } from '../../services/risk-data/delete-many-risk-data/delete-many-risk-data.service';
import { FindAllActionPlanService } from '../../services/risk-data/find-all-action-plan/find-all-action-plan.service';
import { FindAllByGroupAndRiskService } from '../../services/risk-data/find-by-group-risk/find-by-group-risk.service';
import { FindAllByHomogeneousGroupService } from '../../services/risk-data/find-by-homogeneous-group/find-by-homogeneous-group.service';
import { UpsertManyRiskDataService } from '../../services/risk-data/upsert-many-risk-data/upsert-many-risk-data.service';
import { UpsertRiskDataService } from '../../services/risk-data/upsert-risk-data/upsert-risk.service';
import {
  DeleteManyRiskDataDto,
  FindRiskDataDto,
  UpsertManyRiskDataDto,
  UpsertRiskDataDto,
} from './../../dto/risk-data.dto';

@Controller('risk-data')
export class RiskDataController {
  constructor(
    private readonly upsertRiskDataService: UpsertRiskDataService,
    private readonly upsertManyRiskDataService: UpsertManyRiskDataService,
    private readonly findAllByGroupAndRiskService: FindAllByGroupAndRiskService,
    private readonly findAllByHomogeneousGroupService: FindAllByHomogeneousGroupService,
    private readonly deleteManyRiskDataService: DeleteManyRiskDataService,
    private readonly findAllActionPlanService: FindAllActionPlanService,
  ) {}

  @Post()
  upsert(@Body() upsertRiskDataDto: UpsertRiskDataDto) {
    return this.upsertRiskDataService.execute(upsertRiskDataDto);
  }

  @Get('/action-plan/:companyId/:workspaceId/:riskGroupId')
  findActionPlan(
    @User() userPayloadDto: UserPayloadDto,
    @Param('riskGroupId') groupId: string,
    @Param('workspaceId') workspaceId: string,
    @Query() query: FindRiskDataDto,
  ) {
    const companyId = userPayloadDto.targetCompanyId;
    return this.findAllActionPlanService.execute(
      groupId,
      workspaceId,
      companyId,
      query,
    );
  }

  @Post('many')
  upsertMany(@Body() upsertRiskDataDto: UpsertManyRiskDataDto) {
    return this.upsertManyRiskDataService.execute(upsertRiskDataDto);
  }

  @Get('/:companyId/:riskGroupId/:riskId')
  findAllAvailable(
    @User() userPayloadDto: UserPayloadDto,
    @Param('riskId') riskId: string,
    @Param('riskGroupId') groupId: string,
  ) {
    const companyId = userPayloadDto.targetCompanyId;

    return this.findAllByGroupAndRiskService.execute(
      riskId,
      groupId,
      companyId,
    );
  }

  // @Get('/:companyId/:groupId/hierarchy/:hierarchyId')
  // findAllAvailableByHierarchy(
  //   @User() userPayloadDto: UserPayloadDto,
  //   @Param('groupId') groupId: string,
  //   @Param('hierarchyId') hierarchyId: string,
  // ) {
  //   const companyId = userPayloadDto.targetCompanyId;

  //   return this.findAllByGroupAndRiskService.execute(
  //     hierarchyId,
  //     groupId,
  //     companyId,
  //   );
  // }

  @Get('/:companyId/:groupId/homogeneous/:homogeneousGroupId')
  findAllAvailableByHomogenousGroup(
    @User() userPayloadDto: UserPayloadDto,
    @Param('groupId') groupId: string,
    @Param('homogeneousGroupId') homogeneousGroupId: string,
  ) {
    const companyId = userPayloadDto.targetCompanyId;

    return this.findAllByHomogeneousGroupService.execute(
      homogeneousGroupId,
      groupId,
      companyId,
    );
  }

  @Post('/:companyId/:groupId/delete/many')
  deleteMany(
    @Body() upsertRiskDataDto: DeleteManyRiskDataDto,
    @Param('groupId') groupId: string,
  ) {
    return this.deleteManyRiskDataService.execute(upsertRiskDataDto, groupId);
  }
}
