import express from 'express'
import { videosRouter } from './routes/video-router'
import { postsRouter } from './routes/postRouter'
import { blogsRouter } from './routes/blogRouter'
import { testingRouter } from './routes/testingRouter'
import { basicAuthMiddleware } from './middlewares/basicAuth'
import { usersRouter } from './routes/userRouter'
import { authorizationRouterRouter } from './routes/authorizationRouter'
import { commentsRouter } from './routes/commentRouter'
import cookieParser from 'cookie-parser'
import { securityRouter } from './routes/securityRouter'
import { logAPIMiddleware } from './middlewares/logAPI'

export const app = express()

app.set('trust proxy', 1)
app.use(express.json())
app.use(cookieParser())
app.use('/security/', securityRouter)
app.use('/testing/all-data', testingRouter)
app.use('/auth', authorizationRouterRouter)
app.use('/comments', commentsRouter)
//app.use(basicAuthMiddleware)
app.use('/videos', videosRouter)
app.use('/posts', postsRouter)
app.use('/blogs', blogsRouter)
app.use('/users', usersRouter)