import { injectable } from "inversify"
import { UserService } from "../domain/userService"
import { HttpStatusCode } from "../helpers/httpStatusCode"
import { UserQueryRepository } from "../queryRepositories/userQuertyRepository"
import { Request, Response } from "express"

@injectable()
export class UserController {
    constructor(protected userService: UserService, protected userQueryRepositoryInst: UserQueryRepository){}
    async getUsers(req: Request, res: Response) {
        return res.status(HttpStatusCode.OK_200).send(await this.userQueryRepositoryInst.getUsers(req))
    }

    async addUser(req: Request, res: Response) {
        const user = await this.userService.addUser(req.body)
        return res.status(HttpStatusCode.CREATED_201).send(user)
    }

    async deleteUser (req: Request, res: Response) {
        const isDeleted = await this.userService.deleteUserById(req.params.id)
        if(!isDeleted) {
            return res.status(HttpStatusCode.NOT_FOUND_404).send('User not found')
        }
        return res.status(HttpStatusCode.NO_CONTENT_204).send('User deleted')
    }
}