import { DocumentControlReadModel } from '@/@v2/enterprise/document-control/domain/models/document-control/document-control-read.model';
import { FileModelMapper } from '@/@v2/shared/utils/mappers/file-model.mapper';

export type IDocumentControlReadModelMapper = {
  id: string;
  name: string;
  description: string | null;
  type: string;
  created_at: Date;
  updated_at: Date;

  files: {
    name: string;
    end_date: Date | null;
    start_date: Date | null;
    file_url: string;
    file_bucket: string;
    file_key: string;
    file_name: string;
  }[];
};

export class DocumentControlReadModelMapper {
  static toModel(prisma: IDocumentControlReadModelMapper): DocumentControlReadModel {
    return new DocumentControlReadModel({
      id: prisma.id,
      name: prisma.name,
      type: prisma.type,
      description: prisma.description || undefined,
      createdAt: prisma.created_at,
      updatedAt: prisma.updated_at,
      files: prisma.files.map((file) => ({
        name: file.name,
        endDate: file.end_date || undefined,
        startDate: file.start_date || undefined,
        file: FileModelMapper.toClass({
          url: file.file_url,
          bucket: file.file_bucket,
          key: file.file_key,
          name: file.file_name,
        }),
      })),
    });
  }

  static toModels(prisma: IDocumentControlReadModelMapper[]): DocumentControlReadModel[] {
    return prisma.map((rec) => DocumentControlReadModelMapper.toModel(rec));
  }
}
