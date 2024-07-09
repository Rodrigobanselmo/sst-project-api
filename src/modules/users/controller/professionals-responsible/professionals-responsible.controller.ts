import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateProfessionalResponsibleDto, FindProfessionalResponsibleDto, UpdateProfessionalResponsibleDto } from '../../dto/professional-responsible.dto';
import { CreateProfessionalResponsibleService } from '../../services/professionals-responsibles/create-professionals-responsibles/create-professional-responsiblea.service';
import { DeleteProfessionalResponsibleService } from '../../services/professionals-responsibles/delete-professionals-responsibles/delete-professionals-responsibles.service';
import { FindProfessionalResponsibleService } from '../../services/professionals-responsibles/find-professionals-responsibles/find-professionals-responsibles.service';
import { UpdateProfessionalResponsibleService } from '../../services/professionals-responsibles/update-professionals-responsibles/update-professionals-responsibles.service';

@Controller('company/:companyId/professionals-responsible')
export class ProfessionalResponsibleController {
  constructor(
    private readonly updateProfessionalResponsibleService: UpdateProfessionalResponsibleService,
    private readonly createProfessionalResponsibleService: CreateProfessionalResponsibleService,
    private readonly findAvailableProfessionalResponsibleService: FindProfessionalResponsibleService,
    private readonly deleteProfessionalResponsibleService: DeleteProfessionalResponsibleService,
  ) {}

  @Permissions({
    code: PermissionEnum.PROF_RESP,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Get()
  find(@User() userPayloadDto: UserPayloadDto, @Query() query: FindProfessionalResponsibleDto) {
    return this.findAvailableProfessionalResponsibleService.execute(query, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.PROF_RESP,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Post()
  create(@Body() upsertAccessGroupDto: CreateProfessionalResponsibleDto, @User() userPayloadDto: UserPayloadDto) {
    return this.createProfessionalResponsibleService.execute(upsertAccessGroupDto, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.PROF_RESP,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Patch('/:id')
  update(@Body() upsertAccessGroupDto: UpdateProfessionalResponsibleDto, @User() userPayloadDto: UserPayloadDto, @Param('id', ParseIntPipe) id: number) {
    return this.updateProfessionalResponsibleService.execute({ ...upsertAccessGroupDto, id }, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.PROF_RESP,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Delete('/:id')
  delete(@User() userPayloadDto: UserPayloadDto, @Param('id', ParseIntPipe) id: number) {
    return this.deleteProfessionalResponsibleService.execute(id, userPayloadDto);
  }
}
