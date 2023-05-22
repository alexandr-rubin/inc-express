import { Router, Request, Response } from "express"
import { validateLogin  } from "../validation/Login"
import { validationErrorsHandler } from "../middlewares/validation-errors-handler"
import { loginService } from "../domain/loginService"
import { jwtService } from "../application/jwtService"
import { authMiddleware } from "../middlewares/jwtAuth"

export const loginRouter = Router({})

loginRouter.post('/login', validateLogin, validationErrorsHandler, async (req: Request, res: Response) => {
    const user = await loginService.login(req.body)
    if(user !== null){
        const token = await jwtService.createJWT(user)
        res.status(200).send({accessToken: token})
    }
    else{
        res.sendStatus(401)
    }
})

loginRouter.get('/me', authMiddleware, validationErrorsHandler, async (req: Request, res: Response) => {
    const user = req.body.user
    return res.status(200).send(user)
})