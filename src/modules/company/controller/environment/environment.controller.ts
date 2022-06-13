import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { pngFileFilter } from '../../../../shared/utils/filters/png.filters';

import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import {
  UpsertEnvironmentDto,
  UpsertPhotoEnvironmentDto,
} from '../../dto/environment.dto';
import { DeleteEnvironmentService } from '../../services/environment/delete-environment/delete-environment.service';
import { FindAllEnvironmentService } from '../../services/environment/find-all-environment/find-all-environment.service';
import { UpsertEnvironmentService } from '../../services/environment/upsert-environment/upsert-environment.service';

@ApiTags('environments')
@Controller('/company/:companyId/workspace/:workspaceId/environments')
export class EnvironmentController {
  constructor(
    private readonly upsertEnvironmentService: UpsertEnvironmentService,
    private readonly findAllEnvironmentService: FindAllEnvironmentService,
    private readonly deleteEnvironmentService: DeleteEnvironmentService,
  ) {}

  @Get()
  findAll(
    @User() userPayloadDto: UserPayloadDto,
    @Param('workspaceId') workspaceId: string,
  ) {
    return this.findAllEnvironmentService.execute(workspaceId, userPayloadDto);
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('files[]', 5, { fileFilter: pngFileFilter }),
  )
  upsert(
    @Body() upsertEnvironmentDto: UpsertEnvironmentDto,
    @User() userPayloadDto: UserPayloadDto,
    @Param('workspaceId') workspaceId: string,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    return this.upsertEnvironmentService.execute(
      upsertEnvironmentDto,
      workspaceId,
      userPayloadDto,
      files,
    );
  }

  @Post('/photo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadRiskFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() upsertPhotoEnvironmentDto: UpsertPhotoEnvironmentDto,
    @User() userPayloadDto: UserPayloadDto,
    @Param('workspaceId') workspaceId: string,
  ) {
    return upsertPhotoEnvironmentDto;
  }

  @Delete('/photo')
  @UseInterceptors(FileInterceptor('file'))
  deletePhoto(
    @Param('id') id: string,
    @Param('workspaceId') workspaceId: string,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.deleteEnvironmentService.execute(
      id,
      workspaceId,
      userPayloadDto,
    );
  }

  @Delete('/:id')
  delete(
    @Param('id') id: string,
    @Param('workspaceId') workspaceId: string,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.deleteEnvironmentService.execute(
      id,
      workspaceId,
      userPayloadDto,
    );
  }
}
