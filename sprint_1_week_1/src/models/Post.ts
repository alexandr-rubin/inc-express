import mongoose from 'mongoose'
import { WithId } from 'mongodb'

// export type Post = {
//     id: string,
//     title: string,
//     shortDescription: string,
//     content: string,
//     blogId: string,
//     blogName: string,
//     createdAt: string
// }

export class Post {
    constructor(public id: string, public title: string, public shortDescription: string, public content: string, public blogId: string, public blogName: string, public createdAt: string){}
}

export const PostSchema = new mongoose.Schema<WithId<Post>>({
    id: { type: String, require: true },
    title: { type: String, require: true },
    shortDescription: { type: String, require: true },
    content: { type: String, require: true },
    blogId: { type: String, require: true },
    blogName: { type: String, require: true },
    createdAt: { type: String, require: true }
})
export const PostModel =  mongoose.model('Posts', PostSchema)