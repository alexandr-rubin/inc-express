import { Router, Request, Response } from "express"
import { validationErrorsHandler } from "../middlewares/validation-errors-handler"
import { validatePost } from "../validation/Post"
import { postService } from "../domain/postsService"
import { authMiddleware } from "../middlewares/jwtAuth"
import { validateComment } from "../validation/Comment"
import { basicAuthMiddleware } from "../middlewares/basicAuth"
import { postQueryRepository } from "../queryRepositories/postQueryRepository"

export const postsRouter = Router({})

postsRouter.get('/', async (req: Request, res: Response) => {
    res.status(200).send(await postQueryRepository.getPosts(req))
})

postsRouter.post('/', basicAuthMiddleware, validatePost, validationErrorsHandler, async (req: Request, res: Response) => {
    const result = await postService.addPost(req.body)
    return res.status(201).send(result.data)
})

postsRouter.get('/:id', async (req: Request, res: Response) => {
    const blog = await postQueryRepository.getPostById(req.params.id)
    if(blog) {
        return res.status(200).send(blog)
    }
    return res.status(404).send('Post not found')
})

postsRouter.put('/:id', basicAuthMiddleware, validatePost, validationErrorsHandler, async (req: Request, res: Response) => {
    const post = await postService.updatePostByid(req.params.id, req.body)
    if (post){
        return res.status(204).send(post)
    }
    return res.status(404).send('Not found')
})

postsRouter.delete('/:id', basicAuthMiddleware, async (req: Request, res: Response) => {
    if(await postService.deletePostById(req.params.id)) {
        return res.status(204).send('Post deleted')
    }
    return res.status(404).send('Post not found')
})

postsRouter.post('/:postId/comments', authMiddleware, validateComment, validationErrorsHandler, async (req: Request, res: Response) => {
    const comment = await postService.createComment(req.user!, req.body.content, req.params.postId)
    if(comment !== null){
        const {postId, ...result} = comment
        return res.status(201).send(result)
    }
    else{
        return res.sendStatus(404)
    }
})

postsRouter.get('/:postId/comments', async (req: Request, res: Response) => {
    const comments = await postQueryRepository.getCommentsForSpecifiedPost(req.params.postId, req)
    if(comments === null) {
        return res.status(404).send('Post not found')
    }
    return res.status(200).send(comments)
})