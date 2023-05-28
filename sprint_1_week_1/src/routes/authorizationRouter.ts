import { Router, Request, Response } from "express"
import { validateLogin  } from "../validation/Login"
import { validationErrorsHandler } from "../middlewares/validation-errors-handler"
import { authorizationService } from "../domain/authorizationService"
import { jwtService } from "../application/jwtService"
import { authMiddleware } from "../middlewares/jwtAuth"

export const authorizationRouterRouter = Router({})

authorizationRouterRouter.post('/login', validateLogin, validationErrorsHandler, async (req: Request, res: Response) => {
    const user = await authorizationService.login(req.body)
    if(user !== null){
        const token = await jwtService.createJWT(user)
        res.status(200).send({accessToken: token})
    }
    else{
        res.sendStatus(401)
    }
})

authorizationRouterRouter.get('/me', authMiddleware, validationErrorsHandler, async (req: Request, res: Response) => {
    const result = {
        email: req.user?.email,
        login: req.user?.login,
        userId: req.user?.id
    }   
    return res.status(200).send(result)
})