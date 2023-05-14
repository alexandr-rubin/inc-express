import { PaginationQuery } from '../models/PaginationQuery'
import { Request } from "express"
import { Paginator } from '../models/Paginator'
import { Blog } from '../models/Blog'
import { Post } from '../models/Post'

export const createPaginationQuery = (req: Request): PaginationQuery => {
    const query = req.query
        const resultQuery: PaginationQuery = {
            searchNameTerm: typeof query.searchNameTerm === 'string' ? query.searchNameTerm : null,
            sortBy: typeof query.sortBy === 'string' ? query.sortBy : 'createdAt',
            sortDirection: typeof query.sortDirection === 'string' ? query.sortDirection === 'asc' ? 'asc' : 'desc' : 'desc',
            pageNumber: Number.isNaN(query.pageNumber) || query.pageNumber === undefined ? 1 : +query.pageNumber,
            pageSize: Number.isNaN(query.pageSize) || query.pageSize === undefined ? 10 : +query.pageSize,
        }
        return resultQuery
}

export const createPaginationResult = (count: number, query: PaginationQuery, items: Blog[] | Post[]): Paginator => {
    const result: Paginator = {
        pageCount: Math.ceil(count / query.pageSize),
        page: query.pageNumber,
        pageSize: query.pageSize,
        totalCount: items.length,
        items: items
    }

    return result
}