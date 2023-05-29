import { Router, Request, Response } from "express"
import { validateLogin  } from "../validation/Login"
import { validationErrorsHandler } from "../middlewares/validation-errors-handler"
import { authorizationService } from "../domain/authorizationService"
import { jwtService } from "../application/jwtService"
import { authMiddleware } from "../middlewares/jwtAuth"
import { validateUser } from "../validation/User"
import { validateEmail } from "../validation/Email"
import { validateConfirmationCode } from "../validation/ConfirmationCode"

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

authorizationRouterRouter.post('/registration', validateUser, validationErrorsHandler, async (req: Request, res: Response) => {
    const result = authorizationService.createUser(req.body)
    if(!result){
        return res.sendStatus(400)
    }
    return  res.status(204).send('Input data is accepted. Email with confirmation code will be send to passed email address')
})

authorizationRouterRouter.post('/registration-confirmation', validateConfirmationCode, validationErrorsHandler, async (req: Request, res: Response) => {
    const result = await authorizationService.confrmEmail(req.body.code)
    if(result){
        return res.status(204).send('Email was verified. Account was activated')
    }
    return res.sendStatus(400)
})

authorizationRouterRouter.post('/registration-email-resending', validateEmail, validationErrorsHandler, async (req: Request, res: Response) => {
    const result = await authorizationService.resendEmail(req.body.email)
    if(result){
        return res.status(204).send('Input data is accepted. Email with confirmation code will be send to passed email address')
    }
    return res.sendStatus(400)
})