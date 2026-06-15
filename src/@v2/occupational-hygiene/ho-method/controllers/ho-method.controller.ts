import {
  Body,
  Controller,
  Delete,
  Get,
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

import { OccupationalHygieneRoutes } from '@/@v2/occupational-hygiene/constants/routes';
import { ALLOWED_ALL_TYPES, MAX_DOCUMENT_SIZE } from '@/@v2/shared/constants/files';
import { createFileValidator } from '@/@v2/shared/utils/file/create-file-validator';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';

import { User } from '@/shared/decorators/user.decorator';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import {
  HoMethodBrowseQuery,
  HoMethodPath,
  HoMethodRiskSearchQuery,
  HoMethodWritePayload,
} from './ho-method.dto';
import { HoMethodImportAiReviewPayload } from './ho-method-import-ai-review.payload';
import { HoMethodImportService } from '../import/ho-method-import.service';
import { HoMethodImportAiReviewUseCase } from '../import/ho-method-import-ai-review.usecase';
import { HoMethodRiskSearchService } from '../ho-method-risk-search.service';
import { HoMethodService } from '../ho-method.service';
import { HoMethodWriteInput } from '../ho-method.types';

const mapPayload = (body: HoMethodWritePayload): HoMethodWriteInput => ({
  ...body,
  displayName: body.displayName ?? '',
  originalDocumentUploadedAt: body.originalDocumentUploadedAt
    ? new Date(body.originalDocumentUploadedAt)
    : null,
  evaluationConditions: body.evaluationConditions ?? [],
  agents: (body.agents ?? []).map((agent) => ({
    ...agent,
    evaluationConditions: agent.evaluationConditions ?? [],
  })),
  laboratories: (body.laboratories ?? []).map((lab) => ({
    ...lab,
    lastConfirmationDate: lab.lastConfirmationDate
      ? new Date(lab.lastConfirmationDate)
      : null,
  })),
});

@Controller(OccupationalHygieneRoutes.HO_METHOD.BASE)
@UseGuards(JwtAuthGuard)
export class HoMethodController {
  constructor(
    private readonly hoMethodService: HoMethodService,
    private readonly hoMethodRiskSearchService: HoMethodRiskSearchService,
    private readonly hoMethodImportService: HoMethodImportService,
    private readonly hoMethodImportAiReviewUseCase: HoMethodImportAiReviewUseCase,
  ) {}

  @Get('risk-factors/search')
  @Permissions({
    code: PermissionEnum.RISK,
    crud: 'r',
    isMember: true,
    isContract: true,
  })
  searchRiskFactors(
    @Query() query: HoMethodRiskSearchQuery,
    @User() user: UserPayloadDto,
  ) {
    return this.hoMethodRiskSearchService.search({
      search: query.search,
      companyId: user.targetCompanyId || query.companyId || user.companyId,
      limit: 50,
    });
  }

  @Get()
  @Permissions({
    code: PermissionEnum.RISK,
    crud: 'r',
  })
  browse(@Query() query: HoMethodBrowseQuery) {
    return this.hoMethodService.browse({
      page: query.page,
      limit: query.limit,
      filters: {
        search: query.search,
        agentName: query.agentName,
        cas: query.cas,
        institution: query.institution,
        methodCode: query.methodCode,
        analyticalMethod: query.analyticalMethod,
        evaluationType: query.evaluationType,
        status: query.status,
        prioritized: query.prioritized,
      },
    });
  }

  @Post('import/parse-pdf')
  @UseInterceptors(FileInterceptor('file'))
  @Permissions({
    code: PermissionEnum.RISK,
    crud: 'c',
    isMember: true,
    isContract: true,
  })
  parseImportPdf(
    @UploadedFile(
      createFileValidator({
        maxSize: MAX_DOCUMENT_SIZE,
        fileType: ALLOWED_ALL_TYPES,
      }),
    )
    file: any,
    @User() user: UserPayloadDto,
  ) {
    return this.hoMethodImportService.parsePdf({
      buffer: file.buffer,
      filename: file.originalname,
      companyId: user.targetCompanyId || user.companyId,
    });
  }

  @Post('import/ai-review')
  @Permissions({
    code: PermissionEnum.RISK,
    crud: 'c',
    isMember: true,
    isContract: true,
  })
  reviewImportWithAi(
    @Body() body: HoMethodImportAiReviewPayload,
    @User() user: UserPayloadDto,
  ) {
    return this.hoMethodImportAiReviewUseCase.execute({
      companyId: user.targetCompanyId || body.companyId || user.companyId,
      originalFileName: body.originalFileName,
      parserResult: body.parserResult,
      extractedText: body.extractedText,
      customPrompt: body.customPrompt,
      model: body.model,
      registeredSamplers: body.registeredSamplers,
      registeredExtractionSolvents: body.registeredExtractionSolvents,
    });
  }

  @Post()
  @Permissions({
    code: PermissionEnum.RISK,
    crud: 'c',
  })
  create(@Body() body: HoMethodWritePayload) {
    return this.hoMethodService.create(mapPayload(body));
  }
}

@Controller(OccupationalHygieneRoutes.HO_METHOD.BY_ID)
@UseGuards(JwtAuthGuard)
export class HoMethodByIdController {
  constructor(private readonly hoMethodService: HoMethodService) {}

  @Get()
  @Permissions({
    code: PermissionEnum.RISK,
    crud: 'r',
  })
  read(@Param() path: HoMethodPath) {
    return this.hoMethodService.read(path.id);
  }

  @Get('original-document')
  @Permissions({
    code: PermissionEnum.RISK,
    crud: 'r',
  })
  downloadOriginalDocument(
    @Param() path: HoMethodPath,
    @Res() res: Response,
  ) {
    return this.hoMethodService.streamOriginalDocument(path.id, res);
  }

  @Patch()
  @Permissions({
    code: PermissionEnum.RISK,
    crud: 'u',
  })
  update(@Param() path: HoMethodPath, @Body() body: HoMethodWritePayload, @User() user: UserPayloadDto) {
    return this.hoMethodService.update(path.id, mapPayload(body), user);
  }

  @Delete()
  @Permissions({
    code: PermissionEnum.RISK,
    crud: 'd',
  })
  remove(@Param() path: HoMethodPath) {
    return this.hoMethodService.remove(path.id);
  }
}
