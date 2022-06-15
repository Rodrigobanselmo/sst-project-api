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
  AddPhotoEnvironmentDto,
} from '../../dto/environment.dto';
import { DeleteEnvironmentService } from '../../services/environment/delete-environment/delete-environment.service';
import { FindAllEnvironmentService } from '../../services/environment/find-all-environment/find-all-environment.service';
import { UpsertEnvironmentService } from '../../services/environment/upsert-environment/upsert-environment.service';
import { AddEnvironmentPhotoService } from '../../services/environment/add-environment-photo/add-environment-photo.service';
import { DeleteEnvironmentPhotoService } from '../../services/environment/delete-environment-photo/delete-environment-photo.service';

@ApiTags('environments')
@Controller('/company/:companyId/workspace/:workspaceId/environments')
export class EnvironmentController {
  constructor(
    private readonly upsertEnvironmentService: UpsertEnvironmentService,
    private readonly findAllEnvironmentService: FindAllEnvironmentService,
    private readonly deleteEnvironmentService: DeleteEnvironmentService,
    private readonly addEnvironmentPhotoService: AddEnvironmentPhotoService,
    private readonly deleteEnvironmentPhotoService: DeleteEnvironmentPhotoService,
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
    @Body() addPhotoEnvironmentDto: AddPhotoEnvironmentDto,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.addEnvironmentPhotoService.execute(
      addPhotoEnvironmentDto,
      userPayloadDto,
      file,
    );
  }

  @Delete('/photo/:id')
  @UseInterceptors(FileInterceptor('file'))
  deletePhoto(@Param('id') id: string) {
    return this.deleteEnvironmentPhotoService.execute(id);
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
