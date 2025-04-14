import { FormTypeEnum } from '@/@v2/forms/domain/enums/form-type.enum';
import { FormBrowseResultModel } from '@/@v2/forms/domain/models/form/form-browse-result.model';

export type IFormBrowseResultModelMapper = {
  id: number;
  name: string;
  description: string | null;
  company_id: string;
  type: FormTypeEnum;
  anonymous: boolean;
  system: boolean;
  shareable_link: boolean;
  created_at: Date;
  updated_at: Date;
};

export class FormBrowseResultModelMapper {
  static toModel(prisma: IFormBrowseResultModelMapper): FormBrowseResultModel {
    return new FormBrowseResultModel({
      id: prisma.id,
      name: prisma.name,
      companyId: prisma.company_id,
      description: prisma.description || undefined,
      createdAt: prisma.created_at,
      anonymous: prisma.anonymous,
      system: prisma.system,
      shareable_link: prisma.shareable_link,
      type: FormTypeEnum[prisma.type],
      updatedAt: prisma.updated_at,
    });
  }

  static toModels(prisma: IFormBrowseResultModelMapper[]): FormBrowseResultModel[] {
    return prisma.map((rec) => FormBrowseResultModelMapper.toModel(rec));
  }
}
