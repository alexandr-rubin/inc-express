import { NextFunction, Request, Response } from "express"
import { jwtService } from "../application/jwtService"
import { userQueryRepository } from "../queryRepositories/userQuertyRepository"
import { HttpStatusCode } from "../helpers/httpStatusCode"
import { authorizationRepository } from "../repositories/authorizationRepository"

export const verifyRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.refreshToken
    if (!token) {
        return res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)
    }

    const dbToken = await authorizationRepository.getRefreshToken(token)
    if(!dbToken || !dbToken.isValid){
        return res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)
    }
    const userId = await jwtService.getUserIdByToken(token)
    if(userId === null){
        await authorizationRepository.updateRefreshToken(token)
        return res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)
    }

    const user = await userQueryRepository.getUserById(userId)
    if(!user){
        return res.sendStatus(HttpStatusCode.BAD_REQUEST_400)
    }
    req.user = user
    return next()
}