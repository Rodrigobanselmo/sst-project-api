import { FormRoutes } from '@/@v2/forms/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { BrowseFormPreliminaryLibraryBlocksQuery } from './browse-form-preliminary-library-blocks/controllers/browse-form-preliminary-library-blocks.query';
import { BrowseFormPreliminaryLibraryBlocksUseCase } from './browse-form-preliminary-library-blocks/use-cases/browse-form-preliminary-library-blocks.usecase';
import { CreateFormPreliminaryLibraryBlockBody } from './create-form-preliminary-library-block/controllers/create-form-preliminary-library-block.body';
import { CreateFormPreliminaryLibraryBlockUseCase } from './create-form-preliminary-library-block/use-cases/create-form-preliminary-library-block.usecase';
import { DeleteFormPreliminaryLibraryBlockUseCase } from './delete-form-preliminary-library-block/use-cases/delete-form-preliminary-library-block.usecase';
import { ReadFormPreliminaryLibraryBlockUseCase } from './read-form-preliminary-library-block/use-cases/read-form-preliminary-library-block.usecase';
import { FormPreliminaryLibraryBlockPath, FormPreliminaryLibraryCompanyPath } from './shared/form-preliminary-library.path';
import { UpdateFormPreliminaryLibraryBlockBody } from './update-form-preliminary-library-block/controllers/update-form-preliminary-library-block.body';
import { UpdateFormPreliminaryLibraryBlockUseCase } from './update-form-preliminary-library-block/use-cases/update-form-preliminary-library-block.usecase';

@Controller(FormRoutes.FORM_PRELIMINARY_LIBRARY.BLOCKS)
@UseGuards(JwtAuthGuard)
export class FormPreliminaryLibraryBlocksController {
  constructor(
    private readonly browseUseCase: BrowseFormPreliminaryLibraryBlocksUseCase,
    private readonly readUseCase: ReadFormPreliminaryLibraryBlockUseCase,
    private readonly createUseCase: CreateFormPreliminaryLibraryBlockUseCase,
    private readonly updateUseCase: UpdateFormPreliminaryLibraryBlockUseCase,
    private readonly deleteUseCase: DeleteFormPreliminaryLibraryBlockUseCase,
  ) {}

  @Get()
  @Permissions({
    code: PermissionEnum.FORM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  browse(@Param() path: FormPreliminaryLibraryCompanyPath, @Query() query: BrowseFormPreliminaryLibraryBlocksQuery) {
    return this.browseUseCase.execute({
      companyId: path.companyId,
      search: query.search,
      page: query.page,
      limit: query.limit,
    });
  }

  @Get(':blockId')
  @Permissions({
    code: PermissionEnum.FORM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  read(@Param() path: FormPreliminaryLibraryBlockPath) {
    return this.readUseCase.execute({
      companyId: path.companyId,
      blockId: path.blockId,
    });
  }

  @Post()
  @Permissions({
    code: PermissionEnum.FORM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  create(@Param() path: FormPreliminaryLibraryCompanyPath, @Body() body: CreateFormPreliminaryLibraryBlockBody) {
    return this.createUseCase.execute({
      companyId: path.companyId,
      name: body.name,
      description: body.description,
      items: body.items.map((i) => ({
        libraryQuestionId: i.libraryQuestionId,
        order: i.order,
      })),
    });
  }

  @Patch(':blockId')
  @Permissions({
    code: PermissionEnum.FORM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  update(@Param() path: FormPreliminaryLibraryBlockPath, @Body() body: UpdateFormPreliminaryLibraryBlockBody) {
    return this.updateUseCase.execute({
      companyId: path.companyId,
      blockId: path.blockId,
      name: body.name,
      description: body.description,
      items: body.items?.map((i) => ({
        libraryQuestionId: i.libraryQuestionId,
        order: i.order,
      })),
    });
  }

  @Delete(':blockId')
  @Permissions({
    code: PermissionEnum.FORM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  remove(@Param() path: FormPreliminaryLibraryBlockPath) {
    return this.deleteUseCase.execute({
      companyId: path.companyId,
      blockId: path.blockId,
    });
  }
}
