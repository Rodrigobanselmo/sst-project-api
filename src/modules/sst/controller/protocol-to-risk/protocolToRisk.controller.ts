import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import {
  CopyProtocolToRiskDto,
  CreateProtocolToRiskDto,
  FindProtocolToRiskDto,
  UpdateProtocolToRiskDto,
} from '../../dto/protocol-to-risk.dto';
import { CopyProtocolToRiskService } from '../../services/protocolToRisk/copy-protocol/copy-protocol.service';
import { CreateProtocolToRiskService } from '../../services/protocolToRisk/create-protocol/create-protocol.service';
import { FindProtocolToRiskService } from '../../services/protocolToRisk/find-protocol/find-protocol.service';
import { UpdateProtocolToRiskService } from '../../services/protocolToRisk/update-protocol/update-protocol.service';

@Controller('protocol/risk')
export class ProtocolToRiskController {
  constructor(
    private readonly createProtocolToService: CreateProtocolToRiskService,
    private readonly findProtocolToService: FindProtocolToRiskService,
    private readonly updateProtocolToService: UpdateProtocolToRiskService,
    private readonly copyProtocolToRiskService: CopyProtocolToRiskService,
  ) {}

  @Permissions({
    code: PermissionEnum.PROTOCOL,
    crud: true,
    isMember: true,
    isContract: true,
  })
  @Post()
  create(@User() userPayloadDto: UserPayloadDto, @Body() createProtocolToDto: CreateProtocolToRiskDto) {
    return this.createProtocolToService.execute(createProtocolToDto, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.PROTOCOL,
    crud: true,
    isMember: true,
    isContract: true,
  })
  @Post('copy')
  copy(@User() userPayloadDto: UserPayloadDto, @Body() createProtocolToDto: CopyProtocolToRiskDto) {
    return this.copyProtocolToRiskService.execute(createProtocolToDto, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.PROTOCOL,
    crud: true,
    isMember: true,
    isContract: true,
  })
  @Patch('/:id/:companyId')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @User() userPayloadDto: UserPayloadDto,
    @Body() updateRiskDto: UpdateProtocolToRiskDto,
  ) {
    return this.updateProtocolToService.execute(id, updateRiskDto, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.PROTOCOL,
    isMember: true,
    isContract: true,
  })
  @Get('/:companyId?')
  findAllAvailable(@User() userPayloadDto: UserPayloadDto, @Query() query: FindProtocolToRiskDto) {
    return this.findProtocolToService.execute(query, userPayloadDto);
  }
}
