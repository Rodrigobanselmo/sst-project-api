import { FormRoutes } from '@/@v2/forms/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { Controller, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { DuplicateFormUseCase } from '../use-cases/duplicate-form.usecase';
import { DuplicateFormPath } from './duplicate-form.path';

/**
 * Controller sem prefixo + path completo no decorator garante o registro exato:
 * POST /v2/companies/:companyId/forms/models/:formId/duplicate
 * (evita ambiguidade com o router aninhado de AddFormController em …/models).
 */
@Controller()
@UseGuards(JwtAuthGuard)
export class DuplicateFormController {
  private readonly logger = new Logger(DuplicateFormController.name);

  constructor(private readonly duplicateFormUseCase: DuplicateFormUseCase) {}

  @Post(FormRoutes.FORM.PATH_ID_DUPLICATE)
  @Permissions({
    code: PermissionEnum.FORM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async duplicate(@Param() path: DuplicateFormPath) {
    // Log temporário: confirmar em runtime se a requisição chega ao handler
    this.logger.log(
      `[duplicate-form] companyId=${path.companyId} sourceFormId=${path.formId}`,
    );
    return this.duplicateFormUseCase.execute({
      companyId: path.companyId,
      sourceFormId: path.formId,
    });
  }
}
