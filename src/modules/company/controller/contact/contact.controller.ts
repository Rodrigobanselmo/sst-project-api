import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateContactDto, FindContactDto, UpdateContactDto } from '../../dto/contact.dto';
import { CreateContactsService } from '../../services/contact/create-contact/create-contact.service';
import { DeleteContactsService } from '../../services/contact/delete-contact/delete-contact.service';
import { FindContactsService } from '../../services/contact/find-contact/find-company-groups-group.service';
import { UpdateContactsService } from '../../services/contact/update-contact/update-contact.service';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { PermissionEnum, RoleEnum } from '../../../../shared/constants/enum/authorization';
import { Roles } from '../../../../shared/decorators/roles.decorator';

@ApiTags('contact')
@Controller('company/:companyId/contact')
export class ContactController {
  constructor(
    private readonly updateContactsService: UpdateContactsService,
    private readonly createContactsService: CreateContactsService,
    private readonly findAvailableContactsService: FindContactsService,
    private readonly deleteContactsService: DeleteContactsService,
  ) { }

  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Get()
  find(@User() userPayloadDto: UserPayloadDto, @Query() query: FindContactDto) {
    return this.findAvailableContactsService.execute({ ...query, companyId: userPayloadDto.targetCompanyId }, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Post()
  create(@Body() upsertAccessGroupDto: CreateContactDto, @User() userPayloadDto: UserPayloadDto) {
    return this.createContactsService.execute(upsertAccessGroupDto, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Patch('/:id')
  update(@Body() upsertAccessGroupDto: UpdateContactDto, @User() userPayloadDto: UserPayloadDto, @Param('id', ParseIntPipe) id: number) {
    return this.updateContactsService.execute({ ...upsertAccessGroupDto, id }, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Delete('/:id')
  delete(@User() userPayloadDto: UserPayloadDto, @Param('id', ParseIntPipe) id: number) {
    return this.deleteContactsService.execute(id, userPayloadDto);
  }
}
