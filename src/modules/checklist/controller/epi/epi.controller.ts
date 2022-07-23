import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CreateEpiDto, FindEpiDto, UpdateEpiDto } from '../../dto/epi.dto';
import { CreateEpiService } from '../../services/epi/create-epi/create-epi.service';
import { FindByCAEpiService } from '../../services/epi/find-ca-epi /find-ca-epi.service';
import { FindEpiService } from '../../services/epi/find-epi/find-epi.service';
import { UpdateEpiService } from '../../services/epi/update-epi/update-epi.service';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import {
  PermissionEnum,
  RoleEnum,
} from '../../../../shared/constants/enum/authorization';
import { Roles } from '../../../../shared/decorators/roles.decorator';
@Controller('epi')
export class EpiController {
  constructor(
    private readonly createEpiService: CreateEpiService,
    private readonly updateEpiService: UpdateEpiService,
    private readonly findByCAEpiService: FindByCAEpiService,
    private readonly findEpiService: FindEpiService,
  ) {}

  @Permissions({
    code: PermissionEnum.EPI,
    crud: true,
  })
  @Post()
  create(@Body() createEpiDto: CreateEpiDto) {
    return this.createEpiService.execute(createEpiDto);
  }

  @Permissions({
    code: PermissionEnum.EPI,
    crud: true,
  })
  @Patch('/:epiId')
  async update(
    @Param('epiId') epiId: number,
    @Body() updateEpiDto: UpdateEpiDto,
  ) {
    return this.updateEpiService.execute(epiId, updateEpiDto);
  }

  @Roles(RoleEnum.MANAGEMENT, RoleEnum.EPI)
  @Get('/:ca')
  async findByCA(@Param('ca') ca: string) {
    return this.findByCAEpiService.execute(ca);
  }

  @Roles(RoleEnum.MANAGEMENT, RoleEnum.EPI)
  @Get()
  async find(@Query() query: FindEpiDto) {
    return this.findEpiService.execute(query);
  }
}
