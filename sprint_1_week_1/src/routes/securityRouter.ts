import { Router, Request, Response } from "express"
import { HttpStatusCode } from "../helpers/httpStatusCode"
import { verifyRefreshTokenMiddleware } from "../middlewares/verifyRefreshToken"
import { jwtService, securityQueryRepository } from "../composition-root"

export const securityRouter = Router({})

securityRouter.get('/devices', verifyRefreshTokenMiddleware, async (req: Request, res: Response) => {
    // почему без авторизации
    return res.status(HttpStatusCode.OK_200).send(await securityQueryRepository.getDevicesForCurrentUser(req.cookies.refreshToken))
})
securityRouter.delete('/devices', verifyRefreshTokenMiddleware, async (req: Request, res: Response) => {
    const isTerminated = await jwtService.terminateAllDeviceSessions(req.cookies.refreshToken)
    if(!isTerminated){
        //какую ошибку
        return res.sendStatus(HttpStatusCode.BAD_REQUEST_400)
    }

    return res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})
securityRouter.delete('/devices/:deviceId', verifyRefreshTokenMiddleware, async (req: Request, res: Response) => {
    const isTerminated = await jwtService.terminateSpecifiedDeviceSessions(req.params.deviceId, req.cookies.refreshToken)
    if(isTerminated === false){
        // принимать объект
        return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    }
    if(isTerminated === null ){
        return res.sendStatus(HttpStatusCode.FORBIDDEN_403)
    }

    return res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})