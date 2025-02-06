import { SystemFile } from '@prisma/client';

import { FileEntity } from '../../domain/entities/file.entity';

export type FileEntityMapperConstructor = SystemFile;

export class FileEntityMapper {
  static toEntity(prisma: FileEntityMapperConstructor): FileEntity {
    return new FileEntity({
      id: prisma.id,
      companyId: prisma.company_id,
      name: prisma.name,
      url: prisma.url,
      key: prisma.key,
      bucket: prisma.bucket,
      shouldDelete: prisma.should_delete,
    });
  }

  static toArray(prisma: FileEntityMapperConstructor[]) {
    return prisma.map((p: FileEntityMapperConstructor) => FileEntityMapper.toEntity(p));
  }
}
