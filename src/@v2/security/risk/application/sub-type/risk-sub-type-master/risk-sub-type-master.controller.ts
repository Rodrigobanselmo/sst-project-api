import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { SubTypeRoutes } from '@/@v2/security/risk/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { RoleEnum } from '@/shared/constants/enum/authorization';
import { Roles } from '@/shared/decorators/roles.decorator';
import { User } from '@/shared/decorators/user.decorator';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import {
  BrowseMasterRiskSubTypesQuery,
  CreateMasterRiskSubTypeBody,
  RiskSubTypeIdPath,
  UpdateMasterRiskSubTypeBody,
  UpdateMasterRiskSubTypeStatusBody,
} from './risk-sub-type-master.dto';
import { UpsertRiskSubTypeAiInstructionBody } from '../risk-subtype-curation/risk-subtype-curation-ai-instruction.dto';
import { RiskSubTypeAiInstructionService } from '../risk-subtype-curation/risk-subtype-ai-instruction.service';
import { RiskSubTypeMasterService } from './risk-sub-type-master.service';

@Controller(SubTypeRoutes.MASTER.BASE)
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.MASTER)
export class RiskSubTypeMasterController {
  constructor(
    private readonly service: RiskSubTypeMasterService,
    private readonly aiInstructionService: RiskSubTypeAiInstructionService,
  ) {}

  @Get()
  browse(@Query() query: BrowseMasterRiskSubTypesQuery) {
    return this.service.browse({
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      filters: {
        type: query.type,
        search: query.search,
        status: query.status,
      },
    });
  }

  @Post()
  create(
    @Body() body: CreateMasterRiskSubTypeBody,
    @User() user: UserPayloadDto,
  ) {
    return this.service.create(body, user.userId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param() path: RiskSubTypeIdPath,
    @Body() body: UpdateMasterRiskSubTypeStatusBody,
  ) {
    return this.service.updateStatus(path.id, body.status);
  }

  @Patch(':id')
  update(
    @Param() path: RiskSubTypeIdPath,
    @Body() body: UpdateMasterRiskSubTypeBody,
  ) {
    return this.service.update(path.id, body);
  }

  @Get(SubTypeRoutes.MASTER.AI_INSTRUCTION)
  getAiInstruction(@Param() path: RiskSubTypeIdPath) {
    return this.aiInstructionService.getInstruction(path.id);
  }

  @Put(SubTypeRoutes.MASTER.AI_INSTRUCTION)
  upsertAiInstruction(
    @Param() path: RiskSubTypeIdPath,
    @Body() body: UpsertRiskSubTypeAiInstructionBody,
    @User() user: UserPayloadDto,
  ) {
    return this.aiInstructionService.upsertInstruction(path.id, body, user.userId);
  }
}
