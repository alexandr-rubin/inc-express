import express from 'express'
import { videosRouter } from './routes/video-router'
import { postsRouter } from './routes/postRouter'
import { blogsRouter } from './routes/blogRouter'
import { testingRouter } from './routes/testingRouter'
import { basicAuthMiddleware } from './middlewares/basicAuth'
import { usersRouter } from './routes/userRouter'
import { loginRouter } from './routes/loginRouter'
import { commentsRouter } from './routes/commentRouter'

export const app = express()

app.use(express.json())
app.use('/testing/all-data', testingRouter)
app.use('/auth', loginRouter)
app.use(basicAuthMiddleware)
app.use('/videos', videosRouter)
app.use('/posts', postsRouter)
app.use('/blogs', blogsRouter)
app.use('/users', usersRouter)
app.use('/comments', commentsRouter)