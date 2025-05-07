export enum OrderByDirectionEnum {
  ASC = 'asc',
  DESC = 'desc',
  NONE = 'none',
}

export type IOrderBy<T = string> = {
  field: T;
  order: OrderByDirectionEnum;
}[];
