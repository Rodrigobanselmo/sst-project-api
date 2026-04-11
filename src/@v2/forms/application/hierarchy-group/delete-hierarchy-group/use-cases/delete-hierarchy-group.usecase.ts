import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';

export namespace IDeleteHierarchyGroupUseCase {
  export type Params = {
    companyId: string;
    applicationId: string;
    groupId: string;
  };
}

@Injectable()
export class DeleteHierarchyGroupUseCase {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async execute(params: IDeleteHierarchyGroupUseCase.Params) {
    const group = await this.prisma.formApplicationHierarchyGroup.findFirst({
      where: {
        id: params.groupId,
        form_application_id: params.applicationId,
        form_application: {
          company_id: params.companyId,
          deleted_at: null,
        },
      },
    });

    if (!group) {
      throw new NotFoundException('Grupo não encontrado');
    }

    await this.prisma.formApplicationHierarchyGroup.delete({
      where: { id: params.groupId },
    });

    return { deleted: true };
  }
}
