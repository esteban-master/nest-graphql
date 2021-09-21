import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreatePostInput } from "./dto/create-post.input";
import { PostService } from "./post.service";
import { Post } from "./model/post.model";

@Resolver()
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => Post)
  async createPost(@Args("createPostData") createPostData: CreatePostInput) {
    return await this.postService.create(createPostData);
  }

  @Query(() => [Post])
  async postsByUsername(@Args("username") username: string) {
    return await this.postService.postsByUsername(username);
  }
}
