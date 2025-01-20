import { AccessGroupEntity } from '../../../domain/entities/access-group.entity';

export namespace IAccessGroupRepository {
  export type CreateParams = AccessGroupEntity;
  export type CreateReturn = Promise<AccessGroupEntity | null>;

  export type UpdateParams = AccessGroupEntity;
  export type UpdateReturn = Promise<AccessGroupEntity | null>;

  export type FindParams = { id: number };
  export type FindReturn = Promise<AccessGroupEntity | null>;
}
