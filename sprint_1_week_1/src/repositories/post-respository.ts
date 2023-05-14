import { Post } from '../models/Post'
import { postsCollection } from './db'
import { PaginationQuery } from '../models/PaginationQuery'
import { Paginator } from '../models/Paginator'
import { createPaginationResult } from '../helpers/pagination'

export const postRepository = {
    async getPosts(query: PaginationQuery): Promise<Paginator> {
        const skip = (query.pageNumber - 1) * query.pageSize
        const posts = await postsCollection.find(query.searchNameTerm === null ? {} : {name: {$regex: query.searchNameTerm, $options: 'i'}}, {projection: {_id: false}})
        .sort({[query.sortBy]: query.sortDirection === 'asc' ? 1 : -1})
        .skip(skip).limit(query.pageSize)
        .toArray()
        const count = await postsCollection.countDocuments(query.searchNameTerm === null ? {} : {name: {$regex: query.searchNameTerm, $options: 'i'}})
        const result = createPaginationResult(count, query, posts)
        
        return result
    },
    async addPost(post: Post): Promise<boolean> {
        // TODO: return
        return (await postsCollection.insertOne(post)).acknowledged === true
    },
    async getPostById(id: string): Promise<Post | null> {
        return await postsCollection.findOne({id: id}, {projection: {_id: false}})
    },
    async updatePostByid(id: string, newPost: Post): Promise<boolean> {
        const result = await postsCollection.updateOne({id: id}, { $set: {title: newPost.title, shortDescription: newPost.shortDescription, content: newPost.content, blogId: newPost.blogId}})
        return result.matchedCount === 1
    },
    async deletePostById(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async testingDeleteAllPosts() {
        postsCollection.deleteMany({})
    }
}