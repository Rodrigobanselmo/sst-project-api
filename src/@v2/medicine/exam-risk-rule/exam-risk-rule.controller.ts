import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { MedicineRoutes } from '@/@v2/medicine/constants/routes';
import {
  ALLOWED_UPLOAD_XLSX_TYPES,
  MAX_DOCUMENT_SIZE,
} from '@/@v2/shared/constants/files';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { createFileValidator } from '@/@v2/shared/utils/file/create-file-validator';
import { RoleEnum } from '@/shared/constants/enum/authorization';
import { Roles } from '@/shared/decorators/roles.decorator';
import { User } from '@/shared/decorators/user.decorator';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import {
  BrowseExamRiskRulesQuery,
  CreateExamRiskRuleBody,
  ExamRiskRuleIdPath,
  ImportExamRiskRuleApplyBody,
  SearchExamCandidatesQuery,
  SearchRiskCandidatesQuery,
  UpdateExamRiskRuleBody,
  UpdateExamRiskRuleStatusBody,
} from './exam-risk-rule.dto';
import { ExamRiskRuleImportApplyService } from './exam-risk-rule-import-apply.service';
import { ExamRiskRuleImportPreviewService } from './exam-risk-rule-import-preview.service';
import { ExamRiskRuleNr07SyncService } from './exam-risk-rule-nr07-sync.service';
import { ExamRiskRuleSpreadsheetExportService } from './exam-risk-rule-spreadsheet-export.service';
import { ExamRiskRuleService } from './exam-risk-rule.service';

const XLSX_CONTENT_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

@Controller(MedicineRoutes.EXAM_RISK_RULES.BASE)
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.MASTER)
export class ExamRiskRuleController {
  constructor(
    private readonly service: ExamRiskRuleService,
    private readonly nr07SyncService: ExamRiskRuleNr07SyncService,
    private readonly exportService: ExamRiskRuleSpreadsheetExportService,
    private readonly previewService: ExamRiskRuleImportPreviewService,
    private readonly applyService: ExamRiskRuleImportApplyService,
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

  @Get(MedicineRoutes.EXAM_RISK_RULES.EXPORT)
  async export(@Res() res: Response) {
    const buffer = await this.exportService.exportCurrentBase();
    this.sendWorkbook(res, buffer, 'biblioteca-regras-exame-risco.xlsx');
  }

  @Get(MedicineRoutes.EXAM_RISK_RULES.TEMPLATE)
  async template(@Res() res: Response) {
    const buffer = await this.exportService.buildTemplate();
    this.sendWorkbook(res, buffer, 'modelo-regras-exame-risco.xlsx');
  }

  @Post(MedicineRoutes.EXAM_RISK_RULES.IMPORT_PREVIEW)
  @UseInterceptors(FileInterceptor('file'))
  async importPreview(
    @UploadedFile(
      createFileValidator({
        maxSize: MAX_DOCUMENT_SIZE,
        fileType: ALLOWED_UPLOAD_XLSX_TYPES,
        required: true,
        invalidFileTypeMessage: 'Envie uma planilha Excel .xlsx.',
      }),
    )
    file: { buffer: Buffer; originalname?: string },
  ) {
    if (!file?.buffer?.length) {
      throw new BadRequestException('Arquivo vazio ou inválido.');
    }
    return this.previewService.preview({
      buffer: file.buffer,
      fileName: file.originalname ?? 'planilha.xlsx',
    });
  }

  @Post(MedicineRoutes.EXAM_RISK_RULES.IMPORT_APPLY)
  @UseInterceptors(FileInterceptor('file'))
  async importApply(
    @Body() body: ImportExamRiskRuleApplyBody,
    @User() user: UserPayloadDto,
    @UploadedFile(
      createFileValidator({
        maxSize: MAX_DOCUMENT_SIZE,
        fileType: ALLOWED_UPLOAD_XLSX_TYPES,
        required: true,
        invalidFileTypeMessage: 'Envie uma planilha Excel .xlsx.',
      }),
    )
    file: { buffer: Buffer; originalname?: string },
  ) {
    if (!file?.buffer?.length) {
      throw new BadRequestException('Arquivo vazio ou inválido.');
    }
    if (body.confirmApply !== 'true') {
      throw new BadRequestException(
        'Confirmação explícita (confirmApply) é obrigatória para aplicar a importação.',
      );
    }
    return this.applyService.apply({
      buffer: file.buffer,
      fileName: file.originalname ?? 'planilha.xlsx',
      userId: user.userId,
    });
  }

  private sendWorkbook(res: Response, buffer: Buffer, fileName: string) {
    res.setHeader('Content-Type', XLSX_CONTENT_TYPE);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.status(HttpStatus.OK);
    res.send(buffer);
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
