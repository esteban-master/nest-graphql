import { Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostResolver } from "./post.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { Post, PostSchema } from "./model/post.model";
import { UserModule } from "src/user/user.module";
import { FollowModule } from "src/follow/follow.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
    ]),
    UserModule,
    FollowModule,
  ],
  providers: [PostResolver, PostService],
})
export class PostModule {}
