import { Router } from "express"
import { validateUser  } from "../validation/User"
import { validationErrorsHandler } from "../middlewares/validation-errors-handler"
import { basicAuthMiddleware } from "../middlewares/basicAuth"
import { container } from "../composition-root"
import { UserController } from "../controllers/userController"

const userController = container.resolve(UserController)

export const usersRouter = Router({})

usersRouter.get('/', basicAuthMiddleware, userController.getUsers.bind(userController))

usersRouter.post('/', basicAuthMiddleware, validateUser, validationErrorsHandler, userController.addUser.bind(userController))

usersRouter.delete('/:id', basicAuthMiddleware, userController.deleteUser.bind(userController))