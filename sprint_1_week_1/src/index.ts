import express, {Request, Response} from 'express'
import { videosRouter } from './routes/video-router'

const app = express()
const port = 3000

app.use(express.json())
app.use('/videos', videosRouter)
app.use('/testing/all-data', videosRouter)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })