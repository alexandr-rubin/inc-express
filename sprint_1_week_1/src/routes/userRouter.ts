import { Router, Request, Response } from "express"
import { validateUser  } from "../validation/User"
import { validationErrorsHandler } from "../middlewares/validation-errors-handler"
import { userService } from "../domain/userService"
import { basicAuthMiddleware } from "../middlewares/basicAuth"
import { userQueryRepository } from "../queryRepositories/userQuertyRepository"
import { HttpStatusCode } from "../helpers/httpStatusCode"

export const usersRouter = Router({})

usersRouter.get('/', async (req: Request, res: Response) => {
    return res.status(HttpStatusCode.OK_200).send(await userQueryRepository.getUsers(req))
})

usersRouter.post('/', basicAuthMiddleware, validateUser, validationErrorsHandler, async (req: Request, res: Response) => {
    const user = await userService.addUser(req.body)
    return res.status(HttpStatusCode.CREATED_201).send(user)
})

usersRouter.delete('/:id', basicAuthMiddleware, async (req: Request, res: Response) => {
    const isDeleted = await userService.deleteUserById(req.params.id)
    if(!isDeleted) {
        return res.status(HttpStatusCode.NOT_FOUND_404).send('User not found')
    }
    return res.status(HttpStatusCode.NO_CONTENT_204).send('User deleted')
})