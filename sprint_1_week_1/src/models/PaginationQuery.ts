export type PaginationQuery = {
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number
}