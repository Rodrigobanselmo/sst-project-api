import { SystemFile } from '@/@v2/shared/domain/types/shared/system-file';
import { SystemFile as PrismaSystemFile } from '@prisma/client';

export type SystemFileMapperConstructor = PrismaSystemFile;

export class SystemFileMapper {
  static toClass(prisma: SystemFileMapperConstructor): SystemFile {
    return new SystemFile({
      id: prisma.id,
      companyId: prisma.company_id,
      name: prisma.name,
      bucket: prisma.bucket,
      key: prisma.key,
      url: prisma.url,
    });
  }

  static toArray(prisma: SystemFileMapperConstructor[]) {
    return prisma.map((p: SystemFileMapperConstructor) => SystemFileMapper.toClass(p));
  }
}
