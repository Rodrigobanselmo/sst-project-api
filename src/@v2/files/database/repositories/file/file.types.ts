import { FileEntity } from '@/@v2/files/domain/entities/file.entity';

export namespace IFileRepository {
  export type CreateParams = FileEntity;
  export type CreateReturn = Promise<FileEntity | null>;

  export type UpdateParams = FileEntity;
  export type UpdateReturn = Promise<FileEntity | null>;

  export type FindParams = { id: string; companyId: string };
  export type FindReturn = Promise<FileEntity | null>;

  export type FindManyUnusedParams = { companyId?: string };
  export type FindManyUnusedReturn = Promise<FileEntity[]>;

  export type FindManyParams = { companyId: string; ids: string[] };
  export type FindManyReturn = Promise<FileEntity[]>;

  export type DeleteParams = { id: string; companyId: string };
}
