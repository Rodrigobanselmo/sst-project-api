import { DocumentControlReadModel } from '@/@v2/enterprise/document-control/domain/models/document-control/document-control-read.model';
import { FileModelMapper } from '@/@v2/shared/utils/mappers/file-model.mapper';

export type IDocumentControlReadModelMapper = {
  id: string;
  name: string;
  company_id: string;
  description: string | null;
  type: string;
  created_at: Date;
  updated_at: Date;

  files: {
    id: number;
    name: string;
    description: string | null;
    end_date: Date | null;
    start_date: Date | null;
    file_id: string;
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
      companyId: prisma.company_id,
      type: prisma.type,
      description: prisma.description || undefined,
      createdAt: prisma.created_at,
      updatedAt: prisma.updated_at,
      files: prisma.files.map((file) => ({
        id: file.id,
        companyId: prisma.company_id,
        name: file.name,
        description: file.description || undefined,
        endDate: file.end_date ? new Date(file.end_date) : undefined,
        startDate: file.start_date ? new Date(file.start_date) : undefined,
        file: FileModelMapper.toClass({
          id: file.file_id,
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
