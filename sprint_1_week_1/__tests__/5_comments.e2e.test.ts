import request from 'supertest'
import { app } from '../src/setting'
import { HttpStatusCode } from '../src/helpers/httpStatusCode'
import { userQueryRepository } from '../src/queryRepositories/userQuertyRepository'
import mongoose from 'mongoose'

const post = {
    "title": "zxc",
    "shortDescription": "rdsfsdfdsf",
    "content": "string"
}
const newPost = {
    "title": "123",
    "shortDescription": "321",
    "content": "zxc",
    "createdAt": new Date().toISOString()
}
const badValuesPost = {
    "title": "",
    "shortDescription": "",
    "content": "",
    "blogId": ""
}

const blog = {
    "name": "111",
    "description": "111",
    "websiteUrl": "https://translate.google.com/"
}

const sueradminUserCorrect = {
    login: 'superadmin',
    password: 'superadmin',
    email: 'superadmin@gmail.com'
}

const sueradmin2UserCorrect = {
    login: 'supadmin2',
    password: 'supadmin2',
    email: 'supadmin2@gmail.com'
}
const loginCorrectData2 = {
    loginOrEmail: 'supadmin2',
    password: 'supadmin2'
}

const loginCorrectData = {
    loginOrEmail: 'superadmin',
    password: 'superadmin'
}

const comment = {
    "content": "stringstringstringst"
}

const newComment = {
    "content": "stringstringstringst"
}

const badValueComment = {
    "content": ""
}

