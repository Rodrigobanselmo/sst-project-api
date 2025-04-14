import { DocumentControlBrowseResultModel } from '@/@v2/enterprise/document-control/domain/models/document-control/document-control-browse-result.model';
import { FileModelMapper } from '@/@v2/shared/utils/mappers/file-model.mapper';

export type IDocumentControlBrowseResultModelMapper = {
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

export class DocumentControlBrowseResultModelMapper {
  static toModel(prisma: IDocumentControlBrowseResultModelMapper): DocumentControlBrowseResultModel {
    return new DocumentControlBrowseResultModel({
      id: prisma.id,
      name: prisma.name,
      description: prisma.description || undefined,
      endDate: prisma.end_date || undefined,
      startDate: prisma.start_date || undefined,
      type: prisma.type,
      file: prisma.file ? FileModelMapper.toClass(prisma.file) : undefined,
      createdAt: prisma.created_at,
      updatedAt: prisma.updated_at,
    });
  }

  static toModels(prisma: IDocumentControlBrowseResultModelMapper[]): DocumentControlBrowseResultModel[] {
    return prisma.map((rec) => DocumentControlBrowseResultModelMapper.toModel(rec));
  }
}
