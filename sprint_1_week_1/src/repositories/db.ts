import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'
import { Blog } from '../models/Blog'
import { Post } from '../models/Post'

dotenv.config()

const mobgoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/testDb'

const client = new MongoClient(mobgoUrl)

export const blogsCollection = client.db().collection<Blog>('Blogs')
export const postsCollection = client.db().collection<Post>('Posts')

export async function runDb() {
    try {
        await client.connect()
        console.log("Connected")
    }
    catch {
        console.log('Database connection error')
        await client.close()
    }
}