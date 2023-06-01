import { Router, Request, Response } from "express"
import { validationErrorsHandler } from "../middlewares/validation-errors-handler"
import { authMiddleware } from "../middlewares/jwtAuth"
import { validateComment } from "../validation/Comment"
import { commentService } from "../domain/commentService"
import { ResultCode } from "../helpers/resultCode"
import { commentQueryRepository } from "../queryRepositories/commentQueryRepository"
import { HttpStatusCode } from "../helpers/httpStatusCode"

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
    const comment = await commentQueryRepository.getCommentById(req.params.id)
    if(!comment) {
        return res.status(HttpStatusCode.NOT_FOUND_404).send('Comment not found')
    }
    return res.status(HttpStatusCode.OK_200).send(comment)
})