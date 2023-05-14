"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaginationResult = exports.createPaginationQuery = void 0;
const createPaginationQuery = (req) => {
    const query = req.query;
    const resultQuery = {
        searchNameTerm: typeof query.searchNameTerm === 'string' ? query.searchNameTerm : null,
        sortBy: typeof query.sortBy === 'string' ? query.sortBy : 'createdAt',
        sortDirection: typeof query.sortDirection === 'string' ? query.sortDirection === 'asc' ? 'asc' : 'desc' : 'desc',
        pageNumber: Number.isNaN(query.pageNumber) || query.pageNumber === undefined ? 1 : +query.pageNumber,
        pageSize: Number.isNaN(query.pageSize) || query.pageSize === undefined ? 10 : +query.pageSize,
    };
    return resultQuery;
};
exports.createPaginationQuery = createPaginationQuery;
const createPaginationResult = (count, query, items) => {
    const result = {
        pageCount: Math.ceil(count / query.pageSize),
        page: query.pageNumber,
        pageSize: query.pageSize,
        totalCount: items.length,
        items: items
    };
    return result;
};
exports.createPaginationResult = createPaginationResult;
