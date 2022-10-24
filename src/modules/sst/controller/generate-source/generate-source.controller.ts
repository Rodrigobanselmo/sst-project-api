import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import {
  CreateGenerateSourceDto,
  UpdateGenerateSourceDto,
} from '../../dto/generate-source.dto';
import { CreateGenerateSourceService } from '../../services/generate-source/create-generate-source/create-generate-source.service';
import { DeleteSoftGenerateSourceService } from '../../services/generate-source/delete-soft-generate-source/delete-soft-generate-source.service';
import { UpdateGenerateSourceService } from '../../services/generate-source/update-generate-source/update-generate-source.service';

@Controller('generate-source')
export class GenerateSourceController {
  constructor(
    private readonly createGenerateSourceService: CreateGenerateSourceService,
    private readonly updateGenerateSourceService: UpdateGenerateSourceService,
    private readonly deleteSoftGenerateSourceService: DeleteSoftGenerateSourceService,
  ) {}

  @Permissions({
    code: PermissionEnum.GS,
    crud: true,
    isMember: true,
  })
  @Post()
  create(
    @User() userPayloadDto: UserPayloadDto,
    @Body() createGenerateSourceDto: CreateGenerateSourceDto,
  ) {
    return this.createGenerateSourceService.execute(
      createGenerateSourceDto,
      userPayloadDto,
    );
  }

  @Permissions({
    code: PermissionEnum.GS,
    crud: true,
    isMember: true,
  })
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

  @Permissions({
    code: PermissionEnum.GS,
    crud: true,
    isMember: true,
  })
  @Delete('/:generateSourceId')
  async deleteSoft(
    @Param('generateSourceId') generateSourceId: string,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.deleteSoftGenerateSourceService.execute(
      generateSourceId,
      userPayloadDto,
    );
  }
}
