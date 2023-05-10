import { Router, Request, Response } from "express"
import { postRepository } from "../repositories/post-respository"
import { validationErrorsHandler } from "../middlewares/validation-errors-handler"
import { validatePost } from "../validation/Post"
import { ObjectId } from 'mongodb'

export const postsRouter = Router({})

postsRouter.get('/', async (req: Request, res: Response) => {
    res.status(200).send(await postRepository.getPosts())
})

postsRouter.post('/', validatePost, validationErrorsHandler, async (req: Request, res: Response) => {
    return res.status(201).send(await postRepository.addPost(req.body))
})

postsRouter.get('/:id', async (req: Request, res: Response) => {
    const blog = await postRepository.getPostById(new ObjectId(req.params.id))
    if(blog) {
        res.status(200).send(blog)
    }
    else{
        res.status(404).send('Post not found')
    }
})

postsRouter.put('/:id', validatePost, validationErrorsHandler, async (req: Request, res: Response) => {
    const post = await postRepository.updatePostByid(new ObjectId(req.params.id), req.body)
    if (post){
        return res.status(204).send(post)
    }
    return res.status(404).send('Not found')
})

postsRouter.delete('/:id', async (req: Request, res: Response) => {
    if(await postRepository.deletePostById(new ObjectId(req.params.id))) {
        res.status(204).send('Post deleted')
    }
    else{
        res.status(404).send('Post not found')
    }
})