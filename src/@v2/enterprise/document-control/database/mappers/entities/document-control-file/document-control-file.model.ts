import { DocumentControlFileEntity } from '@/@v2/enterprise/document-control/domain/entities/document-control-file.entity';
import { DocumentStatusEnum } from '@/@v2/enterprise/document-control/domain/enums/document-status.enum';
import { SystemFileMapper, SystemFileMapperConstructor } from '@/@v2/shared/utils/mappers/system-file.mapper';
import { DocumentControlFile as PrismaDocumentControlFile } from '@prisma/client';

export type DocumentControlFileEntityMapperConstructor = PrismaDocumentControlFile & {
  file: SystemFileMapperConstructor;
};

export class DocumentControlFileEntityMapper {
  static toEntity(prisma: DocumentControlFileEntityMapperConstructor): DocumentControlFileEntity {
    return new DocumentControlFileEntity({
      id: prisma.id,
      companyId: prisma.company_id,
      name: prisma.name,
      createdAt: prisma.created_at,
      updatedAt: prisma.updated_at,
      endDate: prisma.end_date,
      file: SystemFileMapper.toClass(prisma.file),
      startDate: prisma.start_date,
      status: DocumentStatusEnum[prisma.status],
    });
  }

  static toArray(prisma: DocumentControlFileEntityMapperConstructor[]) {
    return prisma.map((p: DocumentControlFileEntityMapperConstructor) => DocumentControlFileEntityMapper.toEntity(p));
  }
}
