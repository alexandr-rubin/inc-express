import { Router, Request, Response } from "express"
import { validateUser  } from "../validation/User"
import { validationErrorsHandler } from "../middlewares/validation-errors-handler"
import { userService } from "../domain/userService"

export const usersRouter = Router({})

usersRouter.get('/', async (req: Request, res: Response) => {
    return res.status(200).send(await userService.getUsers(req))
})

usersRouter.post('/', validateUser, validationErrorsHandler, async (req: Request, res: Response) => {
    const user = await userService.addUser(req.body)
    return res.status(201).send(user)
})

usersRouter.delete('/:id', async (req: Request, res: Response) => {
    if(await userService.deleteUserById(req.params.id)) {
        return res.status(204).send('User deleted')
    }
    return res.status(404).send('User not found')
})