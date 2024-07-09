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
} from "@nestjs/common";

import { PermissionEnum } from "../../../../shared/constants/enum/authorization";
import { Permissions } from "../../../../shared/decorators/permissions.decorator";
import { User } from "../../../../shared/decorators/user.decorator";
import { UserPayloadDto } from "../../../../shared/dto/user-payload.dto";
import { CreateCatDto, FindCatDto, UpdateCatDto } from "../../dto/cat.dto";
import { FindOneCatsService } from "../../services/cat/find-one-cat/find-one-cat.service";
import { CreateCatsService } from "../../services/cat/create-cat/create-cat.service";
import { DeleteCatsService } from "../../services/cat/delete-cat/delete-cat.service";
import { FindCatsService } from "../../services/cat/find-cat/find-cat.service";
import { UpdateCatsService } from "../../services/cat/update-cat/update-cat.service";

@Controller("cat")
export class CatController {
  constructor(
    private readonly updateCatsService: UpdateCatsService,
    private readonly createCatsService: CreateCatsService,
    private readonly findAvailableCatsService: FindCatsService,
    private readonly findOneCatsService: FindOneCatsService,
    private readonly deleteCatsService: DeleteCatsService,
  ) {}

  @Permissions({
    code: PermissionEnum.CAT,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Get("/:companyId/:id")
  findOne(
    @User() userPayloadDto: UserPayloadDto,
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.findOneCatsService.execute(id, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.CAT,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Get("/:companyId")
  find(@User() userPayloadDto: UserPayloadDto, @Query() query: FindCatDto) {
    return this.findAvailableCatsService.execute(query, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.CAT,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Post("/:companyId")
  create(
    @Body() upsertAccessGroupDto: CreateCatDto,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.createCatsService.execute(upsertAccessGroupDto, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.CAT,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Patch("/:companyId/:id")
  update(
    @Body() upsertAccessGroupDto: UpdateCatDto,
    @User() userPayloadDto: UserPayloadDto,
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.updateCatsService.execute(
      { ...upsertAccessGroupDto, id },
      userPayloadDto,
    );
  }

  @Permissions({
    code: PermissionEnum.CAT,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Delete("/:companyId/:id")
  delete(
    @User() userPayloadDto: UserPayloadDto,
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.deleteCatsService.execute(id, userPayloadDto);
  }
}
