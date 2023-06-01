import { Router, Request, Response } from "express"
import { validateLogin  } from "../validation/Login"
import { validationErrorsHandler } from "../middlewares/validation-errors-handler"
import { authorizationService } from "../domain/authorizationService"
import { jwtService } from "../application/jwtService"
import { authMiddleware } from "../middlewares/jwtAuth"
import { validateUser } from "../validation/User"
import { validateEmail } from "../validation/Email"
import { validateConfirmationCode } from "../validation/ConfirmationCode"
import { HttpStatusCode } from "../helpers/httpStatusCode"

export const authorizationRouterRouter = Router({})

authorizationRouterRouter.post('/login', validateLogin, validationErrorsHandler, async (req: Request, res: Response) => {
    const user = await authorizationService.login(req.body)
    if(!user){
        return res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)
    }
    const token = await jwtService.createJWT(user)
    return res.status(HttpStatusCode.OK_200).send({accessToken: token})
})
// !!0, 
authorizationRouterRouter.get('/me', authMiddleware, validationErrorsHandler, async (req: Request, res: Response) => {
    // ид
    // файд by id
    //
    const result = {
        email: req.user?.email,
        login: req.user?.login,
        userId: req.user?.id
    }   
    return res.status(HttpStatusCode.OK_200).send(result)
})

authorizationRouterRouter.post('/registration', validateUser, validationErrorsHandler, async (req: Request, res: Response) => {
    const isCreated = authorizationService.createUser(req.body)
    if(!isCreated){
        return res.sendStatus(HttpStatusCode.BAD_REQUEST_400)
    }
    return  res.status(HttpStatusCode.NO_CONTENT_204).send('Input data is accepted. Email with confirmation code will be send to passed email address')
})

authorizationRouterRouter.post('/registration-confirmation', validateConfirmationCode, validationErrorsHandler, async (req: Request, res: Response) => {
    const isConfirmed = await authorizationService.confrmEmail(req.body.code)
    if(!isConfirmed){
        return res.sendStatus(HttpStatusCode.BAD_REQUEST_400)
    }
    return res.status(HttpStatusCode.NO_CONTENT_204).send('Email was verified. Account was activated')
})

authorizationRouterRouter.post('/registration-email-resending', validateEmail, validationErrorsHandler, async (req: Request, res: Response) => {
    const isResended = await authorizationService.resendEmail(req.body.email)
    if(!isResended){
        return res.sendStatus(HttpStatusCode.BAD_REQUEST_400) 
    }
    return res.status(HttpStatusCode.NO_CONTENT_204).send('Input data is accepted. Email with confirmation code will be send to passed email address')
})