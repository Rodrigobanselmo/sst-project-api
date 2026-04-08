import { FormRoutes } from '@/@v2/forms/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BrowseFormPreliminaryLibraryQuestionsQuery } from './browse-form-preliminary-library-questions/controllers/browse-form-preliminary-library-questions.query';
import { BrowseFormPreliminaryLibraryQuestionsUseCase } from './browse-form-preliminary-library-questions/use-cases/browse-form-preliminary-library-questions.usecase';
import { CreateFormPreliminaryLibraryQuestionBody } from './create-form-preliminary-library-question/controllers/create-form-preliminary-library-question.body';
import { CreateFormPreliminaryLibraryQuestionUseCase } from './create-form-preliminary-library-question/use-cases/create-form-preliminary-library-question.usecase';
import { DeleteFormPreliminaryLibraryQuestionUseCase } from './delete-form-preliminary-library-question/use-cases/delete-form-preliminary-library-question.usecase';
import { ReadFormPreliminaryLibraryQuestionUseCase } from './read-form-preliminary-library-question/use-cases/read-form-preliminary-library-question.usecase';
import { FormPreliminaryLibraryCompanyPath, FormPreliminaryLibraryQuestionPath } from './shared/form-preliminary-library.path';
import { UpdateFormPreliminaryLibraryQuestionBody } from './update-form-preliminary-library-question/controllers/update-form-preliminary-library-question.body';
import { UpdateFormPreliminaryLibraryQuestionUseCase } from './update-form-preliminary-library-question/use-cases/update-form-preliminary-library-question.usecase';

@Controller(FormRoutes.FORM_PRELIMINARY_LIBRARY.QUESTIONS)
@UseGuards(JwtAuthGuard)
export class FormPreliminaryLibraryQuestionsController {
  constructor(
    private readonly browseUseCase: BrowseFormPreliminaryLibraryQuestionsUseCase,
    private readonly readUseCase: ReadFormPreliminaryLibraryQuestionUseCase,
    private readonly createUseCase: CreateFormPreliminaryLibraryQuestionUseCase,
    private readonly updateUseCase: UpdateFormPreliminaryLibraryQuestionUseCase,
    private readonly deleteUseCase: DeleteFormPreliminaryLibraryQuestionUseCase,
  ) {}

  @Get()
  @Permissions({
    code: PermissionEnum.FORM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  browse(@Param() path: FormPreliminaryLibraryCompanyPath, @Query() query: BrowseFormPreliminaryLibraryQuestionsQuery) {
    return this.browseUseCase.execute({
      companyId: path.companyId,
      category: query.category,
      search: query.search,
      page: query.page,
      limit: query.limit,
    });
  }

  @Get(':questionId')
  @Permissions({
    code: PermissionEnum.FORM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  read(@Param() path: FormPreliminaryLibraryQuestionPath) {
    return this.readUseCase.execute({
      companyId: path.companyId,
      questionId: path.questionId,
    });
  }

  @Post()
  @Permissions({
    code: PermissionEnum.FORM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  create(@Param() path: FormPreliminaryLibraryCompanyPath, @Body() body: CreateFormPreliminaryLibraryQuestionBody) {
    return this.createUseCase.execute({
      companyId: path.companyId,
      name: body.name,
      questionText: body.questionText,
      questionType: body.questionType,
      category: body.category,
      identifierType: body.identifierType,
      acceptOther: body.acceptOther,
      options: body.options.map((o) => ({
        text: o.text,
        order: o.order,
        value: o.value ?? null,
      })),
    });
  }

  @Patch(':questionId')
  @Permissions({
    code: PermissionEnum.FORM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  update(@Param() path: FormPreliminaryLibraryQuestionPath, @Body() body: UpdateFormPreliminaryLibraryQuestionBody) {
    return this.updateUseCase.execute({
      companyId: path.companyId,
      questionId: path.questionId,
      name: body.name,
      questionText: body.questionText,
      questionType: body.questionType,
      category: body.category,
      identifierType: body.identifierType,
      acceptOther: body.acceptOther,
      options: body.options?.map((o) => ({
        text: o.text,
        order: o.order,
        value: o.value ?? null,
      })),
    });
  }

  @Delete(':questionId')
  @Permissions({
    code: PermissionEnum.FORM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  remove(@Param() path: FormPreliminaryLibraryQuestionPath) {
    return this.deleteUseCase.execute({
      companyId: path.companyId,
      questionId: path.questionId,
    });
  }
}
