import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'
import { Blog } from '../models/Blog'
import { Post } from '../models/Post'
import { User } from '../models/User'
import { Comment } from '../models/Comment'
import { Device } from '../models/Device'
import { APILog } from '../models/APILogs'
import mongoose from 'mongoose'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/testDb'

// const client = new MongoClient(MONGODB_URI)

// export const blogsCollection = client.db().collection<Blog>('Blogs')
// export const postsCollection = client.db().collection<Post>('Posts')
// export const usersCollection = client.db().collection<User>('Users')
// export const commentsCollection = client.db().collection<Comment>('Comments')
// export const refreshTokensCollection = client.db().collection<Device>('RefreshTokens')
// export const apiLogsCollection = client.db().collection<APILog>('APILogs')

export async function runDb() {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log("Connected " + MONGODB_URI)
    }
    catch {
        console.log('Database connection error')
        await mongoose.disconnect()
    }
}