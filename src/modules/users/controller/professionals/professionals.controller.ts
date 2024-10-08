import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { instanceToInstance } from 'class-transformer';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateProfessionalDto, FindProfessionalsDto, UpdateProfessionalDto } from '../../dto/professional.dto';
import { CreateProfessionalService } from '../../services/professionals/create-professional/create-professional.service';
import { FindAllProfessionalsByCompanyService } from '../../services/professionals/find-all/find-all.service';
import { FindFirstProfessionalService } from '../../services/professionals/find-first/find-first.service';
import { UpdateProfessionalService } from '../../services/professionals/update-professional/update-professional.service';

@Controller('professionals')
export class ProfessionalsController {
  constructor(
    private readonly findAllByCompanyService: FindAllProfessionalsByCompanyService,
    private readonly createProfessionalService: CreateProfessionalService,
    private readonly updateProfessionalService: UpdateProfessionalService,
    private readonly findFirstProfessionalService: FindFirstProfessionalService,
  ) {}

  @Permissions(
    {
      code: PermissionEnum.PROFESSIONALS,
      isMember: true,
      isContract: true,
    },
    {
      code: PermissionEnum.USER,
      isMember: true,
      isContract: true,
    },
  )
  @Get('/company/:companyId?')
  findAllByCompany(@User() userPayloadDto: UserPayloadDto, @Query() query: FindProfessionalsDto) {
    return instanceToInstance(this.findAllByCompanyService.execute(query, userPayloadDto));
  }

  @Permissions(
    {
      code: PermissionEnum.PROFESSIONALS,
    },
    {
      code: PermissionEnum.USER,
    },
  )
  @Get('/find')
  findFirst(@Query() query: FindProfessionalsDto) {
    return instanceToInstance(this.findFirstProfessionalService.execute(query));
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
  @Post()
  async create(@Body() createProfessionalDto: CreateProfessionalDto, @User() user: UserPayloadDto) {
    return this.createProfessionalService.execute(createProfessionalDto, user);
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
  async update(
    @Body() updateProfessionalDto: UpdateProfessionalDto,
    @User() user: UserPayloadDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.updateProfessionalService.execute({ id, ...updateProfessionalDto }, user);
  }
}
