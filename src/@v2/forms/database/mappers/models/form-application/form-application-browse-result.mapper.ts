import { FormApplicationBrowseResultModel } from '@/@v2/forms/domain/models/form-application/form-application-browse-result.model';
import { FileModelMapper } from '@/@v2/shared/utils/mappers/file-model.mapper';

export type IFormApplicationBrowseResultModelMapper = {
  id: number;
  name: string;
  description: string | null;
  end_date: Date | null;
  start_date: Date | null;
  type: string;
  created_at: Date;
  updated_at: Date;

  file: {
    id: string;
    url: string;
    bucket: string;
    key: string;
    name: string;
  } | null;
};

export class FormApplicationBrowseResultModelMapper {
  static toModel(prisma: IFormApplicationBrowseResultModelMapper): FormApplicationBrowseResultModel {
    return new FormApplicationBrowseResultModel({
      id: prisma.id,
      name: prisma.name,
      description: prisma.description,
      endDate: prisma.end_date,
      startDate: prisma.start_date,
      type: prisma.type,
      file: prisma.file ? FileModelMapper.toClass(prisma.file) : undefined,
      createdAt: prisma.created_at,
      updatedAt: prisma.updated_at,
    });
  }

  static toModels(prisma: IFormApplicationBrowseResultModelMapper[]): FormApplicationBrowseResultModel[] {
    return prisma.map((rec) => FormApplicationBrowseResultModelMapper.toModel(rec));
  }
}
