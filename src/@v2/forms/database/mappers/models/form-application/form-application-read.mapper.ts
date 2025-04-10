import { FormApplicationReadModel } from '@/@v2/forms/domain/models/form-application/form-application-read.model';
import { FileModelMapper } from '@/@v2/shared/utils/mappers/file-model.mapper';
import { FormApplication } from '@prisma/client';

export type IFormApplicationReadModelMapper = FormApplication;

export class FormApplicationReadModelMapper {
  static toModel(prisma: IFormApplicationReadModelMapper): FormApplicationReadModel {
    return new FormApplicationReadModel({
      id: prisma.id,
      name: prisma.name,
      companyId: prisma.company_id,
      description: prisma.description || undefined,
      createdAt: prisma.created_at,
      updatedAt: prisma.updated_at,
      // files: prisma.files.map((file) => ({
      //   startDate: file.start_date ? new Date(file.start_date) : undefined,
      //   file: FileModelMapper.toClass({
      //     id: file.file_id,
      //   }),
      // })),
    });
  }

  static toModels(prisma: IFormApplicationReadModelMapper[]): FormApplicationReadModel[] {
    return prisma.map((rec) => FormApplicationReadModelMapper.toModel(rec));
  }
}
