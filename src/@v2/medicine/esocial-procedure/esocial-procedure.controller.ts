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
  Put,
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
  BrowseEsocialProceduresQuery,
  EsocialProcedureCodePath,
  EsocialProcedureIdPath,
  ImportEsocialProcedureApplyBody,
  UpdateEsocialProcedureStatusBody,
  UpsertEsocialProcedureBody,
} from './esocial-procedure.dto';
import { EsocialProcedureImportApplyService } from './esocial-procedure-import-apply.service';
import { EsocialProcedureImportPreviewService } from './esocial-procedure-import-preview.service';
import { EsocialProcedureSpreadsheetExportService } from './esocial-procedure-spreadsheet-export.service';
import { EsocialProcedureService } from './esocial-procedure.service';

const XLSX_CONTENT_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

@Controller(MedicineRoutes.ESOCIAL_PROCEDURES.BASE)
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.MASTER)
export class EsocialProcedureController {
  constructor(
    private readonly service: EsocialProcedureService,
    private readonly exportService: EsocialProcedureSpreadsheetExportService,
    private readonly previewService: EsocialProcedureImportPreviewService,
    private readonly applyService: EsocialProcedureImportApplyService,
  ) {}

  @Get(MedicineRoutes.ESOCIAL_PROCEDURES.EXPORT)
  async export(@Res() res: Response) {
    const buffer = await this.exportService.exportCurrentBase();
    this.sendWorkbook(res, buffer, 'curadoria-procedimentos-esocial.xlsx');
  }

  @Get(MedicineRoutes.ESOCIAL_PROCEDURES.TEMPLATE)
  async template(@Res() res: Response) {
    const buffer = await this.exportService.buildTemplate();
    this.sendWorkbook(res, buffer, 'modelo-curadoria-procedimentos-esocial.xlsx');
  }

  @Post(MedicineRoutes.ESOCIAL_PROCEDURES.IMPORT_PREVIEW)
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

  @Post(MedicineRoutes.ESOCIAL_PROCEDURES.IMPORT_APPLY)
  @UseInterceptors(FileInterceptor('file'))
  async importApply(
    @Body() body: ImportEsocialProcedureApplyBody,
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
  browse(@Query() query: BrowseEsocialProceduresQuery) {
    return this.service.browse({
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      filters: {
        search: query.search,
        status: query.status,
        technicalType: query.technicalType,
        isOccupationalRelevant: query.isOccupationalRelevant,
        onlyCurated: query.onlyCurated,
      },
    });
  }

  @Get(MedicineRoutes.ESOCIAL_PROCEDURES.BY_CODE)
  getByCode(@Param() path: EsocialProcedureCodePath) {
    return this.service.getByCode(path.procedureCode);
  }

  @Put(MedicineRoutes.ESOCIAL_PROCEDURES.BY_CODE)
  upsert(
    @Param() path: EsocialProcedureCodePath,
    @Body() body: UpsertEsocialProcedureBody,
    @User() user: UserPayloadDto,
  ) {
    return this.service.upsertByCode(path.procedureCode, body, user.userId);
  }

  @Patch(MedicineRoutes.ESOCIAL_PROCEDURES.BY_ID.STATUS)
  updateStatus(
    @Param() path: EsocialProcedureIdPath,
    @Body() body: UpdateEsocialProcedureStatusBody,
  ) {
    return this.service.updateStatus(path.id, body.status);
  }

  @Delete(MedicineRoutes.ESOCIAL_PROCEDURES.BY_ID.PATH)
  softDelete(@Param() path: EsocialProcedureIdPath) {
    return this.service.softDelete(path.id);
  }
}
