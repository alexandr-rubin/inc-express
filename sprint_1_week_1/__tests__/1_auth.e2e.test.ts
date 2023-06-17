import request from 'supertest'
import { app } from '../src/setting'
import { HttpStatusCode } from '../src/helpers/httpStatusCode'
import { userQueryRepository } from '../src/queryRepositories/userQuertyRepository'
import mongoose from 'mongoose'

const registrationWithIncorrectData = {
    login: 'x',
    password: '',
    email: 'zxc'
}

const registrationWithCorrectData = {
    login: 'qwertyas',
    password: 'zxcvbnmasd',
    email: 'zxcalex@gmail.com'
}

const loginCorrectData = {
    loginOrEmail: 'qwertyas',
    password: 'zxcvbnmasd'
}

const loginIncorrectData = {
    loginOrEmail: '',
    password: ''
}

const loginWrongData = {
    loginOrEmail: 'qqqqqqq',
    password: 'qqqqqq'
}

const incorrectConfirmationCode = 'qwerty'
const incorrectEmail = 'aaaaaaaa@mail.com'

describe('/auth', () => {
    beforeAll(async () => {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/testDb'
        await mongoose.connect(MONGODB_URI)
        await request(app).delete('/testing/all-data').expect(HttpStatusCode.NO_CONTENT_204)
    })
    afterAll(async () => {
        await mongoose.connection.close()
    })
    it('+GET products = []', async () => {
        await request(app).get('/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect({ pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
        await request(app).get('/comments').expect([])
        await request(app).get('/blogs').expect({ pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
        await request(app).get('/posts').expect({ pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })
    it('-POST registration with incorrect value', async () => {
        await request(app).post('/auth/registration').send(registrationWithIncorrectData).expect(HttpStatusCode.BAD_REQUEST_400, {errorsMessages: [
            { message: 'Invalid value', field: 'login' },
            { message: 'Invalid value', field: 'password' },
            { message: 'Invalid value', field: 'email' }
        ]})
    })
    it('+POST registration with correct value', async () => {
        await request(app).post('/auth/registration').send(registrationWithCorrectData).expect(HttpStatusCode.NO_CONTENT_204)
    })
    it('-POST registration-email-resending with incorrect email', async () => {
        await request(app).post('/auth/registration-email-resending').send({email: incorrectEmail}).expect(HttpStatusCode.BAD_REQUEST_400, {errorsMessages: [
            { message: 'Wrong email', field: 'email' }
        ]})
    })
    it('+POST registration-email-resending with correct email', async () => {
        await request(app).post('/auth/registration-email-resending').send({email: registrationWithCorrectData.email}).expect(HttpStatusCode.NO_CONTENT_204)
    })
    it('-POST registration-confirmation with incorrect confirmation code', async () => {
        await request(app).post('/auth/registration-confirmation').send({code: incorrectConfirmationCode}).expect(HttpStatusCode.BAD_REQUEST_400, {errorsMessages: [
            { message: 'Wrong confirmation code', field: 'code' }
        ]})
    })
    it('+POST registration-confirmation with correct confirmation code', async () => {
        const users = (await request(app).get('/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5')).body.items
        const user = await userQueryRepository.getUserByEmail(users[0].email)
        await request(app).post('/auth/registration-confirmation').send({code: user?.confirmationEmail.confirmationCode}).expect(HttpStatusCode.NO_CONTENT_204)
    })
    it('-POST registration-confirmation confirn confirmed user', async () => {
        const users = (await request(app).get('/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5')).body.items
        const user = await userQueryRepository.getUserByEmail(users[0].email)
        await request(app).post('/auth/registration-confirmation').send({code: user?.confirmationEmail.confirmationCode}).expect(HttpStatusCode.BAD_REQUEST_400)
    })
    it('-POST login with incorrect data', async () => {
        await request(app).post('/auth/login').send(loginIncorrectData).expect(HttpStatusCode.BAD_REQUEST_400, {errorsMessages:[{message:'Invalid value',field:'loginOrEmail'},{message:'Invalid value',field:'password'}]})
    })
    it('-POST login with wrong data', async () => {
        await request(app).post('/auth/login').send(loginWrongData).expect(HttpStatusCode.UNAUTHORIZED_401)
    })
    let accToken = '' 
    it('+POST login with correct data', async () => {
        const response = await request(app).post('/auth/login').send(loginCorrectData).expect(HttpStatusCode.OK_200)
        const { accessToken } = response.body;
        accToken = accessToken
        expect(typeof accessToken).toBe('string');
    })
    it('-GET get current user unauthorized', async () => {
        const users = (await request(app).get('/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5')).body.items
        const user = await userQueryRepository.getUserByEmail(users[0].email)
        await request(app).get('/auth/me').expect(HttpStatusCode.UNAUTHORIZED_401)
    })
    it('+GET get current user', async () => {
        const users = (await request(app).get('/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5')).body.items
        const user = await userQueryRepository.getUserByEmail(users[0].email)
        await request(app).get('/auth/me').set('Authorization', 'Bearer ' + accToken).expect(HttpStatusCode.OK_200, {
            email: user?.email,
            login: user?.login,
            userId: user?.id
        })
    })
})