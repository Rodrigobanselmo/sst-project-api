import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { pngFileFilter } from '../../../../shared/utils/filters/png.filters';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import {
  AddPhotoCharacterizationDto,
  CopyCharacterizationDto,
  UpdatePhotoCharacterizationDto,
  UpsertCharacterizationDto,
} from '../../dto/characterization.dto';
import { CreateImageGalleyService } from '../../services/imageGallery/create-image-gallery/create-image-gallery.service';
import { DeleteImageGalleryService } from '../../services/imageGallery/delete-image-gallery/delete-image-gallery.service';
import { FindImageGalleryService } from '../../services/imageGallery/find-image-gallery/find-image-gallery.service';
import { UpdateImageGalleryService } from '../../services/imageGallery/update-image-gallery/update-image-gallery.service';
import { CreateImageGalleryDto, FindImageGalleryDto, UpdateImageGalleryDto } from '../../dto/imageGallery.dto';
import { readFileSync, readdirSync } from 'fs';
import { asyncBatch } from 'src/shared/utils/asyncBatch';

@Controller('/company/:companyId/image-gallery')
export class ImageGalleryController {
  constructor(
    private readonly findImageGalleryService: FindImageGalleryService,
    private readonly createImageGalleyService: CreateImageGalleyService,
    private readonly deleteImageGalleryService: DeleteImageGalleryService,
    private readonly updateImageGalleryService: UpdateImageGalleryService,
  ) {}

  @Permissions({
    code: PermissionEnum.IMAGE_GALLERY,
    isContract: true,
    isMember: true,
  })
  @Get()
  find(@User() userPayloadDto: UserPayloadDto, @Query() query: FindImageGalleryDto) {
    return this.findImageGalleryService.execute(query, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.IMAGE_GALLERY,
    isContract: true,
    isMember: true,
    crud: 'cu',
  })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadRiskFile(
    @UploadedFile() file: any,
    @Body() body: CreateImageGalleryDto,
    @User() user: UserPayloadDto,
  ) {
    return this.createImageGalleyService.execute(body, user, file);
  }

  @Permissions({
    code: PermissionEnum.IMAGE_GALLERY,
    isContract: true,
    isMember: true,
    crud: 'cu',
  })
  @UseInterceptors(FileInterceptor('file'))
  @Patch('/:id')
  async update(
    @UploadedFile() file: any,
    @Body() body: UpdateImageGalleryDto,
    @User() user: UserPayloadDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.updateImageGalleryService.execute(id, file, body, user);
  }

  @Permissions({
    code: PermissionEnum.IMAGE_GALLERY,
    isContract: true,
    isMember: true,
    crud: 'cu',
  })
  @Delete('/:id')
  deletePhoto(@Param('id', ParseIntPipe) id: number, @User() user: UserPayloadDto) {
    return this.deleteImageGalleryService.execute(id, user.targetCompanyId);
  }
}
