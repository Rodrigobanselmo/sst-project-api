interface IFilter {
  query: any;
  skip?: string[];
}

export const prismaFilter = <T>(
  prismaWhere: T,
  { query: routeQuery, skip }: IFilter,
) => {
  const query = { ...routeQuery };
  const where: T = {
    AND: [],
    ...prismaWhere,
  };

  Object.entries(query).forEach(([key, value]) => {
    if (skip && skip.includes(key)) return;
    if (Array.isArray(value)) {
      ((where as any).AND as any).push({
        [key]: { in: value },
      });
    } else if (typeof value === 'string') {
      ((where as any).AND as any).push({
        [key]: {
          contains: value,
          mode: 'insensitive',
        },
      });
    } else if (value) {
      ((where as any).AND as any).push({
        [key]: value,
      });
    }
  });

  return { query, where };
};
