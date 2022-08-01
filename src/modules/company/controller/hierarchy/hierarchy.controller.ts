import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import {
  CreateHierarchyDto,
  CreateSubHierarchyDto,
  UpdateHierarchyDto,
  UpdateSimpleManyHierarchyDto,
  UpsertManyHierarchyDto,
} from '../../dto/hierarchy';
import { FindHierarchyService } from '../../services/hierarchy/find-hierarchy/find-hierarchy.service';
import { CreateHierarchyService } from '../../services/hierarchy/create-hierarchies/create-hierarchies.service';
import { DeleteHierarchyService } from '../../services/hierarchy/delete-hierarchies/delete-hierarchies.service';

import { FindAllHierarchyService } from '../../services/hierarchy/find-all-hierarchies/find-all-hierarchies.service';
import { UpdateHierarchyService } from '../../services/hierarchy/update-hierarchies/update-hierarchies.service';
import { UpsertManyHierarchyService } from '../../services/hierarchy/upsert-many-hierarchies/upsert-many-hierarchies.service';
import { UpdateSimpleManyHierarchyService } from '../../services/hierarchy/update-simple-many-hierarchies /upsert-many-hierarchies.service';
import { CreateSubHierarchyService } from '../../services/hierarchy/create-sub-hierarchies/create-sub-hierarchies.service';

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

  @Get('/:companyId?')
  findAllAvailable(@User() userPayloadDto: UserPayloadDto) {
    return this.findAllHierarchyService.execute(userPayloadDto);
  }

  @Get('/:id/:companyId?')
  findById(@Param('id') id: string, @User() userPayloadDto: UserPayloadDto) {
    return this.findHierarchyService.execute(id, userPayloadDto);
  }

  @Post('/:companyId?')
  create(
    @Body() createHierarchyDto: CreateHierarchyDto,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.createHierarchyService.execute(
      createHierarchyDto,
      userPayloadDto,
    );
  }

  @Patch('/:id/:companyId?')
  update(
    @Body() updateHierarchyDto: UpdateHierarchyDto,
    @Param('id') id: string,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.updateHierarchyService.execute(
      { id, ...updateHierarchyDto },
      userPayloadDto,
    );
  }

  @Post('/upsert-many/:companyId?')
  upsertMany(
    @Body() upsertManyHierarchyDto: UpsertManyHierarchyDto,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.upsertManyHierarchyService.execute(
      upsertManyHierarchyDto.data,
      userPayloadDto,
    );
  }

  @Post('/simple-update-many/:companyId?')
  updateSimpleMany(
    @Body() upsertManyHierarchyDto: UpdateSimpleManyHierarchyDto,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.updateSimpleManyHierarchyService.execute(
      upsertManyHierarchyDto.data,
      userPayloadDto,
    );
  }

  @Delete('/:id/:companyId?')
  delete(@Param('id') id: string, @User() userPayloadDto: UserPayloadDto) {
    return this.deleteHierarchyService.execute(id, userPayloadDto);
  }

  @Post('/sub-office/:companyId?')
  upsert(
    @Body() createSubHierarchyDto: CreateSubHierarchyDto,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.createSubHierarchyService.execute(
      createSubHierarchyDto,
      userPayloadDto,
    );
  }
}
