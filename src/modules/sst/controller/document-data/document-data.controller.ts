import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { UpsertDocumentDataPGRDto } from '../../dto/document-data-pgr.dto';
import { FindOneDocumentDataDto } from '../../dto/document-data.dto';
import { FindByIdDocumentDataService } from '../../services/documentData/find-by-id/find-by-id.service';
import { UpsertDocumentDataService } from '../../services/documentData/upsert-document-data/upsert-document-data.service';
import { UpsertDocumentDataPCMSODto } from '../../dto/document-data-pcmso.dto';

@Controller('document-data/:companyId')
export class DocumentDataController {
  constructor(
    private readonly upsertDocumentDataService: UpsertDocumentDataService,
    private readonly findByIdService: FindByIdDocumentDataService,
  ) {}

  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: 'cu',
  })
  @Post('pgr')
  async upsert(@Body() dto: UpsertDocumentDataPGRDto, @User() user: UserPayloadDto) {
    return await this.upsertDocumentDataService.execute({ ...dto, type: 'PGR' }, user);
  }

  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: 'cu',
  })
  @Post('pcsmo')
  async upsertPcmso(@Body() dto: UpsertDocumentDataPCMSODto, @User() user: UserPayloadDto) {
    return await this.upsertDocumentDataService.execute({ ...dto, type: 'PCSMO' }, user);
  }

  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
  })
  @Get()
  async findById(@Query() query: FindOneDocumentDataDto, @User() userPayloadDto: UserPayloadDto) {
    const companyId = userPayloadDto.targetCompanyId;
    return await this.findByIdService.execute(query, companyId);
  }
}
