import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { pngFileFilter } from "../../../../shared/utils/filters/png.filters";

import { User } from "../../../../shared/decorators/user.decorator";
import { UserPayloadDto } from "../../../../shared/dto/user-payload.dto";
import {
  UpsertCharacterizationDto,
  AddPhotoCharacterizationDto,
  UpdatePhotoCharacterizationDto,
  CopyCharacterizationDto,
  AddFileCharacterizationDto,
} from "../../dto/characterization.dto";
import { DeleteCharacterizationService } from "../../services/characterization/delete-characterization/delete-characterization.service";
import { FindAllCharacterizationService } from "../../services/characterization/find-all-characterization/find-all-characterization.service";
import { UpsertCharacterizationService } from "../../services/characterization/upsert-characterization/upsert-characterization.service";
import { AddCharacterizationPhotoService } from "../../services/characterization/add-characterization-photo/add-characterization-photo.service";
import { DeleteCharacterizationPhotoService } from "../../services/characterization/delete-characterization-photo/delete-characterization-photo.service";
import { FindByIdCharacterizationService } from "../../services/characterization/find-by-id-characterization/find-by-id-characterization.service";
import { UpdateCharacterizationPhotoService } from "../../services/characterization/update-characterization-photo/update-characterization-photo.service";
import { Permissions } from "../../../../shared/decorators/permissions.decorator";
import {
  PermissionEnum,
  RoleEnum,
} from "../../../../shared/constants/enum/authorization";
import { Roles } from "../../../../shared/decorators/roles.decorator";
import { CopyCharacterizationService } from "../../services/characterization/copy-characterization/copy-characterization.service";
import { AddCharacterizationFileService } from "../../services/characterization/add-characterization-file/add-characterization-file.service";

@Controller("/company/:companyId/workspace/:workspaceId/characterizations")
export class CharacterizationController {
  constructor(
    private readonly upsertCharacterizationService: UpsertCharacterizationService,
    private readonly findAllCharacterizationService: FindAllCharacterizationService,
    private readonly deleteCharacterizationService: DeleteCharacterizationService,
    private readonly addCharacterizationPhotoService: AddCharacterizationPhotoService,
    private readonly addCharacterizationFileService: AddCharacterizationFileService,
    private readonly deleteCharacterizationPhotoService: DeleteCharacterizationPhotoService,
    private readonly findByIdCharacterizationService: FindByIdCharacterizationService,
    private readonly updateCharacterizationPhotoService: UpdateCharacterizationPhotoService,
    private readonly copyCharacterizationService: CopyCharacterizationService,
  ) {}

  @Permissions({
    code: PermissionEnum.CHARACTERIZATION,
    isContract: true,
    isMember: true,
  })
  @Get()
  findAll(
    @User() userPayloadDto: UserPayloadDto,
    @Param("workspaceId") workspaceId: string,
  ) {
    return this.findAllCharacterizationService.execute(
      workspaceId,
      userPayloadDto,
    );
  }

  @Permissions({
    code: PermissionEnum.CHARACTERIZATION,
    isContract: true,
    isMember: true,
  })
  @Get("/:id")
  findById(@User() userPayloadDto: UserPayloadDto, @Param("id") id: string) {
    return this.findByIdCharacterizationService.execute(id, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.CHARACTERIZATION,
    isContract: true,
    isMember: true,
    crud: "cu",
  })
  @Post()
  @UseInterceptors(
    FilesInterceptor("files[]", 20, { fileFilter: pngFileFilter }),
  )
  upsert(
    @Body() body: UpsertCharacterizationDto,
    @User() userPayloadDto: UserPayloadDto,
    @Param("workspaceId") workspaceId: string,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    if ("considerations" in body)
      body.considerations = body.considerations.filter((item) => item !== "");
    if ("activities" in body)
      body.activities = body.activities.filter((item) => item !== "");
    if ("paragraphs" in body)
      body.paragraphs = body.paragraphs.filter((item) => item !== "");
    if ("hierarchyIds" in body)
      body.hierarchyIds = body.hierarchyIds.filter((item) => item !== "");
    if ("photos" in body)
      body.photos = body.photos.filter((item) => item !== "");
    return this.upsertCharacterizationService.execute(
      body,
      workspaceId,
      userPayloadDto,
      files,
    );
  }

  @Permissions({
    code: PermissionEnum.CHARACTERIZATION,
    isContract: true,
    isMember: true,
    crud: "cu",
  })
  @Post("/photo")
  @UseInterceptors(FileInterceptor("file"))
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

  @Permissions({
    code: PermissionEnum.CHARACTERIZATION,
    isContract: true,
    isMember: true,
    crud: "cu",
  })
  @UseInterceptors(FileInterceptor("file"))
  @Patch("/photo/:id")
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Body() updatePhotoCharacterizationDto: UpdatePhotoCharacterizationDto,
    @User() userPayloadDto: UserPayloadDto,
    @Param("id") id: string,
  ) {
    return this.updateCharacterizationPhotoService.execute(
      id,
      file,
      updatePhotoCharacterizationDto,
      userPayloadDto,
    );
  }

  @Permissions({
    code: PermissionEnum.CHARACTERIZATION,
    isContract: true,
    isMember: true,
    crud: "cu",
  })
  @Post("/files")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFiles(
    @UploadedFile() file: Express.Multer.File,
    @Body() addFileCharacterizationDto: AddFileCharacterizationDto,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.addCharacterizationFileService.execute(
      addFileCharacterizationDto,
      userPayloadDto,
      file,
    );
  }

  @Permissions({
    code: PermissionEnum.CHARACTERIZATION,
    isContract: true,
    isMember: true,
    crud: "cu",
  })
  @Delete("/photo/:id")
  deletePhoto(@Param("id") id: string) {
    return this.deleteCharacterizationPhotoService.execute(id);
  }

  @Permissions({
    code: PermissionEnum.CHARACTERIZATION,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Delete("/:id")
  delete(
    @Param("id") id: string,
    @Param("workspaceId") workspaceId: string,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.deleteCharacterizationService.execute(
      id,
      workspaceId,
      userPayloadDto,
    );
  }

  @Permissions({
    code: PermissionEnum.CHARACTERIZATION,
    isContract: true,
    isMember: true,
    crud: "cu",
  })
  @Post("/copy")
  async copy(
    @Body() copyCharacterizationDto: CopyCharacterizationDto,
    @Param("workspaceId") workspaceId: string,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.copyCharacterizationService.execute(
      { ...copyCharacterizationDto, workspaceId },
      userPayloadDto,
    );
  }
}
