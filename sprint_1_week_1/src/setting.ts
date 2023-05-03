import express from 'express'
import { videosRouter, testingVideosRouter } from './routes/video-router'
import { postsRouter } from './routes/post-router'
import { blogsRouter } from './routes/blog-router'

export const app = express()

app.use(express.json())
app.use('/videos', videosRouter)
app.use('/testing/all-data', testingVideosRouter)
app.use('/posts', postsRouter)
app.use('/blogs', blogsRouter)