import express from 'express'
import { videosRouter, testingVideosRouter } from './routes/video-router'

export const app = express()

app.use(express.json())
app.use('/videos', videosRouter)
app.use('/testing/all-data', testingVideosRouter)