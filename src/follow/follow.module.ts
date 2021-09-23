import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Follow, FollowSchema } from "./model/follow.model";
import { FollowService } from "./follow.service";
import { FollowResolver } from "./follow.resolver";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Follow.name,
        schema: FollowSchema,
      },
    ]),
    UserModule,
  ],
  providers: [FollowResolver, FollowService],
})
export class FollowModule {}
