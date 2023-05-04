import { Router, Request, Response } from "express"
import { postRepository } from "../repositories/post-respository"
import { validationErrorsHandler } from "../middlewares/validation-errors-handler"
import { validatePost } from "../validation/Post"

export const postsRouter = Router({})

postsRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send(postRepository.getPosts())
})

postsRouter.post('/', validatePost, validationErrorsHandler, (req: Request, res: Response) => {
    return res.status(201).send(postRepository.addPost(req.body))
})

postsRouter.get('/:id', (req: Request, res: Response) => {
    const blog = postRepository.getPostById(req.params.id)
    if(blog !== undefined) {
        res.status(200).send(blog)
    }
    else{
        res.status(404).send('Post not found')
    }
})

postsRouter.put('/:id', validatePost, validationErrorsHandler, (req: Request, res: Response) => {
    const post = postRepository.updatePostByid(req.params.id, req.body)
    if (post){
        return res.status(204).send(post)
    }
    return res.status(404).send('Not found')
})

postsRouter.delete('/:id', (req: Request, res: Response) => {
    if(postRepository.deletePostById(req.params.id)) {
        res.status(204).send('Post deleted')
    }
    else{
        res.status(404).send('Post not found')
    }
})