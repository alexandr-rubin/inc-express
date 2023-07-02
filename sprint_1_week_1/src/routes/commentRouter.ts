import { Router, Request, Response } from "express"
import { validationErrorsHandler } from "../middlewares/validation-errors-handler"
import { authMiddleware } from "../middlewares/jwtAuth"
import { validateComment } from "../validation/Comment"
import { CommentService } from "../domain/commentService"
import { ResultCode } from "../helpers/resultCode"
import { CommentQueryRepository } from "../queryRepositories/commentQueryRepository"
import { HttpStatusCode } from "../helpers/httpStatusCode"
import { validateLike } from "../validation/Like"
import { JWTService } from "../application/jwtService"
import { container } from "../composition-root"

const commentQueryRepository = container.resolve(CommentQueryRepository)
const jwtService = container.resolve(JWTService)
const commentService = container.resolve(CommentService)

export const commentsRouter = Router({})

commentsRouter.put('/:commentId', authMiddleware, validateComment, validationErrorsHandler, async (req: Request, res: Response) => {
    const result = await commentService.updateCommentByid(req.params.commentId, req.body.content, req.user!.id)
    if(result.code === ResultCode.NoContent){
        return res.sendStatus(HttpStatusCode.NO_CONTENT_204)
    }
    if(result.code === ResultCode.Forbidden){
        return res.sendStatus(HttpStatusCode.FORBIDDEN_403)
    }
    return res.status(HttpStatusCode.NOT_FOUND_404).send(result.errorMessage)
})

commentsRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const result = await commentService.deleteCommentById(req.params.id, req.user!.id)
    if(result.code === ResultCode.NoContent){
        return res.sendStatus(HttpStatusCode.NO_CONTENT_204)
    }
    if(result.code === ResultCode.Forbidden){
        return res.sendStatus(HttpStatusCode.FORBIDDEN_403)
    }
    return res.status(HttpStatusCode.NOT_FOUND_404).send(result.errorMessage)
})

commentsRouter.get('/:id', async (req: Request, res: Response) => {
    //wtf откуда токен
    let userId = ''
    const auth = req.headers.authorization
    if(auth){
        const token = auth.split(' ')[1]
        userId = await jwtService.getUserIdByToken(token)
    }
    const comment = await commentQueryRepository.getCommentById(req.params.id, userId)
    if(!comment) {
        return res.status(HttpStatusCode.NOT_FOUND_404).send('Comment not found')
    }
    return res.status(HttpStatusCode.OK_200).send(comment)
})

commentsRouter.get('/', async (req: Request, res: Response) => {
    return res.status(HttpStatusCode.OK_200).send(await commentQueryRepository.getAllComments())
})

commentsRouter.put('/:commentId/like-status', authMiddleware, validateLike, validationErrorsHandler, async (req: Request, res: Response) => {
    const result = await commentService.updateCommentLikeStatus(req.params.commentId, req.body.likeStatus, req.user!.id)
    if(!result){
        return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    }
    return res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})