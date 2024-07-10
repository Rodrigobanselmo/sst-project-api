import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';

import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateProtocolDto, FindProtocolDto, UpdateProtocolDto, UpdateProtocolRiskDto } from '../../dto/protocol.dto';
import { CreateProtocolsService } from '../../services/protocol/create-protocol/create-protocol.service';
import { DeleteSoftProtocolsService } from '../../services/protocol/delete-protocol/delete-protocol.service';
import { FindProtocolsService } from '../../services/protocol/find-protocol/find-protocol.service';
import { UpdateProtocolsService } from '../../services/protocol/update-protocol/update-protocol.service';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { PermissionEnum, RoleEnum } from '../../../../shared/constants/enum/authorization';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { UpdateRiskProtocolsService } from '../../services/protocol/update-risk-protocol/update-risk-protocol.service';

@Controller('protocol')
export class ProtocolController {
  constructor(
    private readonly updateProtocolsService: UpdateProtocolsService,
    private readonly createProtocolsService: CreateProtocolsService,
    private readonly findAvailableProtocolsService: FindProtocolsService,
    private readonly deleteSoftExamService: DeleteSoftProtocolsService,
    private readonly updateRiskProtocolsService: UpdateRiskProtocolsService,
  ) {}

  @Permissions({
    code: PermissionEnum.PROTOCOL,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Get('/:companyId?')
  find(@User() userPayloadDto: UserPayloadDto, @Query() query: FindProtocolDto) {
    return this.findAvailableProtocolsService.execute(query, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.PROTOCOL,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Post()
  create(@Body() upsertAccessGroupDto: CreateProtocolDto, @User() userPayloadDto: UserPayloadDto) {
    return this.createProtocolsService.execute(upsertAccessGroupDto, userPayloadDto);
  }

  // @Permissions(
  //   {
  //     code: PermissionEnum.PROTOCOL,
  //     isContract: true,
  //     isMember: true,
  //     crud: true,
  //   },
  //   {
  //     code: PermissionEnum.EXAM,
  //     isContract: true,
  //     isMember: true,
  //     crud: true,
  //   },
  // )
  // @Patch('/add-risks')
  // updateRisks(@Body() upsertAccessGroupDto: UpdateProtocolRiskDto, @User() userPayloadDto: UserPayloadDto) {
  //   return this.updateRiskProtocolsService.execute({ ...upsertAccessGroupDto }, userPayloadDto);
  // }

  @Permissions({
    code: PermissionEnum.PROTOCOL,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Patch('/:id/:companyId')
  update(
    @Body() upsertAccessGroupDto: UpdateProtocolDto,
    @User() userPayloadDto: UserPayloadDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.updateProtocolsService.execute({ ...upsertAccessGroupDto, id }, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.PROTOCOL,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Delete('/:id/:companyId')
  deleteSoft(@User() userPayloadDto: UserPayloadDto, @Param('id', ParseIntPipe) id: number) {
    return this.deleteSoftExamService.execute(id, userPayloadDto);
  }
}
