import "reflect-metadata";
import { Router, Request, Response } from "express"
import { validationErrorsHandler } from "../middlewares/validation-errors-handler"
import { validatePost } from "../validation/Post"
import { PostService } from "../domain/postsService"
import { authMiddleware } from "../middlewares/jwtAuth"
import { validateComment } from "../validation/Comment"
import { basicAuthMiddleware } from "../middlewares/basicAuth"
import { PostQueryRepository } from "../queryRepositories/postQueryRepository"
import { HttpStatusCode } from "../helpers/httpStatusCode"
import { JWTService } from "../application/jwtService"
import { container } from "../composition-root"

const postQueryRepository = container.resolve(PostQueryRepository)
const jwtService = container.resolve(JWTService)
const postService = container.resolve(PostService)

export const postsRouter = Router({})

postsRouter.get('/', async (req: Request, res: Response) => {
    res.status(HttpStatusCode.OK_200).send(await postQueryRepository.getPosts(req))
})

postsRouter.post('/', basicAuthMiddleware, validatePost, validationErrorsHandler, async (req: Request, res: Response) => {
    const result = await postService.addPost(req.body)
    return res.status(HttpStatusCode.CREATED_201).send(result.data)
})

postsRouter.get('/:id', async (req: Request, res: Response) => {
    const blog = await postQueryRepository.getPostById(req.params.id)
    if(!blog) {
        return res.status(HttpStatusCode.NOT_FOUND_404).send('Post not found')
    }
    return res.status(HttpStatusCode.OK_200).send(blog)
})

postsRouter.put('/:id', basicAuthMiddleware, validatePost, validationErrorsHandler, async (req: Request, res: Response) => {
    const post = await postService.updatePostByid(req.params.id, req.body)
    if (!post){
        return res.status(HttpStatusCode.NOT_FOUND_404).send('Not found')
    }
    return res.status(HttpStatusCode.NO_CONTENT_204).send(post)
})

postsRouter.delete('/:id', basicAuthMiddleware, async (req: Request, res: Response) => {
    const isDeleted = await postService.deletePostById(req.params.id)
    if(!isDeleted) {
        return res.status(HttpStatusCode.NOT_FOUND_404).send('Post not found')
    }
    return res.status(HttpStatusCode.NO_CONTENT_204).send('Post deleted')
})

postsRouter.post('/:postId/comments', authMiddleware, validateComment, validationErrorsHandler, async (req: Request, res: Response) => {
    const comment = await postService.createComment(req.user!, req.body.content, req.params.postId)
    if(comment === null){
        return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    }
    
    return res.status(HttpStatusCode.CREATED_201).send(comment)
})

postsRouter.get('/:postId/comments', async (req: Request, res: Response) => {
    //fix
    let userId = ''
    const auth = req.headers.authorization
    if(auth){
        const token = auth.split(' ')[1]
        userId = await jwtService.getUserIdByToken(token)
    }
    const comments = await postQueryRepository.getCommentsForSpecifiedPost(req.params.postId, req, userId)
    if(comments === null) {
        return res.status(HttpStatusCode.NOT_FOUND_404).send('Post not found')
    }
    
    return res.status(HttpStatusCode.OK_200).send(comments)
})