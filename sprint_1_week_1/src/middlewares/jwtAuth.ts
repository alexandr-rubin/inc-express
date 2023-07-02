import { NextFunction, Request, Response } from "express"
import { JWTService } from "../application/jwtService"
import { UserQueryRepository } from "../queryRepositories/userQuertyRepository"
import { HttpStatusCode } from "../helpers/httpStatusCode"
import { container } from "../composition-root"

const jwtService = container.resolve(JWTService)

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const userQueryRepositoryInst = new UserQueryRepository()
    if (!req.headers.authorization) {
        return res.status(HttpStatusCode.UNAUTHORIZED_401).send('Not authorized')
    }
    
    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwtService.getUserIdByToken(token)
    if(userId){
        const user = (await userQueryRepositoryInst.getUsers(req)).items.find(item => item.id === userId)
        req.user = user
        return next()
    }

    return res.status(HttpStatusCode.UNAUTHORIZED_401).send('User not found')
}