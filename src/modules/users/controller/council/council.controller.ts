import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { classToClass } from 'class-transformer';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateCouncilDto, UpdateCouncilDto } from '../../dto/council.dto';
import { CreateCouncilService } from '../../services/professionals/create-council/create-council.service';
import { DeleteCouncilService } from '../../services/professionals/delete-council/delete-council.service';
import { UpdateCouncilService } from '../../services/professionals/update-council/update-council.service';

@ApiTags('councils')
@Controller('/:companyId/councils')
export class CouncilController {
  constructor(
    private readonly createCouncilService: CreateCouncilService,
    private readonly updateCouncilService: UpdateCouncilService,
    private readonly deleteCouncilService: DeleteCouncilService,
  ) {}

  @Permissions(
    {
      code: PermissionEnum.USER,
      isMember: true,
      isContract: true,
      crud: true,
    },
    {
      code: PermissionEnum.PROFESSIONALS,
      isMember: true,
      isContract: true,
      crud: true,
    },
  )
  @Post()
  async create(@Body() body: CreateCouncilDto, @User() user: UserPayloadDto) {
    return this.createCouncilService.execute(body, user);
  }

  @Permissions(
    {
      code: PermissionEnum.USER,
      isMember: true,
      isContract: true,
      crud: true,
    },
    {
      code: PermissionEnum.PROFESSIONALS,
      isMember: true,
      isContract: true,
      crud: true,
    },
  )
  @Patch('/:id')
  async update(@Body() body: UpdateCouncilDto, @User() user: UserPayloadDto, @Param('id', ParseIntPipe) id: number) {
    return this.updateCouncilService.execute({ id, ...body }, user);
  }

  @Permissions(
    {
      code: PermissionEnum.PROFESSIONALS,
      isMember: true,
      crud: true,
    },
    {
      code: PermissionEnum.USER,
      isMember: true,
      crud: true,
    },
  )
  @Delete('/:professionalId/:id')
  delete(@Param('id', ParseIntPipe) id: number, @Param('professionalId', ParseIntPipe) professionalId: number) {
    return classToClass(this.deleteCouncilService.execute(id, professionalId));
  }
}
