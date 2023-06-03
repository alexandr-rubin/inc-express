import request from 'supertest'
import { app } from '../src/setting'
import { HttpStatusCode } from '../src/helpers/httpStatusCode'

const blog = {
    "name": "111",
    "description": "111",
    "websiteUrl": "https://translate.google.com/"
}
const newBlog = {
    "name": "321",
    "description": "321",
    "websiteUrl": "https://translatezxc.google.com/",
}
const badValuesBlog = {
    "name": "   ",
    "description": "",
    "websiteUrl": "111"
}

const userCorrectData = {
    loginOrEmail: 'qwertyas',
    password: 'zxcvbnmasd'
}

const post = {
    "title": "zxc",
    "shortDescription": "rdsfsdfdsf",
    "content": "string"
}

const badValuesPost = {
        "title": "",
        "shortDescription": "",
        "content": "",
        "blogId": ""
    }

describe('/blogs', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(HttpStatusCode.NO_CONTENT_204)
    })
    it('+GET products = []', async () => {
        await request(app).get('/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect({ pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
        await request(app).get('/comments').expect([])
        await request(app).get('/blogs').expect({ pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
        await request(app).get('/posts').expect({ pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })
    it('-POST new blog unauthorized', async () => {
        await request(app).post('/blogs').send(blog).expect(HttpStatusCode.UNAUTHORIZED_401)
    })
    it('-POST new blog with bad value', async () => {
        await request(app).post('/blogs').send(badValuesBlog).set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(HttpStatusCode.BAD_REQUEST_400, {
            errorsMessages: [
                { message: 'Invalid value', field: 'name' },
                { message: 'Invalid value', field: 'description' },
                { message: 'Invalid value', field: 'websiteUrl' }
            ]
        })
    })
    it('+POST new blog', async () => {
        await request(app).post('/blogs').send(blog).set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(HttpStatusCode.CREATED_201)
        const res = await request(app).get('/blogs/').expect(HttpStatusCode.OK_200)
        expect(res.body.items.length).toEqual(1)
    })
    it('- GET blog by ID with incorrect id', async () => {
        await request(app).get('/blogs/helloWorld').expect(HttpStatusCode.NOT_FOUND_404)
    })
    it('+ GET blog by ID with correct id', async () => {
        const blogs = (await request(app).get('/blogs').expect(HttpStatusCode.OK_200)).body.items
        await request(app)
            .get('/blogs/' + blogs[0].id)
            .expect(HttpStatusCode.OK_200, blogs[0])
    })
    it('- PUT blog by ID unauthorized', async () => {
        const blogs = (await request(app).get('/blogs').expect(HttpStatusCode.OK_200)).body.items
        await request(app)
            .put('/blogs/' + blogs[0].id)
            .send(newBlog)
            .expect(HttpStatusCode.UNAUTHORIZED_401)
        
            const res = await request(app).get('/blogs/').expect(HttpStatusCode.OK_200)
            expect(res.body.items[0]).toEqual(blogs[0])
    })
    it('- PUT blog by ID with incorrect id', async () => {
        const blogs = (await request(app).get('/blogs').expect(HttpStatusCode.OK_200)).body.items
        await request(app)
            .put('/blogs/' + 1223)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(newBlog)
            .expect(HttpStatusCode.NOT_FOUND_404)
        
            const res = await request(app).get('/blogs/').expect(HttpStatusCode.OK_200)
            expect(res.body.items[0]).toEqual(blogs[0])
    })
    it('- PUT blog by ID with incorrect data', async () => {
        const blogs = (await request(app).get('/blogs').expect(HttpStatusCode.OK_200)).body.items
        await request(app)
            .put('/blogs/' + blogs[0].id)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(badValuesBlog)
            .expect(HttpStatusCode.BAD_REQUEST_400)
        
            const res = await request(app).get('/blogs/').expect(HttpStatusCode.OK_200)
            expect(res.body.items[0]).toEqual(blogs[0])
    })
    it('+ PUT blog by ID with correct data', async () => {
        const blogs = (await request(app).get('/blogs').expect(HttpStatusCode.OK_200)).body.items
        await request(app)
            .put('/blogs/' + blogs[0].id)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(newBlog)
            .expect(HttpStatusCode.NO_CONTENT_204)
        
            const res = await request(app).get('/blogs/').expect(HttpStatusCode.OK_200)
            expect(res.body.items[0]).toEqual({id: blogs[0].id, createdAt: blogs[0].createdAt, isMembership: blogs[0].isMembership, ...newBlog})
    })
    it('- DELETE blog unauthorized', async () => {
        const blogs = (await request(app).get('/blogs').expect(HttpStatusCode.OK_200)).body.items
        await request(app)
            .delete('/blogs/' + blogs[0].id)
            .expect(HttpStatusCode.UNAUTHORIZED_401)
        
            const res = await request(app).get('/blogs/').expect(HttpStatusCode.OK_200)
            expect(res.body.items).toHaveLength(1)
    })
    it('- DELETE blog by ID with incorrect id', async () => {
        await request(app)
            .delete('/blogs/876328')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HttpStatusCode.NOT_FOUND_404)
        
            const res = await request(app).get('/blogs/').expect(HttpStatusCode.OK_200)
            expect(res.body.items).toHaveLength(1)
    })
    it('+ DELETE blog by ID with correct id', async () => {
        const blogs = (await request(app).get('/blogs').expect(HttpStatusCode.OK_200)).body.items
        await request(app)
            .delete('/blogs/' + blogs[0].id)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HttpStatusCode.NO_CONTENT_204)
        
            const res = await request(app).get('/blogs/').expect(HttpStatusCode.OK_200)
            expect(res.body.items).toHaveLength(0)
    })
    it('+POST new blog', async () => {
        await request(app).post('/blogs').send(blog).set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(HttpStatusCode.CREATED_201)
        const res = await request(app).get('/blogs/').expect(HttpStatusCode.OK_200)
        expect(res.body.items.length).toEqual(1)
    })
    it('-POST new post for speciffic blog unauthorized', async () => {
        const blogs = (await request(app).get('/blogs').expect(HttpStatusCode.OK_200)).body.items
        await request(app).post('/blogs/' + blogs[0].id  + '/posts').send(post).expect(HttpStatusCode.UNAUTHORIZED_401)
    })
    it('-POST new post for speciffic blog with icorrect id', async () => {
        await request(app).post('/blogs/123/posts').send(post).set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(HttpStatusCode.NOT_FOUND_404)
    })
    it('-POST new post for speciffic blog with bad value', async () => {
        await request(app).post('/blogs/123/posts').send(badValuesPost).set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(HttpStatusCode.BAD_REQUEST_400, {
            errorsMessages: [
                { message: 'Invalid value', field: 'title' },
                { message: 'Invalid value', field: 'shortDescription' },
                { message: 'Invalid value', field: 'content' }
            ]
        })
    })
    it('+POST new post for speciffic blog', async () => {
        const blogs = (await request(app).get('/blogs').expect(HttpStatusCode.OK_200)).body.items
        await request(app).post('/blogs/' + blogs[0].id  + '/posts').send(post).set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(HttpStatusCode.CREATED_201)
        const res = await request(app).get('/posts/').expect(HttpStatusCode.OK_200)
        expect(res.body.items.length).toEqual(1)
    })
    it('- GET get all posts for specified blog with incorrect id', async () => {
        await request(app).get('/blogs/helloWorld/posts').expect(HttpStatusCode.NOT_FOUND_404)
    })
    it('+ GET get all posts for specified blog with correct id', async () => {
        const blogs = (await request(app).get('/blogs').expect(HttpStatusCode.OK_200)).body.items
        const res = await request(app).get('/blogs/' + blogs[0].id + '/posts').expect(HttpStatusCode.OK_200)
        expect(res.body.items.length).toEqual(1)
    })
})