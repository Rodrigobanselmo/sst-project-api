import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { MedicineRoutes } from '@/@v2/medicine/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { RoleEnum } from '@/shared/constants/enum/authorization';
import { Roles } from '@/shared/decorators/roles.decorator';
import { User } from '@/shared/decorators/user.decorator';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import {
  BrowseExamRiskRulesQuery,
  CreateExamRiskRuleBody,
  ExamRiskRuleIdPath,
  SearchExamCandidatesQuery,
  SearchRiskCandidatesQuery,
  UpdateExamRiskRuleBody,
  UpdateExamRiskRuleStatusBody,
} from './exam-risk-rule.dto';
import { ExamRiskRuleNr07SyncService } from './exam-risk-rule-nr07-sync.service';
import { ExamRiskRuleService } from './exam-risk-rule.service';

@Controller(MedicineRoutes.EXAM_RISK_RULES.BASE)
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.MASTER)
export class ExamRiskRuleController {
  constructor(
    private readonly service: ExamRiskRuleService,
    private readonly nr07SyncService: ExamRiskRuleNr07SyncService,
  ) {}

  @Get()
  browse(@Query() query: BrowseExamRiskRulesQuery) {
    return this.service.browse({
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      filters: {
        search: query.search,
        scope: query.scope,
        status: query.status,
        source: query.source,
      },
    });
  }

  @Get(MedicineRoutes.EXAM_RISK_RULES.RISK_CANDIDATES)
  searchRiskCandidates(@Query() query: SearchRiskCandidatesQuery) {
    return this.service.searchRiskCandidates(query);
  }

  @Get(MedicineRoutes.EXAM_RISK_RULES.EXAM_CANDIDATES)
  searchExamCandidates(@Query() query: SearchExamCandidatesQuery) {
    return this.service.searchExamCandidates(query);
  }

  @Post(MedicineRoutes.EXAM_RISK_RULES.SYNC_NR07)
  syncNr07() {
    return this.nr07SyncService.sync();
  }

  @Get(MedicineRoutes.EXAM_RISK_RULES.BY_ID.PATH)
  getById(@Param() path: ExamRiskRuleIdPath) {
    return this.service.getById(path.id);
  }

  @Post()
  create(@Body() body: CreateExamRiskRuleBody, @User() user: UserPayloadDto) {
    return this.service.create(body, user.userId);
  }

  @Patch(MedicineRoutes.EXAM_RISK_RULES.BY_ID.STATUS)
  updateStatus(
    @Param() path: ExamRiskRuleIdPath,
    @Body() body: UpdateExamRiskRuleStatusBody,
  ) {
    return this.service.updateStatus(path.id, body.status);
  }

  @Patch(MedicineRoutes.EXAM_RISK_RULES.BY_ID.PATH)
  update(
    @Param() path: ExamRiskRuleIdPath,
    @Body() body: UpdateExamRiskRuleBody,
  ) {
    return this.service.update(path.id, body);
  }

  @Delete(MedicineRoutes.EXAM_RISK_RULES.BY_ID.PATH)
  softDelete(@Param() path: ExamRiskRuleIdPath) {
    return this.service.softDelete(path.id);
  }
}
