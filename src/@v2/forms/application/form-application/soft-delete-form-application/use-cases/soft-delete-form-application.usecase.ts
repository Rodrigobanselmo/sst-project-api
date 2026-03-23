import { FormApplicationCacheService } from '@/@v2/forms/services/form-application-cache.service';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { StatusEnum } from '@prisma/client';

@Injectable()
export class SoftDeleteFormApplicationUseCase {
  constructor(
    private readonly prisma: PrismaServiceV2,
    private readonly formApplicationCacheService: FormApplicationCacheService,
  ) {}

  async execute(params: { applicationId: string; companyId: string }): Promise<void> {
    const row = await this.prisma.formApplication.findFirst({
      where: {
        id: params.applicationId,
        company_id: params.companyId,
        deleted_at: null,
      },
      select: { id: true, status: true },
    });

    if (!row) {
      throw new NotFoundException('Formulário não encontrado');
    }

    if (row.status !== StatusEnum.CANCELED) {
      throw new BadRequestException(
        'Somente aplicações de formulário com status Cancelado podem ser excluídas.',
      );
    }

    await this.prisma.formApplication.update({
      where: { id: params.applicationId },
      data: { deleted_at: new Date() },
    });

    await this.formApplicationCacheService.invalidateFormApplicationCache(params.applicationId);
  }
}
