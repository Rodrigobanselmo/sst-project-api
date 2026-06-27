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
  AcgihBeiIndicatorIdPath,
  BrowseAcgihBeiIndicatorsQuery,
  CreateAcgihBeiIndicatorBody,
  ImportAcgihBeiApplyBody,
  UpdateAcgihBeiIndicatorBody,
  UpdateAcgihBeiIndicatorStatusBody,
} from './acgih-bei-indicator.dto';
import { AcgihBeiIndicatorImportApplyService } from './acgih-bei-indicator-import-apply.service';
import { AcgihBeiIndicatorImportPreviewService } from './acgih-bei-indicator-import-preview.service';
import { AcgihBeiIndicatorSpreadsheetExportService } from './acgih-bei-indicator-spreadsheet-export.service';
import { AcgihBeiIndicatorService } from './acgih-bei-indicator.service';

const XLSX_CONTENT_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

@Controller(MedicineRoutes.ACGIH_BEI_INDICATORS.BASE)
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.MASTER)
export class AcgihBeiIndicatorController {
  constructor(
    private readonly service: AcgihBeiIndicatorService,
    private readonly exportService: AcgihBeiIndicatorSpreadsheetExportService,
    private readonly previewService: AcgihBeiIndicatorImportPreviewService,
    private readonly applyService: AcgihBeiIndicatorImportApplyService,
  ) {}

  @Get(MedicineRoutes.ACGIH_BEI_INDICATORS.EXPORT)
  async export(@Res() res: Response) {
    const buffer = await this.exportService.exportCurrentBase();
    this.sendWorkbook(res, buffer, 'acgih-bei-indicadores.xlsx');
  }

  @Get(MedicineRoutes.ACGIH_BEI_INDICATORS.TEMPLATE)
  async template(@Res() res: Response) {
    const buffer = await this.exportService.buildTemplate();
    this.sendWorkbook(res, buffer, 'modelo-acgih-bei-indicadores.xlsx');
  }

  @Post(MedicineRoutes.ACGIH_BEI_INDICATORS.IMPORT_PREVIEW)
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

  @Post(MedicineRoutes.ACGIH_BEI_INDICATORS.IMPORT_APPLY)
  @UseInterceptors(FileInterceptor('file'))
  async importApply(
    @Body() body: ImportAcgihBeiApplyBody,
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

  @Get()
  browse(@Query() query: BrowseAcgihBeiIndicatorsQuery) {
    return this.service.browse({
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      filters: query,
    });
  }

  @Get(MedicineRoutes.ACGIH_BEI_INDICATORS.BY_ID.PATH)
  getById(@Param() path: AcgihBeiIndicatorIdPath) {
    return this.service.getById(path.id);
  }

  @Post()
  create(
    @Body() body: CreateAcgihBeiIndicatorBody,
    @User() user: UserPayloadDto,
  ) {
    return this.service.create(body, user.userId);
  }

  @Patch(MedicineRoutes.ACGIH_BEI_INDICATORS.BY_ID.PATH)
  update(
    @Param() path: AcgihBeiIndicatorIdPath,
    @Body() body: UpdateAcgihBeiIndicatorBody,
    @User() user: UserPayloadDto,
  ) {
    return this.service.update(path.id, body, user.userId);
  }

  @Patch(MedicineRoutes.ACGIH_BEI_INDICATORS.BY_ID.STATUS)
  updateStatus(
    @Param() path: AcgihBeiIndicatorIdPath,
    @Body() body: UpdateAcgihBeiIndicatorStatusBody,
  ) {
    return this.service.updateStatus(path.id, body.status);
  }

  @Delete(MedicineRoutes.ACGIH_BEI_INDICATORS.BY_ID.PATH)
  softDelete(@Param() path: AcgihBeiIndicatorIdPath) {
    return this.service.softDelete(path.id);
  }
}
