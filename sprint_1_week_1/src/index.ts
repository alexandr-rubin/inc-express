import express, {Request, Response} from 'express'

const app = express()
const port = 3000

app.use(express.json())

let videos = [
    {
        "id": 0,
        "title": "title 1",
        "author": "string",
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": "2023-04-25T14:38:03.936Z",
        "publicationDate": "2023-04-25T14:38:03.936Z",
        "availableResolutions": [
          "P144"
        ]
      },
      {
        "id": 1,
        "title": "title 2",
        "author": "string",
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": "2023-03-10T14:38:03.936Z",
        "publicationDate": "2023-04-25T14:38:03.936Z",
        "availableResolutions": [
          "P240"
        ]
      },
      {
        "id": 2,
        "title": "string",
        "author": "string",
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": "2022-02-17T14:38:03.936Z",
        "publicationDate": "2023-04-25T14:38:03.936Z",
        "availableResolutions": [
          "P1080"
        ]
      }
]
enum VideobleResolutions { 'P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160' }

let errorsMessages: { message: string; field: string }[] = []

app.delete('/testing/all-data', (req: Request, res: Response) => {
    videos = []
    res.status(204).send('All data is deleted') 
})

app.get('/videos', (req: Request, res: Response) => {
    res.status(200).send(videos)
})

app.post('/videos', (req: Request, res: Response) => {
    errorsMessages = []
    const createdDate = new Date().toISOString()
    const publication = new Date(createdDate)
    publication.setDate(publication.getDate() + 1)
    const newVideo = {
        id: +(new Date()),
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt : createdDate,
        publicationDate: publication.toISOString(),
        availableResolutions: req.body.availableResolutions || [
          "P144"
        ]
      }
    
    if(typeof newVideo.title !== 'string' || newVideo.title.length > 40){
        errorsMessages.push({
          message: 'Title must be a string',
          field: 'title'
      })
    }
    if(typeof newVideo.author !== 'string' || newVideo.author.length > 20){
        errorsMessages.push({
          message: 'Author must be a string',
          field: 'author'
      })
    }

    if(!Array.isArray(newVideo.availableResolutions) || !newVideo.availableResolutions.every(x => Object.values(VideobleResolutions).includes(x))){
        errorsMessages.push({
          message: 'Available Resolutions must be an array',
          field: 'availableResolutions'
      })
    }

    if(errorsMessages.length > 0){
      res.status(400).send({errorsMessages})
      return
    }
    
    videos.push(newVideo)
    res.status(201).send(newVideo)
})

app.get('/videos/:id', (req: Request, res: Response) => {
  const video = videos.find(x => x.id === +req.params.id)
  if(video){
    res.status(200).send(video)
  }
  else{
    res.status(404).send('Video not found')
  }
})

app.put('/videos/:id', (req: Request, res: Response) => {
  errorsMessages = []
  const video = videos.find(x => x.id === +req.params.id)
  if(!video){
    res.status(404).send('Video not found')
    return
  }

  if(typeof req.body.title !== 'string' || req.body.title.length > 40){
      errorsMessages.push({
        message: 'Title must be a string',
        field: 'title'
    })
  }
  if(typeof req.body.author !== 'string' || req.body.author.length > 20){
      errorsMessages.push({
        message: 'Author must be a string',
        field: 'author'
    })
  }
  if(typeof req.body.canBeDownloaded !== 'boolean' && req.body.canBeDownloaded){
    errorsMessages.push({
      message: 'Field must be a boolean',
      field: 'canBeDownloaded'
  })
  }
  if(req.body.minAgeRestriction && (typeof req.body.minAgeRestriction !== 'number' || req.body.minAgeRestriction > 18 || req.body.minAgeRestriction < 1)){
    errorsMessages.push({
      message: 'Min Age Restriction must be a number',
      field: 'minAgeRestriction'
  })
  }
  if(req.body.publicationDate && (typeof req.body.publicationDate !== 'string' || isNaN(Date.parse(req.body.publicationDate)) || Date.parse(req.body.publicationDate) < Date.parse(req.body.createdAt))){
    errorsMessages.push({
      message: 'publicationDate must be a date format',
      field: 'publicationDate'
  })
}

if(!Array.isArray(req.body.availableResolutions) || !req.body.availableResolutions.every(x => Object.values(VideobleResolutions).includes(x))){
  errorsMessages.push({
    message: 'Available Resolutions must be an array',
    field: 'availableResolutions'
})
}

if(errorsMessages.length > 0){
  res.status(400).send({errorsMessages})
  return
}

  
  video.title = req.body.title
  video.author = req.body.author
  video.availableResolutions = req.body.availableResolutions ?? video.availableResolutions
  video.canBeDownloaded = req.body.canBeDownloaded ?? video.canBeDownloaded
  video.minAgeRestriction = req.body.minAgeRestriction ?? video.minAgeRestriction
  video.publicationDate = req.body.publicationDate ?? video.publicationDate

  res.status(204).send(video)
})

app.get('/videos/:id', (req: Request, res: Response) => {
  const video = videos.find(x => x.id === +req.params.id)
  if(video){
    res.status(200).send(video)
  }
  else{
    res.status(404).send('Video not found')
  }
})

app.delete('/videos/:id', (req: Request, res: Response) => {
  const video = videos.filter(x => x.id !== +req.params.id)
  if(video.length < videos.length){
    videos = video
    res.status(204).send(video)
  }
  else{
    res.status(404).send('Video not found')
  }
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })