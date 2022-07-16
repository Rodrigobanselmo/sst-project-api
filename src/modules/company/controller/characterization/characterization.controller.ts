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
  UpsertCharacterizationDto,
  AddPhotoCharacterizationDto,
  UpdatePhotoCharacterizationDto,
} from '../../dto/characterization.dto';
import { DeleteCharacterizationService } from '../../services/characterization/delete-characterization/delete-characterization.service';
import { FindAllCharacterizationService } from '../../services/characterization/find-all-characterization/find-all-characterization.service';
import { UpsertCharacterizationService } from '../../services/characterization/upsert-characterization/upsert-characterization.service';
import { AddCharacterizationPhotoService } from '../../services/characterization/add-characterization-photo/add-characterization-photo.service';
import { DeleteCharacterizationPhotoService } from '../../services/characterization/delete-characterization-photo/delete-characterization-photo.service';
import { FindByIdCharacterizationService } from '../../services/characterization/find-by-id-characterization/find-by-id-characterization.service';
import { UpdateCharacterizationPhotoService } from '../../services/characterization/update-characterization-photo/update-characterization-photo.service';

@ApiTags('characterizations')
@Controller('/company/:companyId/workspace/:workspaceId/characterizations')
export class CharacterizationController {
  constructor(
    private readonly upsertCharacterizationService: UpsertCharacterizationService,
    private readonly findAllCharacterizationService: FindAllCharacterizationService,
    private readonly deleteCharacterizationService: DeleteCharacterizationService,
    private readonly addCharacterizationPhotoService: AddCharacterizationPhotoService,
    private readonly deleteCharacterizationPhotoService: DeleteCharacterizationPhotoService,
    private readonly findByIdCharacterizationService: FindByIdCharacterizationService,
    private readonly updateCharacterizationPhotoService: UpdateCharacterizationPhotoService,
  ) {}

  @Get()
  findAll(
    @User() userPayloadDto: UserPayloadDto,
    @Param('workspaceId') workspaceId: string,
  ) {
    return this.findAllCharacterizationService.execute(
      workspaceId,
      userPayloadDto,
    );
  }

  @Get('/:id')
  findById(@User() userPayloadDto: UserPayloadDto, @Param('id') id: string) {
    return this.findByIdCharacterizationService.execute(id, userPayloadDto);
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('files[]', 5, { fileFilter: pngFileFilter }),
  )
  upsert(
    @Body() upsertCharacterizationDto: UpsertCharacterizationDto,
    @User() userPayloadDto: UserPayloadDto,
    @Param('workspaceId') workspaceId: string,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    return this.upsertCharacterizationService.execute(
      upsertCharacterizationDto,
      workspaceId,
      userPayloadDto,
      files,
    );
  }

  @Post('/photo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadRiskFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() addPhotoCharacterizationDto: AddPhotoCharacterizationDto,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.addCharacterizationPhotoService.execute(
      addPhotoCharacterizationDto,
      userPayloadDto,
      file,
    );
  }

  @Post('/photo/:id')
  async update(
    @Body() updatePhotoCharacterizationDto: UpdatePhotoCharacterizationDto,
    @Param('id') id: string,
  ) {
    return this.updateCharacterizationPhotoService.execute(
      id,
      updatePhotoCharacterizationDto,
    );
  }

  @Delete('/photo/:id')
  @UseInterceptors(FileInterceptor('file'))
  deletePhoto(@Param('id') id: string) {
    return this.deleteCharacterizationPhotoService.execute(id);
  }

  @Delete('/:id')
  delete(
    @Param('id') id: string,
    @Param('workspaceId') workspaceId: string,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.deleteCharacterizationService.execute(
      id,
      workspaceId,
      userPayloadDto,
    );
  }
}
