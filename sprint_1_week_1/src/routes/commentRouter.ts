import { Router, Request, Response } from "express"
import { validateLogin  } from "../validation/Login"
import { validationErrorsHandler } from "../middlewares/validation-errors-handler"
import { loginService } from "../domain/loginService"
import { jwtService } from "../application/jwtService"
import { authMiddleware } from "../middlewares/jwtAuth"
import { validateComment } from "../validation/Comment"
import { commentService } from "../domain/commentService"
import { postService } from "../domain/postsService"

export const commentsRouter = Router({})

commentsRouter.put('/:commentId', authMiddleware, validateComment, validationErrorsHandler, async (req: Request, res: Response) => {
    const comment = await commentService.updateCommentByid(req.params.commentId, req.body.content, req.user!.id)
    if(comment === null){
        return res.sendStatus(403)
    }
    if(!comment){
        return res.status(404).send('Not found')
    }
    return res.sendStatus(204)
})

commentsRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const result = await commentService.deleteCommentById(req.params.id, req.user!.id)
    if(result === null) {
        return res.sendStatus(403)
    }
    if(!result){
        return res.status(404).send('Blog not found')
    }
    return res.status(204).send('Comment deleted')
})

commentsRouter.get('/:id', async (req: Request, res: Response) => {
    const comment = await commentService.getCommentById(req.params.id)
    if(!comment) {
        return res.status(404).send('Comment not found')
    }
    return res.status(200).send(comment)
})