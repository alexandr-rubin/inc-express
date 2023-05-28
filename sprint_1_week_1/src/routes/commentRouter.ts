import { Router, Request, Response } from "express"
import { validateLogin  } from "../validation/Login"
import { validationErrorsHandler } from "../middlewares/validation-errors-handler"
import { authorizationService } from "../domain/authorizationService"
import { jwtService } from "../application/jwtService"
import { authMiddleware } from "../middlewares/jwtAuth"
import { validateComment } from "../validation/Comment"
import { commentService } from "../domain/commentService"
import { postService } from "../domain/postsService"
import { ResultCode } from "../helpers/resultCode"

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
    const comment = await commentService.getCommentById(req.params.id)
    if(!comment) {
        return res.status(404).send('Comment not found')
    }
    return res.status(200).send(comment)
})