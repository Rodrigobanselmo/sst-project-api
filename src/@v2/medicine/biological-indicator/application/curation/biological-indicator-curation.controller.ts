import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { MedicineRoutes } from '@/@v2/medicine/constants/routes';
import { RoleEnum } from '@/shared/constants/enum/authorization';
import { Roles } from '@/shared/decorators/roles.decorator';
import { User } from '@/shared/decorators/user.decorator';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import {
  BiologicalIndicatorIdPath,
  BiologicalIndicatorLinkIdPath,
  BrowseBiologicalIndicatorsQuery,
  CreateExamLinkBody,
  CurationNotesBody,
  RematchBody,
  SearchExamCandidatesQuery,
  UpdateIndicatorStatusBody,
  UpdateReviewNotesBody,
} from './biological-indicator-curation.dto';
import { BiologicalIndicatorCurationService } from '../../services/biological-indicator-curation.service';

@Controller(MedicineRoutes.BIOLOGICAL_INDICATORS.BASE)
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.MASTER)
export class BiologicalIndicatorCurationController {
  constructor(
    private readonly curationService: BiologicalIndicatorCurationService,
  ) {}

  @Get()
  browse(@Query() query: BrowseBiologicalIndicatorsQuery) {
    return this.curationService.browse({
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      filters: {
        search: query.search,
        substanceName: query.substanceName,
        cas: query.cas,
        tableNumber: query.tableNumber,
        indicatorType: query.indicatorType,
        status: query.status,
        requiresNormativeReview: query.requiresNormativeReview,
        isSubstanceGroup: query.isSubstanceGroup,
        hasConfirmedRisk: query.hasConfirmedRisk,
        hasConfirmedExam: query.hasConfirmedExam,
        hasPendency: query.hasPendency,
      },
    });
  }

  @Get(MedicineRoutes.BIOLOGICAL_INDICATORS.EXAM_CANDIDATES)
  searchExamCandidates(@Query() query: SearchExamCandidatesQuery) {
    return this.curationService.searchExamCandidates(query);
  }

  @Get(MedicineRoutes.BIOLOGICAL_INDICATORS.BY_ID.PATH)
  getById(@Param() path: BiologicalIndicatorIdPath) {
    return this.curationService.getById(path.id);
  }

  @Get(MedicineRoutes.BIOLOGICAL_INDICATORS.BY_ID.PENDENCIES)
  getPendencies(@Param() path: BiologicalIndicatorIdPath) {
    return this.curationService.getPendencies(path.id);
  }

  @Patch(MedicineRoutes.BIOLOGICAL_INDICATORS.BY_ID.STATUS)
  updateStatus(
    @Param() path: BiologicalIndicatorIdPath,
    @Body() body: UpdateIndicatorStatusBody,
    @User() user: UserPayloadDto,
  ) {
    return this.curationService.updateStatus({
      indicatorId: path.id,
      status: body.status,
      userId: user.userId,
      reviewNotes: body.reviewNotes,
    });
  }

  @Patch(MedicineRoutes.BIOLOGICAL_INDICATORS.BY_ID.REVIEW_NOTES)
  updateReviewNotes(
    @Param() path: BiologicalIndicatorIdPath,
    @Body() body: UpdateReviewNotesBody,
  ) {
    return this.curationService.updateReviewNotes({
      indicatorId: path.id,
      reviewNotes: body.reviewNotes,
    });
  }

  @Post(MedicineRoutes.BIOLOGICAL_INDICATORS.BY_ID.REMATCH)
  rematch(
    @Param() path: BiologicalIndicatorIdPath,
    @Body() body: RematchBody,
  ) {
    return this.curationService.rematchIndicator({
      indicatorId: path.id,
      target: body.target,
      dryRun: body.dryRun,
    });
  }

  @Get(MedicineRoutes.BIOLOGICAL_INDICATORS.BY_ID.RISK_LINKS)
  listRiskLinks(@Param() path: BiologicalIndicatorIdPath) {
    return this.curationService.listRiskLinks(path.id);
  }

  @Patch(MedicineRoutes.BIOLOGICAL_INDICATORS.RISK_LINKS.CONFIRM)
  confirmRiskLink(
    @Param() path: BiologicalIndicatorLinkIdPath,
    @Body() body: CurationNotesBody,
    @User() user: UserPayloadDto,
  ) {
    return this.curationService.confirmRiskLink(path.id, user.userId, body.notes);
  }

  @Patch(MedicineRoutes.BIOLOGICAL_INDICATORS.RISK_LINKS.REJECT)
  rejectRiskLink(
    @Param() path: BiologicalIndicatorLinkIdPath,
    @Body() body: CurationNotesBody,
    @User() user: UserPayloadDto,
  ) {
    return this.curationService.rejectRiskLink(path.id, user.userId, body.notes);
  }

  @Patch(MedicineRoutes.BIOLOGICAL_INDICATORS.RISK_LINKS.PRIMARY)
  setPrimaryRiskLink(@Param() path: BiologicalIndicatorLinkIdPath) {
    return this.curationService.setPrimaryRiskLink(path.id);
  }

  @Get(MedicineRoutes.BIOLOGICAL_INDICATORS.BY_ID.EXAM_LINKS)
  listExamLinks(@Param() path: BiologicalIndicatorIdPath) {
    return this.curationService.listExamLinks(path.id);
  }

  @Post(MedicineRoutes.BIOLOGICAL_INDICATORS.BY_ID.EXAM_LINKS)
  createExamLink(
    @Param() path: BiologicalIndicatorIdPath,
    @Body() body: CreateExamLinkBody,
    @User() user: UserPayloadDto,
  ) {
    return this.curationService.createExamLink({
      indicatorId: path.id,
      examId: body.examId,
      userId: user.userId,
      notes: body.notes,
    });
  }

  @Patch(MedicineRoutes.BIOLOGICAL_INDICATORS.EXAM_LINKS.CONFIRM)
  confirmExamLink(
    @Param() path: BiologicalIndicatorLinkIdPath,
    @Body() body: CurationNotesBody,
    @User() user: UserPayloadDto,
  ) {
    return this.curationService.confirmExamLink(path.id, user.userId, body.notes);
  }

  @Patch(MedicineRoutes.BIOLOGICAL_INDICATORS.EXAM_LINKS.REJECT)
  rejectExamLink(
    @Param() path: BiologicalIndicatorLinkIdPath,
    @Body() body: CurationNotesBody,
    @User() user: UserPayloadDto,
  ) {
    return this.curationService.rejectExamLink(path.id, user.userId, body.notes);
  }

  @Patch(MedicineRoutes.BIOLOGICAL_INDICATORS.EXAM_LINKS.DEFAULT)
  setDefaultExamLink(@Param() path: BiologicalIndicatorLinkIdPath) {
    return this.curationService.setDefaultExamLink(path.id);
  }
}
