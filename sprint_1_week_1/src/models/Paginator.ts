import { Blog } from './Blog';
import { Post } from './Post';
import { User } from './User';

export type Paginator = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: Blog[] | Post[] | User[]
}