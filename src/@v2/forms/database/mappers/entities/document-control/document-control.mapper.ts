import { DocumentControlEntity } from '@/@v2/enterprise/document-control/domain/entities/document-control.entity';
import { DocumentStatusEnum } from '@/@v2/enterprise/document-control/domain/enums/document-status.enum';
import { DocumentControl as PrismaDocumentControl } from '@prisma/client';

export type DocumentControlEntityMapperConstructor = PrismaDocumentControl;

export class DocumentControlEntityMapper {
  static toEntity(prisma: DocumentControlEntityMapperConstructor): DocumentControlEntity {
    return new DocumentControlEntity({
      id: prisma.id,
      companyId: prisma.company_id,
      name: prisma.name,
      createdAt: prisma.created_at,
      description: prisma.description,
      status: DocumentStatusEnum[prisma.status],
      type: prisma.type,
      updatedAt: prisma.updated_at,
      workspaceId: prisma.workspace_id,
    });
  }

  static toArray(prisma: DocumentControlEntityMapperConstructor[]) {
    return prisma.map((p: DocumentControlEntityMapperConstructor) => DocumentControlEntityMapper.toEntity(p));
  }
}
