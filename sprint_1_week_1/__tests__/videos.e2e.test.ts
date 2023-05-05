// import request from 'supertest'
// import { app } from '../src/setting'
// import { videos } from '../src/routes/video-router'

// describe('/videos', () => {
//     enum CodeResponsesEnum {
//         Incorrect_values_400 = 400,
//         Not_found_404 = 404,
//         Not_content_204 = 204
//     }

//     beforeAll(async () => {
//         await request(app).delete('/testing/all-data').expect(204)
//     })

//     it('GET products = []', async () => {
//         await request(app).get('/videos/').expect([])
//     })

//     it('- POST does not create the video with incorrect data (no title, no author)', async function () {
//         await request(app)
//             .post('/videos/')
//             .send({ title: '', author: '' })
//             .expect(CodeResponsesEnum.Incorrect_values_400, {
//                 errorsMessages: [
//                     { message: 'Incorrect title', field: 'title' },
//                     { message: 'Incorrect author', field: 'author' },
//                 ],
//             })

//         const res = await request(app).get('/videos/')
//         expect(res.body).toEqual([])
//     })

//     it('+ POST create the video', async function () {
//         await request(app)
//             .post('/videos/')
//             .send({ title: 'title', author: 'author' })
//             .expect(201)

//         const res = await request(app).get('/videos/')
//         expect(res.body.length).toEqual(1)
//     })
   
//     it('- GET product by ID with incorrect id', async () => {
//         await request(app).get('/videos/helloWorld').expect(CodeResponsesEnum.Not_found_404)
//     })
//     it('+ GET product by ID with correct id', async () => {
//         await request(app)
//             .get('/videos/' + videos[0].id)
//             .expect(200, videos[0])
//     })

//     it('- PUT product by ID with incorrect data', async () => {
//         await request(app)
//             .put('/videos/' + 1223)
//             .send({ title: 'title', author: 'title' })
//             .expect(CodeResponsesEnum.Not_found_404)

//         const res = await request(app).get('/videos/')
//         expect(res.body[0]).toEqual(videos[0])
//     })
  
//     it('+ PUT product by ID with correct data', async () => {
//         await request(app)
//             .put('/videos/' + videos[0].id)
//             .send({
//                 title: 'hello title',
//                 author: 'hello author',
//                 publicationDate: '2023-12-12T08:12:39.261Z',
//             })
//             .expect(CodeResponsesEnum.Not_content_204)

//         // const res = await request(app).get('/videos/')
//         // expect(res.body[0]).toEqual({
//         //     ...videos[0],
//         //     title: 'hello title',
//         //     author: 'hello author',
//         //     publicationDate: '2023-12-12T08:12:39.261Z',
//         // })
//         // videos[0] = res.body[0]
//     })

//     it('- DELETE product by incorrect ID', async () => {
//         await request(app)
//             .delete('/videos/876328')
//             .expect(CodeResponsesEnum.Not_found_404)

//         const res = await request(app).get('/videos/')
//         expect(res.body[0]).toEqual(videos[0])
//     })
//     it('+ DELETE product by correct ID, auth', async () => {
//         await request(app)
//             .delete('/videos/' + videos[0].id)
//             .set('authorization', 'Basic YWRtaW46cXdlcnR5')
//             .expect(CodeResponsesEnum.Not_content_204)

//         const res = await request(app).get('/videos/')
//         expect(res.body.length).toBe(0)
//     })
// })
