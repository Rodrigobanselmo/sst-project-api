import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import {
  CopyHomogeneousGroupDto,
  CreateHomoGroupDto,
  UpdateHomoGroupDto,
} from '../../dto/homoGroup';
import { CopyHomoGroupService } from '../../services/homoGroup/copy-homo-group/copy-homo-group.service';
import { CreateHomoGroupService } from '../../services/homoGroup/create-homo-group/create-homo-group.service';
import { DeleteHomoGroupService } from '../../services/homoGroup/delete-homo-group/delete-homo-group.service';
import { FindByCompanyHomoGroupService } from '../../services/homoGroup/find-by-company-homo-group/find-by-company-homo-group.service';
import { UpdateHomoGroupService } from '../../services/homoGroup/update-homo-group/update-homo-group.service';

@Controller('homogeneous-groups')
export class HomoGroupsController {
  constructor(
    private readonly findByCompanyHomoGroupService: FindByCompanyHomoGroupService,
    private readonly createHomoGroupsService: CreateHomoGroupService,
    private readonly updateHomoGroupsService: UpdateHomoGroupService,
    private readonly deleteHomoGroupsService: DeleteHomoGroupService,
    private readonly copyHomoGroupService: CopyHomoGroupService,
  ) {}

  @Get('/:companyId?')
  findByCompany(@User() userPayloadDto: UserPayloadDto) {
    return this.findByCompanyHomoGroupService.execute(userPayloadDto);
  }

  @Post()
  create(
    @Body() createHomoGroupsDto: CreateHomoGroupDto,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.createHomoGroupsService.execute(
      createHomoGroupsDto,
      userPayloadDto,
    );
  }

  @Patch('/:id/:companyId?')
  update(
    @Body() updateHomoGroupsDto: UpdateHomoGroupDto,
    @Param('id') id: string,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.updateHomoGroupsService.execute(
      { id, ...updateHomoGroupsDto },
      userPayloadDto,
    );
  }

  @Delete('/:id/:companyId?')
  delete(@Param('id') id: string, @User() userPayloadDto: UserPayloadDto) {
    return this.deleteHomoGroupsService.execute(id, userPayloadDto);
  }

  @Post('copy/:companyId?')
  @HttpCode(200)
  copy(
    @Body() createHomoGroupsDto: CopyHomogeneousGroupDto,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.copyHomoGroupService.execute(
      createHomoGroupsDto,
      userPayloadDto,
    );
  }
}
