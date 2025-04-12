import { FormTypeEnum } from '@/@v2/forms/domain/enums/form-type.enum';
import { FormReadModel } from '@/@v2/forms/domain/models/form/form-read.model';
import { Form } from '@prisma/client';

export type IFormReadModelMapper = Form;

export class FormReadModelMapper {
  static toModel(prisma: IFormReadModelMapper): FormReadModel {
    return new FormReadModel({
      id: prisma.id,
      name: prisma.name,
      companyId: prisma.company_id,
      description: prisma.description || undefined,
      createdAt: prisma.created_at,
      updatedAt: prisma.updated_at,
      anonymous: prisma.anonymous,
      system: prisma.system,
      shareable_link: prisma.shareable_link,
      type: FormTypeEnum[prisma.type],
    });
  }

  static toModels(prisma: IFormReadModelMapper[]): FormReadModel[] {
    return prisma.map((rec) => FormReadModelMapper.toModel(rec));
  }
}
