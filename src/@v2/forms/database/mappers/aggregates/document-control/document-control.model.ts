import { DocumentControlAggregate } from '@/@v2/enterprise/document-control/domain/aggregates/document-control.aggregate';
import { DocumentControl as PrismaDocumentControl } from '@prisma/client';
import { DocumentControlEntityMapper } from '../../entities/document-control/document-control.mapper';
import { DocumentControlFileEntityMapper, DocumentControlFileEntityMapperConstructor } from '../../entities/document-control-file/document-control-file.mapper';

export type DocumentControlAggregateMapperConstructor = PrismaDocumentControl & {
  document_control_files: DocumentControlFileEntityMapperConstructor[];
};

export class DocumentControlAggregateMapper {
  static toAggregate(prisma: DocumentControlAggregateMapperConstructor): DocumentControlAggregate {
    return new DocumentControlAggregate({
      documentControl: DocumentControlEntityMapper.toEntity(prisma),
      files: DocumentControlFileEntityMapper.toArray(prisma.document_control_files),
    });
  }

  static toArray(prisma: DocumentControlAggregateMapperConstructor[]) {
    return prisma.map((p: DocumentControlAggregateMapperConstructor) => DocumentControlAggregateMapper.toAggregate(p));
  }
}
