import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { OccupationalHygieneRoutes } from '@/@v2/occupational-hygiene/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { ALLOWED_ALL_TYPES, MAX_DOCUMENT_SIZE } from '@/@v2/shared/constants/files';
import { createFileValidator } from '@/@v2/shared/utils/file/create-file-validator';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';

import {
  HoCatalogBrowseQuery,
  HoExtractionSolventWritePayload,
  HoLaboratoryWritePayload,
  HoMethodUploadPath,
  HoSamplerWritePayload,
} from './ho-method.dto';
import {
  HoExtractionSolventService,
  HoLaboratoryService,
  HoMethodFileService,
  HoSamplerService,
} from '../ho-catalog.service';

@Controller(OccupationalHygieneRoutes.HO_SAMPLER.BASE)
@UseGuards(JwtAuthGuard)
export class HoSamplerController {
  constructor(private readonly hoSamplerService: HoSamplerService) {}

  @Get()
  @Permissions({ code: PermissionEnum.RISK, crud: 'r' })
  browse(@Query() query: HoCatalogBrowseQuery) {
    return this.hoSamplerService.browse(query.search);
  }

  @Post()
  @Permissions({ code: PermissionEnum.RISK, crud: true, isMember: true })
  create(@Body() body: HoSamplerWritePayload) {
    return this.hoSamplerService.create(body);
  }
}

@Controller(OccupationalHygieneRoutes.HO_EXTRACTION_SOLVENT.BASE)
@UseGuards(JwtAuthGuard)
export class HoExtractionSolventController {
  constructor(
    private readonly hoExtractionSolventService: HoExtractionSolventService,
  ) {}

  @Get()
  @Permissions({ code: PermissionEnum.RISK, crud: 'r' })
  browse(@Query() query: HoCatalogBrowseQuery) {
    return this.hoExtractionSolventService.browse(query.search);
  }

  @Post()
  @Permissions({ code: PermissionEnum.RISK, crud: true, isMember: true })
  create(@Body() body: HoExtractionSolventWritePayload) {
    return this.hoExtractionSolventService.create(body);
  }
}

@Controller(OccupationalHygieneRoutes.HO_LABORATORY.BASE)
@UseGuards(JwtAuthGuard)
export class HoLaboratoryController {
  constructor(private readonly hoLaboratoryService: HoLaboratoryService) {}

  @Get()
  @Permissions({ code: PermissionEnum.RISK, crud: 'r' })
  browse(@Query() query: HoCatalogBrowseQuery) {
    return this.hoLaboratoryService.browse(query.search);
  }

  @Post()
  @Permissions({ code: PermissionEnum.RISK, crud: true, isMember: true })
  create(@Body() body: HoLaboratoryWritePayload) {
    return this.hoLaboratoryService.create(body);
  }
}

@Controller(OccupationalHygieneRoutes.HO_METHOD.UPLOAD)
@UseGuards(JwtAuthGuard)
export class HoMethodUploadController {
  constructor(private readonly hoMethodFileService: HoMethodFileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @Permissions({
    code: PermissionEnum.RISK,
    crud: true,
    isMember: true,
    isContract: true,
  })
  upload(
    @Param() path: HoMethodUploadPath,
    @UploadedFile(
      createFileValidator({
        maxSize: MAX_DOCUMENT_SIZE,
        fileType: ALLOWED_ALL_TYPES,
      }),
    )
    file: any,
  ) {
    if (!file?.originalname?.toLowerCase().endsWith('.pdf')) {
      throw new BadRequestException('Envie um arquivo PDF (.pdf).');
    }

    return this.hoMethodFileService.upload({
      companyId: path.companyId,
      buffer: file.buffer,
      name: file.originalname,
      size: file.size,
    });
  }
}
