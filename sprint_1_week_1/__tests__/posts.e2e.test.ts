import request from 'supertest'
import { app } from '../src/setting'

describe('/postst', () => {
    enum CodeResponsesEnum {
        Incorrect_values_400 = 400,
        Not_found_404 = 404,
        Not_content_204 = 204,
        Unauthorized = 401
    }

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

    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(204)
        await request(app).post('/blogs').set('Authorization', 'Basic YWRtaW46cXdlcnR5').send(newBlog).expect(201)
    })
    it('+GET products = []', async () => {
        await request(app).get('/blogs').expect(200)
        await request(app).get('/videos').expect([])
        await request(app).get('/posts').expect([])
    })
    it('-POST new post unauthorized', async () => {
        await request(app).post('/posts').send(post).expect(CodeResponsesEnum.Unauthorized)
    })
    it('-POST new post with bad value', async () => {
        await request(app).post('/posts').set('Authorization', 'Basic YWRtaW46cXdlcnR5').send(badValuesPost).expect(CodeResponsesEnum.Incorrect_values_400, {
            errorsMessages: [
                { message: 'Invalid value', field: 'title' },
                { message: 'Invalid value', field: 'shortDescription' },
                { message: 'Invalid value', field: 'content' },
                { message: 'Invalid value', field: 'blogId' }
            ]
        })
    })
    it('+POST new post', async () => {
        const blogs = (await request(app).get('/blogs')).body
        await request(app).post('/posts').set('Authorization', 'Basic YWRtaW46cXdlcnR5').send({...post, blogId: blogs[0].id}).expect(201)
        const res = await request(app).get('/posts/')
        expect(res.body.length).toEqual(1)
    })
    it('- GET product by ID with incorrect id', async () => {
        await request(app).get('/posts/helloWorld').expect(CodeResponsesEnum.Not_found_404)
    })
    it('+ GET product by ID with correct id', async () => {
        const posts = (await request(app).get('/posts')).body
        await request(app)
            .get('/posts/' + posts[0].id)
            .expect(200,posts[0])
    })
    it('- PUT product by ID unauthorized', async () => {
        const posts = (await request(app).get('/posts')).body
        await request(app)
            .put('/posts/' + 1223)
            .send(newPost)
            .expect(CodeResponsesEnum.Unauthorized)
        
            const res = await request(app).get('/posts/')
            expect(res.body[0]).toEqual(posts[0])
    })
    it('- PUT product by ID with incorrect id', async () => {
        const blogs = (await request(app).get('/blogs')).body
        const posts = (await request(app).get('/posts')).body
        await request(app)
            .put('/posts/' + 1223)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({...newPost, blogId: blogs[0].id})
            .expect(CodeResponsesEnum.Not_found_404)
        
            const res = await request(app).get('/posts/')
            expect(res.body[0]).toEqual(posts[0])
    })
    it('- PUT product by ID with incorrect data', async () => {
        const posts = (await request(app).get('/posts')).body
        await request(app)
            .put('/posts/' + 1223)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(badValuesPost)
            .expect(CodeResponsesEnum.Incorrect_values_400)
        
            const res = await request(app).get('/posts/')
            expect(res.body[0]).toEqual(posts[0])
    })
    it('+ PUT product by ID with correct data', async () => {
        const blogs = (await request(app).get('/blogs')).body
        const posts = (await request(app).get('/posts')).body
        await request(app)
            .put('/posts/' + posts[0].id)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({...newPost, blogId: blogs[0].id})
            .expect(CodeResponsesEnum.Not_content_204)
        
            const res = await request(app).get('/posts/')
            expect(res.body[0]).toEqual({id: posts[0].id, ...newPost, blogId: blogs[0].id, blogName: blogs[0].name, createdAt: posts[0].createdAt})
    })
    it('- DELETE product unauthorized', async () => {
        await request(app)
            .delete('/posts/876328')
            .expect(CodeResponsesEnum.Unauthorized)
        
            const res = await request(app).get('/posts/')
            expect(res.body).toHaveLength(1)
    })
    it('- DELETE product by ID with incorrect id', async () => {
        await request(app)
            .delete('/posts/876328')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(CodeResponsesEnum.Not_found_404)
        
            const res = await request(app).get('/posts/')
            expect(res.body).toHaveLength(1)
    })
    it('+ DELETE product by ID with correct id', async () => {
        const posts = (await request(app).get('/posts')).body
        await request(app)
            .delete('/posts/' + posts[0].id)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(CodeResponsesEnum.Not_content_204)
        
            const res = await request(app).get('/posts/')
            expect(res.body).toHaveLength(0)
    })
})