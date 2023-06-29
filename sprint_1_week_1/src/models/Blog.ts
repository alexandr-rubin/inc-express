import mongoose from 'mongoose'
import { WithId } from 'mongodb'

// export type Blog ={
//     id: string,
//     name: string,
//     description: string,
//     websiteUrl: string,
//     createdAt: string,
//     isMembership: boolean
//   }

export class Blog {
  constructor(public id: string, public name: string, public description: string, public websiteUrl: string, public createdAt: string, public isMembership: boolean){}
}

  export const BlogSchema = new mongoose.Schema<WithId<Blog>>({
    id: { type: String, require: true },
    name: { type: String, require: true },
    description: { type: String, require: true },
    websiteUrl: { type: String, require: true },
    createdAt: { type: String, require: true },
    isMembership: { type: Boolean, require: true }
})
export const BlogModel =  mongoose.model('Blogs', BlogSchema)