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
  UpdateHierarchyDto,
  UpsertManyHierarchyDto,
} from '../../dto/hierarchy';
import { CreateHierarchyService } from '../../services/hierarchy/create-hierarchies/create-hierarchies.service';
import { DeleteHierarchyService } from '../../services/hierarchy/delete-hierarchies/delete-hierarchies.service';

import { FindAllHierarchyService } from '../../services/hierarchy/find-all-hierarchies/find-all-hierarchies.service';
import { UpdateHierarchyService } from '../../services/hierarchy/update-hierarchies/update-hierarchies.service';
import { UpsertManyHierarchyService } from '../../services/hierarchy/upsert-many-hierarchies/upsert-many-hierarchies.service';

@Controller('hierarchy')
export class HierarchyController {
  constructor(
    private readonly findAllHierarchyService: FindAllHierarchyService,
    private readonly createHierarchyService: CreateHierarchyService,
    private readonly updateHierarchyService: UpdateHierarchyService,
    private readonly upsertManyHierarchyService: UpsertManyHierarchyService,
    private readonly deleteHierarchyService: DeleteHierarchyService,
  ) {}

  @Get('/:companyId?')
  findAllAvailable(@User() userPayloadDto: UserPayloadDto) {
    return this.findAllHierarchyService.execute(userPayloadDto);
  }

  @Post('')
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

  @Post('upsert-many')
  upsertMany(
    @Body() upsertManyHierarchyDto: UpsertManyHierarchyDto,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.upsertManyHierarchyService.execute(
      upsertManyHierarchyDto.data,
      userPayloadDto,
    );
  }

  @Delete('/:id/:companyId?')
  delete(@Param('id') id: string, @User() userPayloadDto: UserPayloadDto) {
    return this.deleteHierarchyService.execute(id, userPayloadDto);
  }
}
