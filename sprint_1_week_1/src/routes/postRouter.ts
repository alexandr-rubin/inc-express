import { Router, Request, Response } from "express"
import { validationErrorsHandler } from "../middlewares/validation-errors-handler"
import { validatePost } from "../validation/Post"
import { postService } from "../domain/postsService"

export const postsRouter = Router({})

postsRouter.get('/', async (req: Request, res: Response) => {
    res.status(200).send(await postService.getPosts(req))
})

postsRouter.post('/', validatePost, validationErrorsHandler, async (req: Request, res: Response) => {
    return res.status(201).send(await postService.addPost(req.body))
})

postsRouter.get('/:id', async (req: Request, res: Response) => {
    const blog = await postService.getPostById(req.params.id)
    if(blog) {
        res.status(200).send(blog)
    }
    res.status(404).send('Post not found')
})

postsRouter.put('/:id', validatePost, validationErrorsHandler, async (req: Request, res: Response) => {
    const post = await postService.updatePostByid(req.params.id, req.body)
    if (post){
        return res.status(204).send(post)
    }
    return res.status(404).send('Not found')
})

postsRouter.delete('/:id', async (req: Request, res: Response) => {
    if(await postService.deletePostById(req.params.id)) {
        res.status(204).send('Post deleted')
    }
    res.status(404).send('Post not found')
})