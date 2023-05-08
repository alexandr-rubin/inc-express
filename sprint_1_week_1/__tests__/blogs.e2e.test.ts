import request from 'supertest'
import { app } from '../src/setting'

describe('/blogs', () => {
    enum CodeResponsesEnum {
        Incorrect_values_400 = 400,
        Not_found_404 = 404,
        Not_content_204 = 204,
        Unauthorized = 401
    }

const blog = {
    "name": "111",
    "description": "111",
    "websiteUrl": "https://translate.google.com/"
}
const newBlog = {
    "name": "321",
    "description": "321",
    "websiteUrl": "https://translatezxc.google.com/"
}
const badValuesBlog = {
    "name": "   ",
    "description": "",
    "websiteUrl": "111"
}

    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(204)
    })
    it('+GET products = []', async () => {
        await request(app).get('/blogs').expect([])
        await request(app).get('/videos').expect([])
        await request(app).get('/posts').expect([])
    })
    it('-POST new blog unauthorized', async () => {
        await request(app).post('/blogs').send(blog).expect(CodeResponsesEnum.Unauthorized)
    })
    it('-POST new blog with bad value', async () => {
        await request(app).post('/blogs').set('Authorization', 'Basic YWRtaW46cXdlcnR5').send(badValuesBlog).expect(CodeResponsesEnum.Incorrect_values_400, {
            errorsMessages: [
                { message: 'Invalid value', field: 'name' },
                { message: 'Invalid value', field: 'description' },
                { message: 'Invalid value', field: 'websiteUrl' }
            ]
        })
    })
    it('+POST new blog', async () => {
        await request(app).post('/blogs').set('Authorization', 'Basic YWRtaW46cXdlcnR5').send(blog).expect(201)
        const res = await request(app).get('/blogs/')
        expect(res.body.length).toEqual(1)
    })
    it('- GET product by ID with incorrect id', async () => {
        await request(app).get('/blogs/helloWorld').expect(CodeResponsesEnum.Not_found_404)
    })
    it('+ GET product by ID with correct id', async () => {
        const blogs = (await request(app).get('/blogs')).body
        await request(app)
            .get('/blogs/' + blogs[0].id)
            .expect(200,blogs[0])
    })
    it('- PUT product by ID unauthorized', async () => {
        const blogs = (await request(app).get('/blogs')).body
        await request(app)
            .put('/blogs/' + 1223)
            .send(newBlog)
            .expect(CodeResponsesEnum.Unauthorized)
        
            const res = await request(app).get('/blogs/')
            expect(res.body[0]).toEqual(blogs[0])
    })
    it('- PUT product by ID with incorrect id', async () => {
        const blogs = (await request(app).get('/blogs')).body
        await request(app)
            .put('/blogs/' + 1223)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(newBlog)
            .expect(CodeResponsesEnum.Not_found_404)
        
            const res = await request(app).get('/blogs/')
            expect(res.body[0]).toEqual(blogs[0])
    })
    it('- PUT product by ID with incorrect data', async () => {
        const blogs = (await request(app).get('/blogs')).body
        await request(app)
            .put('/blogs/' + 1223)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(badValuesBlog)
            .expect(CodeResponsesEnum.Incorrect_values_400)
        
            const res = await request(app).get('/blogs/')
            expect(res.body[0]).toEqual(blogs[0])
    })
    it('+ PUT product by ID with correct data', async () => {
        const blogs = (await request(app).get('/blogs')).body
        await request(app)
            .put('/blogs/' + blogs[0].id)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(newBlog)
            .expect(CodeResponsesEnum.Not_content_204)
        
            const res = await request(app).get('/blogs/')
            expect(res.body[0]).toEqual({id: blogs[0].id, ...newBlog})
    })
    it('- DELETE product unauthorized', async () => {
        await request(app)
            .delete('/blogs/876328')
            .expect(CodeResponsesEnum.Unauthorized)
        
            const res = await request(app).get('/blogs/')
            expect(res.body).toHaveLength(1)
    })
    it('- DELETE product by ID with incorrect id', async () => {
        await request(app)
            .delete('/blogs/876328')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(CodeResponsesEnum.Not_found_404)
        
            const res = await request(app).get('/blogs/')
            expect(res.body).toHaveLength(1)
    })
    it('+ DELETE product by ID with correct id', async () => {
        const blogs = (await request(app).get('/blogs')).body
        await request(app)
            .delete('/blogs/' + blogs[0].id)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(CodeResponsesEnum.Not_content_204)
        
            const res = await request(app).get('/blogs/')
            expect(res.body).toHaveLength(0)
    })
})