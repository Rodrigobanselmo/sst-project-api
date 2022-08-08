import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import {
  CreateContactDto,
  FindContactDto,
  UpdateContactDto,
} from '../../dto/contact.dto';
import { CreateContactsService } from '../../services/contact/create-contact/create-contact.service';
import { DeleteContactsService } from '../../services/contact/delete-contact/delete-contact.service';
import { FindContactsService } from '../../services/contact/find-contact/find-company-groups-group.service';
import { UpdateContactsService } from '../../services/contact/update-contact/update-contact.service';

@ApiTags('contact')
@Controller('company/:companyId/contact')
export class ContactController {
  constructor(
    private readonly updateContactsService: UpdateContactsService,
    private readonly createContactsService: CreateContactsService,
    private readonly findAvailableContactsService: FindContactsService,
    private readonly deleteContactsService: DeleteContactsService,
  ) {}

  @Get()
  find(@User() userPayloadDto: UserPayloadDto, @Query() query: FindContactDto) {
    return this.findAvailableContactsService.execute(query, userPayloadDto);
  }

  @Post()
  create(
    @Body() upsertAccessGroupDto: CreateContactDto,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.createContactsService.execute(
      upsertAccessGroupDto,
      userPayloadDto,
    );
  }

  @Patch('/:id')
  update(
    @Body() upsertAccessGroupDto: UpdateContactDto,
    @User() userPayloadDto: UserPayloadDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.updateContactsService.execute(
      { ...upsertAccessGroupDto, id },
      userPayloadDto,
    );
  }

  @Delete('/:id')
  delete(
    @User() userPayloadDto: UserPayloadDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.deleteContactsService.execute(id, userPayloadDto);
  }
}