describe('/comments', () => {
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
    it('+POST create superadmin user with correct data', async () => {
        const response = await request(app).post('/users').send(sueradminUserCorrect).set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(HttpStatusCode.CREATED_201)
        const { email } = response.body
        const createdUser = await userQueryRepository.getUserByEmail(email)
        expect(createdUser?.id).toEqual(response.body.id)
    })
    it('+POST create superadmin user with correct data 2', async () => {
        const response = await request(app).post('/users').send(sueradmin2UserCorrect).set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(HttpStatusCode.CREATED_201)
        const { email } = response.body
        const createdUser = await userQueryRepository.getUserByEmail(email)
        expect(createdUser?.id).toEqual(response.body.id)
    })
    let accToken = '' 
    it('+POST login with correct data', async () => {
        const response = await request(app).post('/auth/login').send(loginCorrectData).expect(HttpStatusCode.OK_200)
        const { accessToken } = response.body;
        accToken = accessToken
        expect(typeof accessToken).toBe('string');
    })
    let accToken2 = '' 
    it('+POST login with correct data 2', async () => {
        const response = await request(app).post('/auth/login').send(loginCorrectData2).expect(HttpStatusCode.OK_200)
        const { accessToken } = response.body;
        accToken2 = accessToken
        expect(typeof accessToken).toBe('string');
    })
    it('+POST new blog', async () => {
        await request(app).post('/blogs').send(blog).set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(HttpStatusCode.CREATED_201)
        const res = await request(app).get('/blogs/').expect(HttpStatusCode.OK_200)
        expect(res.body.items.length).toEqual(1)
    })
    it('+POST new post', async () => {
        const blogs = (await request(app).get('/blogs').expect(HttpStatusCode.OK_200)).body.items
        await request(app).post('/posts').set('Authorization', 'Basic YWRtaW46cXdlcnR5').send({...post, blogId: blogs[0].id}).expect(HttpStatusCode.CREATED_201)
        const res = await (await request(app).get('/posts/')).body.items
        expect(res.length).toEqual(1)
    })
    it('+POST new comment', async () => {
        const posts = (await request(app).get('/posts').expect(HttpStatusCode.OK_200)).body.items
        const comm = await request(app).post('/posts/' + posts[0].id  + '/comments').send(comment).set('Authorization', 'Barer ' + accToken).expect(HttpStatusCode.CREATED_201)
        const res = await request(app).get('/comments/' + comm.body.id).expect(HttpStatusCode.OK_200)
        expect(res.body.id).toEqual(comm.body.id)
    })
    it('- PUT comment by ID unauthorized', async () => {
        const comments = await request(app).get('/comments')
        await request(app)
            .put('/comments/' + comments.body[0].id)
            .send(newComment)
            .expect(HttpStatusCode.UNAUTHORIZED_401)
        
            const res = await request(app).get('/comments').expect(HttpStatusCode.OK_200)
            expect(res.body[0]).toEqual(comments.body[0])
    })
    it('- PUT comment by ID with incorrect id', async () => {
        const oldComment = await request(app).get('/comments').expect(HttpStatusCode.OK_200)
        await request(app)
            .put('/comments/123')
            .set('Authorization', 'Bearer ' + accToken)
            .send(newComment)
            .expect(HttpStatusCode.NOT_FOUND_404)
        
            const res = await request(app).get('/comments').expect(HttpStatusCode.OK_200)
            expect(res.body[0]).toEqual(oldComment.body[0])
    })
    it('- PUT comment by ID with incorrect data', async () => {
        const oldComment = await request(app).get('/comments').expect(HttpStatusCode.OK_200)
        await request(app)
            .put('/comments/' + oldComment.body[0].id)
            .set('Authorization', 'Bearer ' + accToken)
            .send(badValueComment)
            .expect(HttpStatusCode.BAD_REQUEST_400)
        
            const res = await request(app).get('/comments').expect(HttpStatusCode.OK_200)
            expect(res.body[0]).toEqual(oldComment.body[0])
    })
    it('- PUT try edit the comment that is not your own', async () => {
        const oldComment = await request(app).get('/comments').expect(HttpStatusCode.OK_200)
        await request(app)
            .put('/comments/' + oldComment.body[0].id)
            .send(comment)
            .set('Authorization', 'Bearer ' + accToken2)
            .expect(HttpStatusCode.FORBIDDEN_403)
        
            const res = await request(app).get('/comments').expect(HttpStatusCode.OK_200)
            expect(res.body[0]).toEqual(oldComment.body[0])
    })
    it('+ PUT comment by ID with correct data', async () => {
        const oldComment = await request(app).get('/comments').expect(HttpStatusCode.OK_200)
        await request(app)
            .put('/comments/' + oldComment.body[0].id)
            .set('Authorization', 'Bearer ' + accToken)
            .send(comment)
            .expect(HttpStatusCode.NO_CONTENT_204)
        
            const res = await request(app).get('/comments').expect(HttpStatusCode.OK_200)
            expect(res.body[0].content != oldComment.body[0].content)
    })
    it('- GET comment by ID with incorrect id', async () => {
        await request(app).get('/comments/helloWorld').expect(HttpStatusCode.NOT_FOUND_404)
    })
    it('+ GET comment by ID with correct id', async () => {
        const comments = (await request(app).get('/comments')).body
        const { _id, postId, ...result } = comments[0]
        await request(app)
            .get('/comments/' + comments[0].id)
            .expect(HttpStatusCode.OK_200, {...result})
    })
    it('- DELETE comment unauthorized', async () => {
        const comments = (await request(app).get('/comments')).body
        await request(app)
            .delete('/comments/' + comments[0].id)
            .expect(HttpStatusCode.UNAUTHORIZED_401)
        
            const res = await request(app).get('/comments/').expect(HttpStatusCode.OK_200)
            expect(res.body).toHaveLength(1)
    })
    it('- DELETE comment by ID with incorrect id', async () => {
        await request(app)
            .delete('/comments/123')
            .set('Authorization', 'Bearer ' + accToken)
            .expect(HttpStatusCode.NOT_FOUND_404)
        
            const res = await request(app).get('/posts/').expect(HttpStatusCode.OK_200)
            expect(res.body.items).toHaveLength(1)
    })
    it('- DELETE try delete the comment that is not your own', async () => {
        const comments = (await request(app).get('/comments')).body
        await request(app)
            .delete('/comments/' + comments[0].id)
            .set('Authorization', 'Bearer ' + accToken2)
            .expect(HttpStatusCode.FORBIDDEN_403)
        
            const res = await request(app).get('/comments/').expect(HttpStatusCode.OK_200)
            expect(res.body).toHaveLength(1)
    })
    it('+ DELETE comment by ID with correct id', async () => {
        const comments = (await request(app).get('/comments')).body
        await request(app)
            .delete('/comments/' + comments[0].id)
            .set('Authorization', 'Bearer ' + accToken)
            .expect(HttpStatusCode.NO_CONTENT_204)
        
            const res = await request(app).get('/comments/').expect(HttpStatusCode.OK_200)
            expect(res.body).toHaveLength(0)
    })
})