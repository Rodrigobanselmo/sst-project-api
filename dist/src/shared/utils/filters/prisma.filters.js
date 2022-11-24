"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaFilter = void 0;
const prismaFilter = (prismaWhere, { query: routeQuery, skip }) => {
    const query = Object.assign({}, routeQuery);
    const where = Object.assign({ AND: [] }, prismaWhere);
    skip = ['orderBy', 'orderByDirection', ...skip];
    Object.entries(query).forEach(([key, value]) => {
        if (skip && skip.includes(key))
            return;
        if (Array.isArray(value)) {
            where.AND.push({
                [key]: { in: value },
            });
        }
        else if (typeof value === 'string') {
            where.AND.push({
                [key]: {
                    contains: value,
                    mode: 'insensitive',
                },
            });
        }
        else if (value || value === 0 || typeof value == 'boolean') {
            where.AND.push({
                [key]: value,
            });
        }
        else if (value === undefined) {
            where.AND.push({
                [key]: null,
            });
        }
    });
    return { query, where };
};
exports.prismaFilter = prismaFilter;
//# sourceMappingURL=prisma.filters.js.map