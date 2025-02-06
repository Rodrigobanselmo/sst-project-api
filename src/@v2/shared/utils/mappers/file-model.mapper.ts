import { FileModel } from '../../models/common/file.model';

export type FileModelMapperConstructor = {
  name: string;
  bucket: string;
  key: string;
  url: string;
};

export class FileModelMapper {
  static toClass(prisma: FileModelMapperConstructor): FileModel {
    return new FileModel({
      name: prisma.name,
      bucket: prisma.bucket,
      key: prisma.key,
      url: prisma.url,
    });
  }

  static toArray(prisma: FileModelMapperConstructor[]) {
    return prisma.map((p: FileModelMapperConstructor) => FileModelMapper.toClass(p));
  }
}
