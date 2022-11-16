import { Body, Controller, Get, Post } from '@nestjs/common';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { UpsertDocumentPCMSODto } from '../../dto/document-pcmso.dto';
import { FindByIdDocumentPCMSOService } from '../../services/documentPcmso/find-by-id/find-by-id.service';
import { UpsertDocumentPCMSOService } from '../../services/documentPcmso/upsert-document-pcmso/upsert-document-pcmso.service';

@Controller('document-pcmso')
export class DocumentPCMSOController {
  constructor(private readonly upsertDocumentPCMSOService: UpsertDocumentPCMSOService, private readonly findByIdService: FindByIdDocumentPCMSOService) {}

  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: 'cu',
  })
  @Post()
  upsert(@Body() dto: UpsertDocumentPCMSODto) {
    return this.upsertDocumentPCMSOService.execute(dto);
  }

  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
  })
  @Get('/:companyId')
  findById(@User() userPayloadDto: UserPayloadDto) {
    const companyId = userPayloadDto.targetCompanyId;
    return this.findByIdService.execute(companyId);
  }
}
