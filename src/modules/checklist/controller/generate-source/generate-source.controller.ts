import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { Permission } from '../../../../shared/constants/enum/authorization';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';

import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import {
  CreateGenerateSourceDto,
  UpdateGenerateSourceDto,
} from '../../dto/generate-source.dto';
import { CreateGenerateSourceService } from '../../services/generate-source/create-generate-source/create-generate-source.service';
import { UpdateGenerateSourceService } from '../../services/generate-source/update-generate-source/update-generate-source.service';

@Controller('generate-source')
export class GenerateSourceController {
  constructor(
    private readonly createGenerateSourceService: CreateGenerateSourceService,
    private readonly updateGenerateSourceService: UpdateGenerateSourceService,
  ) {}

  @Post()
  @Permissions({
    code: Permission.CREATE_RISK,
    isMember: true,
    isContract: true,
  })
  create(
    @User() userPayloadDto: UserPayloadDto,
    @Body() createGenerateSourceDto: CreateGenerateSourceDto,
  ) {
    return this.createGenerateSourceService.execute(
      createGenerateSourceDto,
      userPayloadDto,
    );
  }

  @Patch('/:generateSourceId')
  async update(
    @Param('generateSourceId') generateSourceId: string,
    @User() userPayloadDto: UserPayloadDto,
    @Body() updateRiskDto: UpdateGenerateSourceDto,
  ) {
    return this.updateGenerateSourceService.execute(
      generateSourceId,
      updateRiskDto,
      userPayloadDto,
    );
  }
}
