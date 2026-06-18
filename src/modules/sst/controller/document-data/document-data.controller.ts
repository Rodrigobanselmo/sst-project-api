import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { UpsertDocumentDataPGRDto } from '../../dto/document-data-pgr.dto';
import { FindOneDocumentDataDto } from '../../dto/document-data.dto';
import { FindByIdDocumentDataService } from '../../services/documentData/find-by-id/find-by-id.service';
import { UpsertDocumentDataService } from '../../services/documentData/upsert-document-data/upsert-document-data.service';
import { UpsertDocumentDataPCMSODto } from '../../dto/document-data-pcmso.dto';
import { ResetUnofficialDocumentVersionsService } from '../../services/documentData/reset-unofficial-versions/reset-unofficial-versions.service';
import { ResetOfficialDocumentSeriesService } from '../../services/documentData/reset-official-series/reset-official-series.service';

@Controller('document-data/:companyId')
export class DocumentDataController {
  constructor(
    private readonly upsertDocumentDataService: UpsertDocumentDataService,
    private readonly findByIdService: FindByIdDocumentDataService,
    private readonly resetUnofficialDocumentVersionsService: ResetUnofficialDocumentVersionsService,
    private readonly resetOfficialDocumentSeriesService: ResetOfficialDocumentSeriesService,
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
    crud: 'cu',
  })
  @Post('periculosidade')
  async upsertPericulosidade(@Body() dto: UpsertDocumentDataPCMSODto, @User() user: UserPayloadDto) {
    return await this.upsertDocumentDataService.execute({ ...dto, type: 'PERICULOSIDADE' }, user);
  }

  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: 'cu',
  })
  @Post('ltcat')
  async upsertLtcat(@Body() dto: UpsertDocumentDataPCMSODto, @User() user: UserPayloadDto) {
    return await this.upsertDocumentDataService.execute({ ...dto, type: 'LTCAT' }, user);
  }

  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: 'cu',
  })
  @Post('insalubridade')
  async upsertInsalubridade(@Body() dto: UpsertDocumentDataPCMSODto, @User() user: UserPayloadDto) {
    return await this.upsertDocumentDataService.execute({ ...dto, type: 'INSALUBRIDADE' }, user);
  }

  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: 'cu',
  })
  @Post('frps')
  async upsertFrps(@Body() dto: UpsertDocumentDataPCMSODto, @User() user: UserPayloadDto) {
    return await this.upsertDocumentDataService.execute({ ...dto, type: 'FRPS' }, user);
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

  @Permissions(
    {
      code: PermissionEnum.PGR,
      isMember: true,
      isContract: true,
    },
    {
      code: PermissionEnum.PCMSO,
      isMember: true,
      isContract: true,
    },
  )
  @Post(':documentDataId/reset-unofficial-versions')
  async resetUnofficialVersions(
    @Param('documentDataId') documentDataId: string,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.resetUnofficialDocumentVersionsService.execute(
      documentDataId,
      userPayloadDto,
    );
  }

  @Permissions(
    {
      code: PermissionEnum.PGR,
      isMember: true,
      isContract: true,
    },
    {
      code: PermissionEnum.PCMSO,
      isMember: true,
      isContract: true,
    },
  )
  @Post(':documentDataId/reset-official-series')
  async resetOfficialSeries(
    @Param('documentDataId') documentDataId: string,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.resetOfficialDocumentSeriesService.execute(
      documentDataId,
      userPayloadDto,
    );
  }
}
