import { Router, Request, Response } from "express"
import { postVideo, putVideo } from "../validation/Video"

export const videosRouter = Router({})
export const testingVideosRouter = Router({})

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

testingVideosRouter.delete('/', (req: Request, res: Response) => {
    videos = []
    res.status(204).send('All data is deleted') 
})

videosRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send(videos)
})

videosRouter.post('/', (req: Request, res: Response) => {
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

    const validationResult = postVideo(newVideo)
    if(validationResult.length > 0){
        res.status(400).send({validationResult})
        return
    }
    
    videos.push(newVideo)
    res.status(201).send(newVideo)
})

videosRouter.get('/:id', (req: Request, res: Response) => {
    const video = videos.find(x => x.id === +req.params.id)
    if(video){
        res.status(200).send(video)
    }
    else{
        res.status(404).send('Video not found')
    }
})

videosRouter.put('/:id', (req: Request, res: Response) => {
    const video = videos.find(x => x.id === +req.params.id)
    if(!video){
        res.status(404).send('Video not found')
        return
    }

    const validationResult = putVideo(req.body)
    if(validationResult.length > 0){
        res.status(400).send({validationResult})
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

videosRouter.get('/:id', (req: Request, res: Response) => {
    const video = videos.find(x => x.id === +req.params.id)
    if(video){
        res.status(200).send(video)
    }
    else{
        res.status(404).send('Video not found')
    }
})

videosRouter.delete('/:id', (req: Request, res: Response) => {
    const video = videos.filter(x => x.id !== +req.params.id)
    if(video.length < videos.length){
        videos = video
        res.status(204).send(video)
    }
    else{
        res.status(404).send('Video not found')
    }
})