import { Router, Request, Response } from "express"
import { validateUser  } from "../validation/User"
import { validationErrorsHandler } from "../middlewares/validation-errors-handler"
import { userService } from "../domain/userService"
import { basicAuthMiddleware } from "../middlewares/basicAuth"
import { userQueryRepository } from "../queryRepositories/userQuertyRepository"

export const usersRouter = Router({})

usersRouter.get('/', async (req: Request, res: Response) => {
    return res.status(200).send(await userQueryRepository.getUsers(req))
})

usersRouter.post('/', basicAuthMiddleware, validateUser, validationErrorsHandler, async (req: Request, res: Response) => {
    const user = await userService.addUser(req.body)
    return res.status(201).send(user)
})

usersRouter.delete('/:id', basicAuthMiddleware, async (req: Request, res: Response) => {
    if(await userService.deleteUserById(req.params.id)) {
        return res.status(204).send('User deleted')
    }
    return res.status(404).send('User not found')
})