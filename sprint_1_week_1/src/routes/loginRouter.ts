import { Router, Request, Response } from "express"
import { validateLogin  } from "../validation/Login"
import { validationErrorsHandler } from "../middlewares/validation-errors-handler"
import { loginService } from "../domain/loginService"

export const loginRouter = Router({})

loginRouter.post('/login', validateLogin, validationErrorsHandler, async (req: Request, res: Response) => {
    const isLogin = await loginService.login(req.body)
    if(isLogin)
        return res.sendStatus(204)
    return res.sendStatus(401)
})