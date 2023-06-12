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
import { verifyRefreshTokenMiddleware } from "../middlewares/verifyRefreshToken"
import { logAPIMiddleware } from "../middlewares/logAPI"

export const authorizationRouterRouter = Router({})

authorizationRouterRouter.post('/login', validateLogin, validationErrorsHandler, logAPIMiddleware, async (req: Request, res: Response) => {
    const user = await authorizationService.login(req.body)
    if(!user){
        return res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)
    }
    const userAgent = req.headers['user-agent']
    const clientIP = req.ip
    const tokens = await jwtService.addDevice(user, userAgent, clientIP)
    if(!tokens){
        return res.sendStatus(HttpStatusCode.BAD_REQUEST_400)
    }
    res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true,secure: true})
    return res.status(HttpStatusCode.OK_200).send({accessToken: tokens.accessToken})
})
authorizationRouterRouter.post('/refresh-token', verifyRefreshTokenMiddleware, validationErrorsHandler, async (req: Request, res: Response) => {
    const user = req.user!
    const oldToken = req.cookies.refreshToken
    const userAgent = req.headers['user-agent']
    const clientIP = req.ip
    const tokens = await jwtService.updateDevice(oldToken, clientIP, userAgent, user)
    if(!tokens){
        return res.sendStatus(HttpStatusCode.BAD_REQUEST_400)
    }
    res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true,secure: true})
    return res.status(HttpStatusCode.OK_200).send({accessToken: tokens.accessToken})
})
authorizationRouterRouter.post('/logout', verifyRefreshTokenMiddleware, validationErrorsHandler, async (req: Request, res: Response) => {
    const oldToken = req.cookies.refreshToken
    const isUpdated = await jwtService.logoutDevice(oldToken)
    if(!isUpdated){
        return res.sendStatus(HttpStatusCode.BAD_REQUEST_400)
    }
    return res.sendStatus(HttpStatusCode.NO_CONTENT_204)
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

authorizationRouterRouter.post('/registration', validateUser, validationErrorsHandler, logAPIMiddleware, async (req: Request, res: Response) => {
    const isCreated = await authorizationService.createUser(req.body)
    if(!isCreated){
        return res.sendStatus(HttpStatusCode.BAD_REQUEST_400)
    }
    return  res.status(HttpStatusCode.NO_CONTENT_204).send('Input data is accepted. Email with confirmation code will be send to passed email address')
})

authorizationRouterRouter.post('/registration-confirmation', validateConfirmationCode, validationErrorsHandler, logAPIMiddleware, async (req: Request, res: Response) => {
    const isConfirmed = await authorizationService.confrmEmail(req.body.code)
    if(!isConfirmed){
        return res.sendStatus(HttpStatusCode.BAD_REQUEST_400)
    }
    return res.status(HttpStatusCode.NO_CONTENT_204).send('Email was verified. Account was activated')
})

authorizationRouterRouter.post('/registration-email-resending', validateEmail, validationErrorsHandler, logAPIMiddleware, async (req: Request, res: Response) => {
    const isResended = await authorizationService.resendEmail(req.body.email)
    if(!isResended){
        return res.sendStatus(HttpStatusCode.BAD_REQUEST_400) 
    }
    return res.status(HttpStatusCode.NO_CONTENT_204).send('Input data is accepted. Email with confirmation code will be send to passed email address')
})