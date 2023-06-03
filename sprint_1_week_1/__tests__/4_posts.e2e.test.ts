import request from 'supertest'
import { app } from '../src/setting'
import { HttpStatusCode } from '../src/helpers/httpStatusCode'
import { userQueryRepository } from '../src/queryRepositories/userQuertyRepository'

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
const newBlog = {
    "name": "111",
    "description": "111",
    "websiteUrl": "https://translate.google.com/",
    "createdAt": new Date().toISOString()
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

const loginCorrectData = {
    loginOrEmail: 'superadmin',
    password: 'superadmin'
}

const comment = {
    "content": "stringstringstringst"
}

const badValueComment = {
    "content": ""
}

describe('/posts', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(HttpStatusCode.NO_CONTENT_204)
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
    let accToken = '' 
    it('+POST login with correct data', async () => {
        const response = await request(app).post('/auth/login').send(loginCorrectData).expect(HttpStatusCode.OK_200)
        const { accessToken } = response.body;
        accToken = accessToken
        expect(typeof accessToken).toBe('string');
    })
    it('+POST new blog', async () => {
        await request(app).post('/blogs').send(blog).set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(HttpStatusCode.CREATED_201)
        const res = await request(app).get('/blogs/').expect(HttpStatusCode.OK_200)
        expect(res.body.items.length).toEqual(1)
    })
    it('-POST new post unauthorized', async () => {
        await request(app).post('/posts').send(post).expect(HttpStatusCode.UNAUTHORIZED_401)
    })
    it('-POST new post with bad value', async () => {
        await request(app).post('/posts').set('Authorization', 'Basic YWRtaW46cXdlcnR5').send(badValuesPost).expect(HttpStatusCode.BAD_REQUEST_400, {
            errorsMessages: [
                { message: 'Invalid value', field: 'title' },
                { message: 'Invalid value', field: 'shortDescription' },
                { message: 'Invalid value', field: 'content' },
                { message: 'Invalid value', field: 'blogId' }
            ]
        })
    })
    it('+POST new post', async () => {
        const blogs = (await request(app).get('/blogs').expect(HttpStatusCode.OK_200)).body.items
        await request(app).post('/posts').set('Authorization', 'Basic YWRtaW46cXdlcnR5').send({...post, blogId: blogs[0].id}).expect(HttpStatusCode.CREATED_201)
        const res = await (await request(app).get('/posts/')).body.items
        expect(res.length).toEqual(1)
    })
    it('- GET post by ID with incorrect id', async () => {
        await request(app).get('/posts/helloWorld').expect(HttpStatusCode.NOT_FOUND_404)
    })
    it('+ GET post by ID with correct id', async () => {
        const posts = (await request(app).get('/posts')).body.items
        await request(app)
            .get('/posts/' + posts[0].id)
            .expect(HttpStatusCode.OK_200,posts[0])
    })
    it('+ GET all posts', async () => {
        const res = await request(app)
            .get('/posts/')
            .expect(HttpStatusCode.OK_200)
        expect(res.body.items.length).toEqual(1)
    })
    it('- PUT post by ID unauthorized', async () => {
        const posts = (await request(app).get('/posts')).body.items
        await request(app)
            .put('/posts/' + posts[0].id)
            .send(newPost)
            .expect(HttpStatusCode.UNAUTHORIZED_401)
        
            const res = await request(app).get('/posts/').expect(HttpStatusCode.OK_200)
            expect(res.body.items[0]).toEqual(posts[0])
    })
    it('- PUT post by ID with incorrect id', async () => {
        const blogs = (await request(app).get('/blogs')).body.items
        const posts = (await request(app).get('/posts')).body.items
        await request(app)
            .put('/posts/' + 1223)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({...newPost, blogId: blogs[0].id})
            .expect(HttpStatusCode.NOT_FOUND_404)
        
            const res = await request(app).get('/posts/').expect(HttpStatusCode.OK_200)
            expect(res.body.items[0]).toEqual(posts[0])
    })
    it('- PUT post by ID with incorrect data', async () => {
        const posts = (await request(app).get('/posts')).body.items
        await request(app)
            .put('/posts/' + posts[0].id)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(badValuesPost)
            .expect(HttpStatusCode.BAD_REQUEST_400)
        
            const res = await request(app).get('/posts/').expect(HttpStatusCode.OK_200)
            expect(res.body.items[0]).toEqual(posts[0])
    })
    it('+ PUT post by ID with correct data', async () => {
        const blogs = (await request(app).get('/blogs')).body.items
        const posts = (await request(app).get('/posts')).body.items
        await request(app)
            .put('/posts/' + posts[0].id)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({...newPost, blogId: blogs[0].id})
            .expect(HttpStatusCode.NO_CONTENT_204)
        
            const res = await request(app).get('/posts/').expect(HttpStatusCode.OK_200)
            expect(res.body.items[0]).toEqual({id: posts[0].id, ...newPost, blogId: blogs[0].id, blogName: blogs[0].name, createdAt: posts[0].createdAt})
    })
    it('- DELETE post unauthorized', async () => {
        const posts = (await request(app).get('/posts')).body.items
        await request(app)
            .delete('/posts/876328' + posts[0].id)
            .expect(HttpStatusCode.UNAUTHORIZED_401)
        
            const res = await request(app).get('/posts/').expect(HttpStatusCode.OK_200)
            expect(res.body.items).toHaveLength(1)
    })
    it('- DELETE post by ID with incorrect id', async () => {
        await request(app)
            .delete('/posts/876328')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HttpStatusCode.NOT_FOUND_404)
        
            const res = await request(app).get('/posts/').expect(HttpStatusCode.OK_200)
            expect(res.body.items).toHaveLength(1)
    })
    it('+ DELETE post by ID with correct id', async () => {
        const posts = (await request(app).get('/posts')).body.items
        await request(app)
            .delete('/posts/' + posts[0].id)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HttpStatusCode.NO_CONTENT_204)
        
            const res = await request(app).get('/posts/').expect(HttpStatusCode.OK_200)
            expect(res.body.items).toHaveLength(0)
    })
    it('+POST new post', async () => {
        const blogs = (await request(app).get('/blogs').expect(HttpStatusCode.OK_200)).body.items
        await request(app).post('/posts').set('Authorization', 'Basic YWRtaW46cXdlcnR5').send({...post, blogId: blogs[0].id}).expect(HttpStatusCode.CREATED_201)
        const res = await (await request(app).get('/posts/')).body.items
        expect(res.length).toEqual(1)
    })
    it('-POST new comment unauthorized', async () => {
        const posts = (await request(app).get('/posts').expect(HttpStatusCode.OK_200)).body.items
        await request(app).post('/posts/' + posts[0].id + '/comments').send(comment).expect(HttpStatusCode.UNAUTHORIZED_401)
    })
    it('-POST new comment with icorrect id', async () => {
        await request(app).post('/posts/123/comments').send(comment).set('Authorization', 'Bearer ' + accToken).expect(HttpStatusCode.NOT_FOUND_404)
    })
    it('-POST new comment with bad value', async () => {
        const posts = (await request(app).get('/posts').expect(HttpStatusCode.OK_200)).body.items
        await request(app).post('/posts/' + posts[0].id + '/comments').send(badValueComment).set('Authorization', 'Bearer ' + accToken).expect(HttpStatusCode.BAD_REQUEST_400, {
            errorsMessages: [
                { message: 'Invalid value', field: 'content' }
            ]
        })
    })
    it('+POST new comment', async () => {
        const posts = (await request(app).get('/posts').expect(HttpStatusCode.OK_200)).body.items
        const comm = await request(app).post('/posts/' + posts[0].id  + '/comments').send(comment).set('Authorization', 'Bearer ' + accToken).expect(HttpStatusCode.CREATED_201)
        const res = await request(app).get('/comments/' + comm.body.id).expect(HttpStatusCode.OK_200)
        expect(res.body.id).toEqual(comm.body.id)
    })
    it('- GET get comments for specified post with incorrect id', async () => {
        await request(app).get('/posts/helloWorld/comments').expect(HttpStatusCode.NOT_FOUND_404)
    })
    it('+ GET get comments for specified post with correct id', async () => {
        const posts = (await request(app).get('/posts').expect(HttpStatusCode.OK_200)).body.items
        const res = await request(app).get('/posts/' + posts[0].id + '/comments').expect(HttpStatusCode.OK_200)
        expect(res.body.items.length).toEqual(1)
    })
})