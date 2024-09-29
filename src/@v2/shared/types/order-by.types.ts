export enum OrderByDirectionEnum {
    ASC = 'asc',
    DESC = 'desc'
}

export type IOrderBy<T = string> = {
    field: T;
    order: OrderByDirectionEnum
}[]
