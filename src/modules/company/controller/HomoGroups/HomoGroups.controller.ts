import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import {
  CopyHomogeneousGroupDto,
  CreateHomoGroupDto,
  FindHomogeneousGroupDto,
  UpdateHierarchyHomoGroupDto,
  UpdateHomoGroupDto,
} from '../../dto/homoGroup';
import { CopyHomoGroupService } from '../../services/homoGroup/copy-homo-group/copy-homo-group.service';
import { CreateHomoGroupService } from '../../services/homoGroup/create-homo-group/create-homo-group.service';
import { DeleteHierarchyHomoGroupService } from '../../services/homoGroup/delete-hierarchy-homo-group/delete-hierarchy-homo-group.service';
import { DeleteHomoGroupService } from '../../services/homoGroup/delete-homo-group/delete-homo-group.service';
import { FindByCompanyHomoGroupService } from '../../services/homoGroup/find-by-company-homo-group/find-by-company-homo-group.service';
import { FindHomogenousGroupByIdService } from '../../services/homoGroup/find-homo-group-by-id/find-homo-group-by-id.service';
import { FindHomogenousGroupService } from '../../services/homoGroup/find-homo-group/find-homo-group.service';
import { UpdateHierarchyHomoGroupService } from '../../services/homoGroup/update-hierarchy-homo-group/update-hierarchy-homo-group.service';
import { UpdateHomoGroupService } from '../../services/homoGroup/update-homo-group/update-homo-group.service';

@Controller('homogeneous-groups')
export class HomoGroupsController {
  constructor(
    private readonly findByCompanyHomoGroupService: FindByCompanyHomoGroupService,
    private readonly findHomogenousGroupService: FindHomogenousGroupService,
    private readonly findHomogenousGroupByIdService: FindHomogenousGroupByIdService,
    private readonly createHomoGroupsService: CreateHomoGroupService,
    private readonly updateHomoGroupsService: UpdateHomoGroupService,
    private readonly deleteHomoGroupsService: DeleteHomoGroupService,
    private readonly copyHomoGroupService: CopyHomoGroupService,
    private readonly updateHierarchyHomoGroupService: UpdateHierarchyHomoGroupService,
    private readonly deleteHierarchyHomoGroupService: DeleteHierarchyHomoGroupService,
  ) {}

  @Permissions({
    code: PermissionEnum.HOMO_GROUP,
    isContract: true,
    isMember: true,
  })
  @Get('/:companyId?')
  find(@Query() query: FindHomogeneousGroupDto, @User() userPayloadDto: UserPayloadDto) {
    return this.findHomogenousGroupService.execute(query, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.HOMO_GROUP,
    isContract: true,
    isMember: true,
  })
  @Get('all/:companyId?')
  findByCompany(@User() userPayloadDto: UserPayloadDto) {
    return this.findByCompanyHomoGroupService.execute(userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.HOMO_GROUP,
    isContract: true,
    isMember: true,
  })
  @Get(':id/:companyId?')
  findById(@Param('id') id: string, @User() userPayloadDto: UserPayloadDto) {
    return this.findHomogenousGroupByIdService.execute(id, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.HOMO_GROUP,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Post('/hierarchy-homo/:companyId')
  updateHierarchyHomo(
    @Body() updateHomoGroupsDto: UpdateHierarchyHomoGroupDto,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.updateHierarchyHomoGroupService.execute({ ...updateHomoGroupsDto }, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.HOMO_GROUP,
    isContract: true,
    isMember: true,
    crud: 'd',
  })
  @Post('/hierarchy-homo-delete/:companyId')
  deleteHierarchyHomo(
    @Body() updateHomoGroupsDto: UpdateHierarchyHomoGroupDto,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.deleteHierarchyHomoGroupService.execute({ ...updateHomoGroupsDto }, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.HOMO_GROUP,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Post()
  create(@Body() createHomoGroupsDto: CreateHomoGroupDto, @User() userPayloadDto: UserPayloadDto) {
    return this.createHomoGroupsService.execute(createHomoGroupsDto, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.HOMO_GROUP,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Patch('/:id/:companyId?')
  update(
    @Body() updateHomoGroupsDto: UpdateHomoGroupDto,
    @Param('id') id: string,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.updateHomoGroupsService.execute({ id, ...updateHomoGroupsDto }, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.HOMO_GROUP,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Delete('/:id/:companyId?')
  delete(@Param('id') id: string, @User() userPayloadDto: UserPayloadDto) {
    return this.deleteHomoGroupsService.execute(id, userPayloadDto);
  }

  @Permissions(
    {
      code: PermissionEnum.HOMO_GROUP,
      isContract: true,
      isMember: true,
      crud: true,
    },
    {
      code: PermissionEnum.RISK_DATA,
      isContract: true,
      isMember: true,
      crud: true,
    },
  )
  @Post('copy/:companyId?')
  @HttpCode(200)
  copy(@Body() createHomoGroupsDto: CopyHomogeneousGroupDto, @User() userPayloadDto: UserPayloadDto) {
    return this.copyHomoGroupService.execute(createHomoGroupsDto, userPayloadDto);
  }
}
