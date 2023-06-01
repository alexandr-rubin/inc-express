import { Router, Request, Response } from "express"
import { validationErrorsHandler } from "../middlewares/validation-errors-handler"
import { authMiddleware } from "../middlewares/jwtAuth"
import { validateComment } from "../validation/Comment"
import { commentService } from "../domain/commentService"
import { ResultCode } from "../helpers/resultCode"
import { commentQueryRepository } from "../queryRepositories/commentQueryRepository"

export const commentsRouter = Router({})

commentsRouter.put('/:commentId', authMiddleware, validateComment, validationErrorsHandler, async (req: Request, res: Response) => {
    const result = await commentService.updateCommentByid(req.params.commentId, req.body.content, req.user!.id)
    if(result.code === ResultCode.NoContent){
        return res.sendStatus(204)
    }
    if(result.code === ResultCode.Forbidden){
        return res.sendStatus(403)
    }
    return res.status(404).send(result.errorMessage)
})

commentsRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const result = await commentService.deleteCommentById(req.params.id, req.user!.id)
    if(result.code === ResultCode.NoContent){
        return res.sendStatus(204)
    }
    if(result.code === ResultCode.Forbidden){
        return res.sendStatus(403)
    }
    return res.status(404).send(result.errorMessage)
})

commentsRouter.get('/:id', async (req: Request, res: Response) => {
    const comment = await commentQueryRepository.getCommentById(req.params.id)
    if(!comment) {
        return res.status(404).send('Comment not found')
    }
    return res.status(200).send(comment)
})