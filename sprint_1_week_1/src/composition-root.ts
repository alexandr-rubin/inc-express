import "reflect-metadata";
import { EmailAdapter } from "./adapters/emailAdapter";
import { JWTService } from "./application/jwtService";
import { UserController } from "./controllers/userController";
import { AuthorizationService } from "./domain/authorizationService";
import { BlogService } from "./domain/blogsService";
import { CommentService } from "./domain/commentService";
import { EmailService } from "./domain/emailService";
import { PostService } from "./domain/postsService";
import { UserService } from "./domain/userService";
import { BlogQueryRepository } from "./queryRepositories/blogQueryRepository";
import { CommentQueryRepository } from "./queryRepositories/commentQueryRepository";
import { PostQueryRepository } from "./queryRepositories/postQueryRepository";
import { SecurityQueryRepository } from "./queryRepositories/securityQueryRepository";
import { UserQueryRepository } from "./queryRepositories/userQuertyRepository";
import { AuthorizationRepository } from "./repositories/authorizationRepository";
import { BlogRepository } from "./repositories/blogRespository";
import { CommentRepository } from "./repositories/commentRepository";
import { PostRepository } from "./repositories/postRespository";
import { SecurityRepository } from "./repositories/securityRepository";
import { UserRepository } from "./repositories/userRepository";
import { Container } from "inversify";

// export const userRepository = new UserRepository()
// export const userQueyRepository = new UserQueryRepository()
// const userService = new UserService(userRepository)
// export const userController = new UserController(userService, userQueyRepository)
// const emailAdapter = new EmailAdapter()
// const emailService = new EmailService(emailAdapter)
// export const authorizationRepository = new AuthorizationRepository(userService)
// export const authorizationService = new AuthorizationService(emailService, userService, authorizationRepository, userRepository, userQueyRepository)
// export const securityRepository = new SecurityRepository()
// export const jwtService = new JWTService(authorizationRepository, securityRepository)
// export const securityQueryRepository = new SecurityQueryRepository(jwtService)
// export const blogRepository = new BlogRepository()
// export const postRepository = new PostRepository()
// export const commentQueryRepository = new CommentQueryRepository()
// export const commentRepository = new CommentRepository(commentQueryRepository)
// export const commentService = new CommentService(commentRepository)
// export const blogQueryRepository = new BlogQueryRepository()
// export const postService = new PostService(blogQueryRepository, postRepository)
// export const blogService = new BlogService(blogRepository, blogQueryRepository, postService)
// export const postQueryRepository = new PostQueryRepository()

export const container = new Container()
container.bind(UserController).toSelf()
container.bind(UserService).toSelf()
container.bind(UserRepository).toSelf()
container.bind(UserQueryRepository).toSelf()
container.bind(EmailAdapter).toSelf()
container.bind(EmailService).toSelf()
container.bind(AuthorizationRepository).toSelf()
container.bind(AuthorizationService).toSelf()
container.bind(SecurityRepository).toSelf()
container.bind(SecurityQueryRepository).toSelf()
container.bind(JWTService).toSelf()
container.bind(BlogQueryRepository).toSelf()
container.bind(BlogRepository).toSelf()
container.bind(BlogService).toSelf()
container.bind(PostQueryRepository).toSelf()
container.bind(PostRepository).toSelf()
container.bind(PostService).toSelf()
container.bind(CommentQueryRepository).toSelf()
container.bind(CommentRepository).toSelf()
container.bind(CommentService).toSelf()