import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import {
  CreateHierarchyDto,
  CreateSubHierarchyDto,
  UpdateHierarchyDto,
  UpdateSimpleManyHierarchyDto,
  UpsertManyHierarchyDto,
} from '../../dto/hierarchy';
import { CreateHierarchyService } from '../../services/hierarchy/create-hierarchies/create-hierarchies.service';
import { CreateSubHierarchyService } from '../../services/hierarchy/create-sub-hierarchies/create-sub-hierarchies.service';
import { DeleteHierarchyService } from '../../services/hierarchy/delete-hierarchies/delete-hierarchies.service';
import { FindAllHierarchyService } from '../../services/hierarchy/find-all-hierarchies/find-all-hierarchies.service';
import { FindHierarchyService } from '../../services/hierarchy/find-hierarchy/find-hierarchy.service';
import { UpdateHierarchyService } from '../../services/hierarchy/update-hierarchies/update-hierarchies.service';
import { UpdateSimpleManyHierarchyService } from '../../services/hierarchy/update-simple-many-hierarchies /upsert-many-hierarchies.service';
import { UpsertManyHierarchyService } from '../../services/hierarchy/upsert-many-hierarchies/upsert-many-hierarchies.service';

@Controller('hierarchy')
export class HierarchyController {
  constructor(
    private readonly findAllHierarchyService: FindAllHierarchyService,
    private readonly createHierarchyService: CreateHierarchyService,
    private readonly updateHierarchyService: UpdateHierarchyService,
    private readonly upsertManyHierarchyService: UpsertManyHierarchyService,
    private readonly deleteHierarchyService: DeleteHierarchyService,
    private readonly findHierarchyService: FindHierarchyService,
    private readonly updateSimpleManyHierarchyService: UpdateSimpleManyHierarchyService,
    private readonly createSubHierarchyService: CreateSubHierarchyService,
  ) {}

  @Permissions(
    {
      code: PermissionEnum.EMPLOYEE,
      isContract: true,
      isMember: true,
    },
    {
      code: PermissionEnum.COMPANY,
      isContract: true,
      isMember: true,
    },
  )
  @Get('/:companyId?')
  findAllAvailable(@User() userPayloadDto: UserPayloadDto) {
    return this.findAllHierarchyService.execute(userPayloadDto);
  }

  @Permissions(
    {
      code: PermissionEnum.EMPLOYEE,
      isContract: true,
      isMember: true,
    },
    {
      code: PermissionEnum.COMPANY,
      isContract: true,
      isMember: true,
    },
  )
  @Get('/:id/:companyId?')
  findById(@Param('id') id: string, @User() userPayloadDto: UserPayloadDto) {
    return this.findHierarchyService.execute(id, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.EMPLOYEE,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Post('/:companyId?')
  create(@Body() createHierarchyDto: CreateHierarchyDto, @User() userPayloadDto: UserPayloadDto) {
    return this.createHierarchyService.execute(createHierarchyDto, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.EMPLOYEE,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Patch('/:id/:companyId?')
  update(
    @Body() updateHierarchyDto: UpdateHierarchyDto,
    @Param('id') id: string,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.updateHierarchyService.execute({ id, ...updateHierarchyDto }, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.EMPLOYEE,
    isContract: true,
    isMember: true,
    crud: 'cu',
  })
  @Post('/upsert-many/:companyId?')
  upsertMany(@Body() upsertManyHierarchyDto: UpsertManyHierarchyDto, @User() userPayloadDto: UserPayloadDto) {
    return this.upsertManyHierarchyService.execute(upsertManyHierarchyDto.data, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.EMPLOYEE,
    isContract: true,
    isMember: true,
    crud: 'u',
  })
  @Post('/simple-update-many/:companyId?')
  updateSimpleMany(
    @Body() upsertManyHierarchyDto: UpdateSimpleManyHierarchyDto,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.updateSimpleManyHierarchyService.execute(upsertManyHierarchyDto.data, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.EMPLOYEE,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Delete('/:id/:companyId?')
  delete(@Param('id') id: string, @User() userPayloadDto: UserPayloadDto) {
    return this.deleteHierarchyService.execute(id, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.EMPLOYEE,
    isContract: true,
    isMember: true,
    crud: 'cu',
  })
  @Post('/sub-office/:companyId?')
  upsert(@Body() createSubHierarchyDto: CreateSubHierarchyDto, @User() userPayloadDto: UserPayloadDto) {
    return this.createSubHierarchyService.execute(createSubHierarchyDto, userPayloadDto);
  }
}
