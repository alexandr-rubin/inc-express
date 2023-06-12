import { NextFunction, Request, Response } from "express"
import { jwtService } from "../application/jwtService"
import { userQueryRepository } from "../queryRepositories/userQuertyRepository"
import { HttpStatusCode } from "../helpers/httpStatusCode"
import { authorizationRepository } from "../repositories/authorizationRepository"

export const verifyRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.refreshToken
    if (!token) {
        return res.status(HttpStatusCode.UNAUTHORIZED_401).send('No refresh token')
    }

    const device = await jwtService.getDeviceByToken(token)
    const isCompare = await jwtService.compareTokenDate(token)
    if(!device || !device.isValid || !isCompare){
        return res.status(HttpStatusCode.UNAUTHORIZED_401).send('Invalid device')
    }

    const userId = await jwtService.getUserIdByToken(token)
    if(userId === null){
        await jwtService.logoutDevice(token)
        return res.status(HttpStatusCode.UNAUTHORIZED_401).send('Invalid user')
    }

    const user = await userQueryRepository.getUserById(userId)
    if(!user){
        return res.sendStatus(HttpStatusCode.BAD_REQUEST_400)
    }
    req.user = user
    return next()
}