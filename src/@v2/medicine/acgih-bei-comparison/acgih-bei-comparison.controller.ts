import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { MedicineRoutes } from '@/@v2/medicine/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { RoleEnum } from '@/shared/constants/enum/authorization';
import { Roles } from '@/shared/decorators/roles.decorator';

import {
  BrowseAcgihBeiComparisonQuery,
  ExportAcgihBeiComparisonQuery,
} from './acgih-bei-comparison.dto';
import { AcgihBeiComparisonSpreadsheetExportService } from './acgih-bei-comparison-spreadsheet-export.service';
import { AcgihBeiComparisonService } from './acgih-bei-comparison.service';

const XLSX_CONTENT_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

/**
 * Fase 4E — Comparação ACGIH/BEI × NR-7 × Regras Exame × Risco.
 * SOMENTE LEITURA. Não cria, não altera e não aplica nada em nenhuma base.
 */
@Controller(MedicineRoutes.ACGIH_BEI_COMPARISON.BASE)
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.MASTER)
export class AcgihBeiComparisonController {
  constructor(
    private readonly service: AcgihBeiComparisonService,
    private readonly exportService: AcgihBeiComparisonSpreadsheetExportService,
  ) {}

  @Get(MedicineRoutes.ACGIH_BEI_COMPARISON.EXPORT)
  async export(
    @Query() query: ExportAcgihBeiComparisonQuery,
    @Res() res: Response,
  ) {
    const rows = await this.service.computeForExport({
      search: query.search,
      comparisonStatus: query.comparisonStatus,
      suggestedAction: query.suggestedAction,
      confidence: query.confidence,
    });
    const buffer = await this.exportService.export(rows);
    res.setHeader('Content-Type', XLSX_CONTENT_TYPE);
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="acgih-bei-comparacao.xlsx"',
    );
    res.status(HttpStatus.OK);
    res.send(buffer);
  }

  @Get()
  browse(@Query() query: BrowseAcgihBeiComparisonQuery) {
    return this.service.browse({
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      filters: {
        search: query.search,
        comparisonStatus: query.comparisonStatus,
        suggestedAction: query.suggestedAction,
        confidence: query.confidence,
      },
    });
  }
}
