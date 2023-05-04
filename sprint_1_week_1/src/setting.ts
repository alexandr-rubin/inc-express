import express from 'express'
import { videosRouter } from './routes/video-router'
import { postsRouter } from './routes/post-router'
import { blogsRouter } from './routes/blog-router'
import { testingRouter } from './routes/testing-router'
import { basicAuthMiddleware } from './middlewares/basicAuth'

export const app = express()

app.use(basicAuthMiddleware)
app.use(express.json())
app.use('/videos', videosRouter)
app.use('/testing/all-data', testingRouter)
app.use('/posts', postsRouter)
app.use('/blogs', blogsRouter)