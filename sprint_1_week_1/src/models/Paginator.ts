import { Blog } from './Blog';
import { Post } from './Post';

export type Paginator = {
    pageCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: Blog[] | Post[]
}