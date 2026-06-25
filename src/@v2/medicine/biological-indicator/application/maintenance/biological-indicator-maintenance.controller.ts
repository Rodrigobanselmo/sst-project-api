import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { MedicineRoutes } from '@/@v2/medicine/constants/routes';
import { ALLOWED_UPLOAD_XLSX_TYPES, MAX_DOCUMENT_SIZE } from '@/@v2/shared/constants/files';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { createFileValidator } from '@/@v2/shared/utils/file/create-file-validator';
import { RoleEnum } from '@/shared/constants/enum/authorization';
import { Roles } from '@/shared/decorators/roles.decorator';

import {
  BiologicalIndicatorImportApplyBody,
  BiologicalIndicatorImportPreviewBody,
} from './biological-indicator-maintenance.dto';
import { BiologicalIndicatorImportApplyService } from '../../services/biological-indicator-import-apply.service';
import { BiologicalIndicatorImportPreviewService } from '../../services/biological-indicator-import-preview.service';
import { BiologicalIndicatorSpreadsheetExportService } from '../../services/biological-indicator-spreadsheet-export.service';
import { User } from '@/shared/decorators/user.decorator';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

const XLSX_CONTENT_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

@Controller(MedicineRoutes.BIOLOGICAL_INDICATORS.BASE)
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.MASTER)
export class BiologicalIndicatorMaintenanceController {
  constructor(
    private readonly exportService: BiologicalIndicatorSpreadsheetExportService,
    private readonly previewService: BiologicalIndicatorImportPreviewService,
    private readonly applyService: BiologicalIndicatorImportApplyService,
  ) {}

  @Get(MedicineRoutes.BIOLOGICAL_INDICATORS.EXPORT)
  async export(@Res() res: Response) {
    const buffer = await this.exportService.exportCurrentBase();
    this.sendWorkbook(res, buffer, 'indicadores-nr07-anexo-i.xlsx');
  }

  @Get(MedicineRoutes.BIOLOGICAL_INDICATORS.TEMPLATE)
  async template(@Res() res: Response) {
    const buffer = await this.exportService.buildTemplate();
    this.sendWorkbook(res, buffer, 'modelo-indicadores-nr07-anexo-i.xlsx');
  }

  @Post(MedicineRoutes.BIOLOGICAL_INDICATORS.IMPORT_PREVIEW)
  @UseInterceptors(FileInterceptor('file'))
  async importPreview(
    @Body() body: BiologicalIndicatorImportPreviewBody,
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
      normativeVersion: body.normativeVersion,
    });
  }

  @Post(MedicineRoutes.BIOLOGICAL_INDICATORS.IMPORT_APPLY)
  @UseInterceptors(FileInterceptor('file'))
  async importApply(
    @Body() body: BiologicalIndicatorImportApplyBody,
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
        'Confirmação explícita (confirmApply) é obrigatória para aplicar a atualização.',
      );
    }

    return this.applyService.apply({
      buffer: file.buffer,
      fileName: file.originalname ?? 'planilha.xlsx',
      normativeVersion: body.normativeVersion,
      userId: user.userId,
    });
  }

  private sendWorkbook(res: Response, buffer: Buffer, fileName: string) {
    res.setHeader('Content-Type', XLSX_CONTENT_TYPE);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.status(HttpStatus.OK);
    res.send(buffer);
  }
}
