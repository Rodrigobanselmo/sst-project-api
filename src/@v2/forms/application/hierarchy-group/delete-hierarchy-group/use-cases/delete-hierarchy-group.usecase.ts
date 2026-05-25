import { formApplicationNestedAccessWhere } from '@/@v2/forms/application/shared/helpers/form-application-access.helper';
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
        form_application: formApplicationNestedAccessWhere(params.companyId),
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
