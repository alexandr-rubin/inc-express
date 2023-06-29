import request from 'supertest'
import { app } from '../src/setting'
import { HttpStatusCode } from '../src/helpers/httpStatusCode'
import { UserQueryRepository } from '../src/queryRepositories/userQuertyRepository'
import mongoose from 'mongoose'
import { userQueyRepository } from '../src/composition-root'

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

const registrationWithCorrectData = {
    login: 'qwertyas',
    password: 'zxcvbnmasd',
    email: 'zxcalex@gmail.com'
}

describe('/users', () => {
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
    it('-POST create superadmin user with incorrect data', async () => {
        await request(app).post('/users').send(sueradminUserIncorrect).set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(HttpStatusCode.BAD_REQUEST_400)
    })
    it('-POST create superadmin user unauthorized', async () => {
        await request(app).post('/users').send(sueradminUserIncorrect).expect(HttpStatusCode.UNAUTHORIZED_401)
    })
    it('+POST create superadmin user with correct data', async () => {
        const response = await request(app).post('/users').send(sueradminUserCorrect).set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(HttpStatusCode.CREATED_201)
        const { email } = response.body
        const createdUser = await userQueyRepository.getUserByEmail(email)
        expect(createdUser?.id).toEqual(response.body.id)
    })
    it('-GET get users unauthorized', async () => {
        await request(app).get('/users').expect(HttpStatusCode.UNAUTHORIZED_401)
    })
    it('+GET get users', async () => {
        const response = await request(app).get('/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(HttpStatusCode.OK_200)
        expect(response.body.items).toHaveLength(1)
    })
    it('-DELETE user by id unauthorized', async () => {
        let response = await request(app).get('/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(HttpStatusCode.OK_200)
        await request(app).delete('/users/' + response.body.items[0].id).expect(HttpStatusCode.UNAUTHORIZED_401)
        response = await request(app).get('/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(HttpStatusCode.OK_200)
        expect(response.body.items).toHaveLength(1)
    })
    it('-DELETE user by id user is not exists', async () => {
        let response = await request(app).get('/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(HttpStatusCode.OK_200)
        await request(app).delete('/users/123').set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(HttpStatusCode.NOT_FOUND_404)
        response = await request(app).get('/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(HttpStatusCode.OK_200)
        expect(response.body.items).toHaveLength(1)
    })
    it('+DELETE user by id', async () => {
        let response = await request(app).get('/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(HttpStatusCode.OK_200)
        await request(app).delete('/users/' + response.body.items[0].id).set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(HttpStatusCode.NO_CONTENT_204)
        response = await request(app).get('/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(HttpStatusCode.OK_200)
        expect(response.body.items).toHaveLength(0)
    })
})