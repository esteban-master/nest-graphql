import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreatePostInput } from "./dto/create-post.input";
import { PostService } from "./post.service";
import { Post } from "./model/post.model";
import { Feed } from "./dto/feedPaginate";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/user/guards/jwt-auth.guard";
import { CurrentUser } from "src/user/decorators/user.decorator";
import { User } from "src/user/model/user.model";
import { FeedInput } from "./dto/feedInput";
import { CreateCommentInput } from "./dto/createCommentInput";
import { DeleteCommentInput } from "./dto/deleteCommentInput";

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

  @Query(() => Feed)
  @UseGuards(JwtAuthGuard)
  async feed(
    @Args("feedInput") { cursor }: FeedInput,
    @CurrentUser() userRequest: User
  ) {
    const posts = await this.postService.feedTimeline(userRequest._id, cursor);
    return {
      data: posts,
      nextCursor: posts[9] ? posts[9]._id : null,
    };
  }

  @Mutation(() => Post)
  @UseGuards(JwtAuthGuard)
  async commentPost(
    @Args("createCommentData") createCommentData: CreateCommentInput,
    @CurrentUser() userRequest: User
  ) {
    return await this.postService.commentPost(createCommentData, userRequest);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteCommentPost(
    @Args("deleteCommentData") deleteCommentData: DeleteCommentInput,
    @CurrentUser() userRequest: User
  ) {
    return await this.postService.deleteCommentPost(
      deleteCommentData,
      userRequest
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async likePost(
    @Args("idPost") idPost: string,
    @CurrentUser() userRequest: User
  ) {
    return await this.postService.likePost(idPost, userRequest);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async dislikePost(
    @Args("idPost") idPost: string,
    @CurrentUser() userRequest: User
  ) {
    return await this.postService.dislikePost(idPost, userRequest);
  }
}
