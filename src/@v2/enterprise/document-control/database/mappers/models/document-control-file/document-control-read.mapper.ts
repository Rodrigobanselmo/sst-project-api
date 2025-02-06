import { DocumentControlFileReadModel } from '@/@v2/enterprise/document-control/domain/models/document-control-file/document-control-file-read.model';
import { FileModelMapper } from '@/@v2/shared/utils/mappers/file-model.mapper';

export type IDocumentControlFileReadModelMapper = {
  id: string;
  name: string;
  description: string | undefined;
  end_date: Date | null;
  start_date: Date | null;
  file_url: string;
  file_bucket: string;
  file_key: string;
  file_name: string;
};

export class DocumentControlFileReadModelMapper {
  static toModel(prisma: IDocumentControlFileReadModelMapper): DocumentControlFileReadModel {
    return new DocumentControlFileReadModel({
      id: prisma.id,
      name: prisma.name,
      description: prisma.description || undefined,
      endDate: prisma.end_date || undefined,
      startDate: prisma.start_date || undefined,
      file: FileModelMapper.toClass({
        url: prisma.file_url,
        bucket: prisma.file_bucket,
        key: prisma.file_key,
        name: prisma.file_name,
      }),
    });
  }

  static toModels(prisma: IDocumentControlFileReadModelMapper[]): DocumentControlFileReadModel[] {
    return prisma.map((rec) => DocumentControlFileReadModelMapper.toModel(rec));
  }
}
