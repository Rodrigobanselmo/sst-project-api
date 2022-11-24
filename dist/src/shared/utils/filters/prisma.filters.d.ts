interface IFilter {
    query: any;
    skip?: string[];
}
export declare const prismaFilter: <T>(prismaWhere: T, { query: routeQuery, skip }: IFilter) => {
    query: any;
    where: T;
};
export {};
