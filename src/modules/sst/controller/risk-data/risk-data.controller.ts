import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { DeleteManyRiskDataService } from '../../services/risk-data/delete-many-risk-data/delete-many-risk-data.service';
import { FindAllActionPlanService } from '../../services/risk-data/find-all-action-plan/find-all-action-plan.service';
import { FindAllByGroupAndRiskService } from '../../services/risk-data/find-by-group-risk/find-by-group-risk.service';
import { FindAllByHierarchyService } from '../../services/risk-data/find-by-hierarchy/find-by-hierarchy.service';
import { FindAllByHomogeneousGroupService } from '../../services/risk-data/find-by-homogeneous-group/find-by-homogeneous-group.service';
import { UpsertManyRiskDataService } from '../../services/risk-data/upsert-many-risk-data/upsert-many-risk-data.service';
import { UpsertRiskDataService } from '../../services/risk-data/upsert-risk-data/upsert-risk.service';
import {
  DeleteManyRiskDataDto,
  FindRiskDataDto,
  UpsertManyRiskDataDto,
  UpsertRiskDataDto,
} from '../../dto/risk-data.dto';

@Controller('risk-data')
export class RiskDataController {
  constructor(
    private readonly upsertRiskDataService: UpsertRiskDataService,
    private readonly upsertManyRiskDataService: UpsertManyRiskDataService,
    private readonly findAllByGroupAndRiskService: FindAllByGroupAndRiskService,
    private readonly findAllByHomogeneousGroupService: FindAllByHomogeneousGroupService,
    private readonly findAllByHierarchyService: FindAllByHierarchyService,
    private readonly deleteManyRiskDataService: DeleteManyRiskDataService,
    private readonly findAllActionPlanService: FindAllActionPlanService,
  ) {}

  @Permissions({
    code: PermissionEnum.RISK_DATA,
    crud: 'cu',
    isContract: true,
    isMember: true,
  })
  @Post()
  upsert(@Body() upsertRiskDataDto: UpsertRiskDataDto) {
    return this.upsertRiskDataService.execute(upsertRiskDataDto);
  }

  @Permissions({
    code: PermissionEnum.RISK_DATA,
    crud: 'cu',
    isContract: true,
    isMember: true,
  })
  @Post('many')
  upsertMany(@Body() upsertRiskDataDto: UpsertManyRiskDataDto) {
    return this.upsertManyRiskDataService.execute(upsertRiskDataDto);
  }

  @Permissions(
    {
      code: PermissionEnum.RISK_DATA,
      isContract: true,
      isMember: true,
    },
    {
      code: PermissionEnum.ACTION_PLAN,
      isContract: true,
      isMember: true,
    },
  )
  @Get('/action-plan/:companyId/:workspaceId/:riskGroupId')
  findActionPlan(
    @User() userPayloadDto: UserPayloadDto,
    @Param('riskGroupId') groupId: string,
    @Param('workspaceId') workspaceId: string,
    @Query() query: FindRiskDataDto,
  ) {
    const companyId = userPayloadDto.targetCompanyId;
    return this.findAllActionPlanService.execute(groupId, workspaceId, companyId, query);
  }

  @Permissions({
    code: PermissionEnum.RISK_DATA,
    isContract: true,
    isMember: true,
  })
  @Get('/:companyId/:groupId/homogeneous/:homogeneousGroupId')
  findAllAvailableByHomogenousGroup(
    @User() userPayloadDto: UserPayloadDto,
    @Param('groupId') groupId: string,
    @Param('homogeneousGroupId') homogeneousGroupId: string,
  ) {
    const companyId = userPayloadDto.targetCompanyId;

    return this.findAllByHomogeneousGroupService.execute(homogeneousGroupId, groupId, companyId);
  }

  @Permissions({
    code: PermissionEnum.RISK_DATA,
    isContract: true,
    isMember: true,
  })
  @Get('/:companyId/hierarchy/:hierarchyId')
  findAllAvailableByHierarchy(@User() userPayloadDto: UserPayloadDto, @Param('hierarchyId') hierarchyId: string) {
    const companyId = userPayloadDto.targetCompanyId;

    return this.findAllByHierarchyService.execute(hierarchyId, companyId);
  }

  @Permissions({
    code: PermissionEnum.RISK_DATA,
    isContract: true,
    isMember: true,
  })
  @Get('/:companyId/:riskGroupId/:riskId')
  findAllAvailable(
    @User() userPayloadDto: UserPayloadDto,
    @Param('riskId') riskId: string,
    @Param('riskGroupId') groupId: string,
  ) {
    const companyId = userPayloadDto.targetCompanyId;

    return this.findAllByGroupAndRiskService.execute(riskId, groupId, companyId);
  }

  @Permissions({
    code: PermissionEnum.RISK_DATA,
    crud: 'd',
    isContract: true,
    isMember: true,
  })
  @Post('/:companyId/:groupId/delete/many')
  delete(@Body() upsertRiskDataDto: DeleteManyRiskDataDto, @Param('companyId') companyId: string) {
    return this.deleteManyRiskDataService.execute(upsertRiskDataDto, companyId);
  }
}
