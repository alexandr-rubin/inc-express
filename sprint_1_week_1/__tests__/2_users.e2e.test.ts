import request from 'supertest'
import { app } from '../src/setting'
import { HttpStatusCode } from '../src/helpers/httpStatusCode'
import { userQueryRepository } from '../src/queryRepositories/userQuertyRepository'

const sueradminUserCorrect = {
    login: 'superadmin',
    password: 'superadmin',
    email: 'superadmin@gmail.com'
}

const sueradminUserIncorrect = {
    login: '',
    password: '',
    email: ''
}

const userCorrectData = {
    loginOrEmail: 'qwertyas',
    password: 'zxcvbnmasd'
}

let accToken = '' 

describe('/users', () => {
    beforeAll(async () => {
        const response = await request(app).post('/auth/login').send(userCorrectData).expect(HttpStatusCode.OK_200)
        const { accessToken } = response.body;
        accToken = accessToken
    })
    it('-POST create superadmin user with incorrect data', async () => {
        await request(app).post('/users').send(sueradminUserIncorrect).set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(HttpStatusCode.BAD_REQUEST_400)
    })
    it('-POST create superadmin user unauthorized', async () => {
        await request(app).post('/users').send(sueradminUserIncorrect).expect(HttpStatusCode.UNAUTHORIZED_401)
    })
    it('+POST create superadmin user with correct data', async () => {
        const response = await request(app).post('/users').send(sueradminUserCorrect).set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(HttpStatusCode.CREATED_201)
        const { email } = response.body
        const createdUser = await userQueryRepository.getUserByEmail(email)
        expect(createdUser?.id).toEqual(response.body.id)
    })
    it('-GET get users unauthorized', async () => {
        await request(app).get('/users').expect(HttpStatusCode.UNAUTHORIZED_401)
    })
    it('+GET get users', async () => {
        const response = await request(app).get('/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(HttpStatusCode.OK_200)
        expect(response.body.items).toHaveLength(2)
    })
})