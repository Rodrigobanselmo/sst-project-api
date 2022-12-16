import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';

import { CreateRiskDto, FindRiskDto, UpdateRiskDto } from '../../dto/risk.dto';
import { CreateRiskService } from '../../services/risk/create-risk/create-risk.service';
import { DeleteSoftRiskService } from '../../services/risk/delete-soft-risk/delete-soft-risk.service';
import { FindAllAvailableRiskService } from '../../services/risk/find-all-available-risk/find-all-available-risk.service';
import { UpdateRiskService } from '../../services/risk/update-risk/update-risk.service';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { PermissionEnum, RoleEnum } from '../../../../shared/constants/enum/authorization';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { FindRisksByCompanyService } from '../../services/risk/find-by-company/find-by-company.service';
import { FindRiskService } from '../../services/risk/find/find.service';
import { FindRiskByIdService } from '../../services/risk/find-one/find-one.service';

@Controller('risk')
export class RiskController {
  constructor(
    private readonly createRiskService: CreateRiskService,
    private readonly updateRiskService: UpdateRiskService,
    private readonly findAllAvailableRiskService: FindAllAvailableRiskService,
    private readonly findRisksByCompanyService: FindRisksByCompanyService,
    private readonly findRiskService: FindRiskService,
    private readonly deleteSoftRiskService: DeleteSoftRiskService,
    private readonly findRiskByIdService: FindRiskByIdService,
  ) {}

  @Permissions({
    code: PermissionEnum.RISK,
    crud: true,
    isMember: true,
  })
  @Post()
  create(@User() userPayloadDto: UserPayloadDto, @Body() createRiskDto: CreateRiskDto) {
    return this.createRiskService.execute(createRiskDto, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.RISK,
    crud: true,
    isMember: true,
  })
  @Patch('/:riskId')
  async update(@Param('riskId') riskId: string, @User() userPayloadDto: UserPayloadDto, @Body() updateRiskDto: UpdateRiskDto) {
    return this.updateRiskService.execute(riskId, updateRiskDto, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.RISK,
    isMember: true,
    isContract: true,
  })
  @Get('company/:companyId?')
  findByCompany(@User() userPayloadDto: UserPayloadDto, @Query() query: FindRiskDto) {
    return this.findRisksByCompanyService.execute(query, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.RISK,
    isMember: true,
    isContract: true,
  })
  @Get('all/:companyId?')
  findAllAvailable(@User() userPayloadDto: UserPayloadDto) {
    return this.findAllAvailableRiskService.execute(userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.RISK,
    isMember: true,
    isContract: true,
  })
  @Get('/:companyId?')
  find(@User() userPayloadDto: UserPayloadDto, @Query() query: FindRiskDto) {
    return this.findRiskService.execute(query, userPayloadDto);
  }

  @Get('/:companyId/:id')
  findOne(@Param('id') id: string, @User() userPayloadDto: UserPayloadDto) {
    return this.findRiskByIdService.execute(id, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.RISK,
    crud: true,
    isMember: true,
  })
  @Delete('/:riskId')
  async deleteSoft(@Param('riskId') riskId: string, @User() userPayloadDto: UserPayloadDto) {
    return this.deleteSoftRiskService.execute(riskId, userPayloadDto);
  }
}
