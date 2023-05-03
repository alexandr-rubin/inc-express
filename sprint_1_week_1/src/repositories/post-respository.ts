import { Post } from '../models/Post'

let posts: Post[] = [
    {
        "id": "qwerty",
        "title": "zxc",
        "shortDescription": "rdsfsdfdsf",
        "content": "string",
        "blogId": "string",
        "blogName": "string"
      }
]

export const postRepository = {
    getPosts(){
        return posts
    }
}