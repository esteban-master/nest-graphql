import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { CurrentUser } from "src/user/decorators/user.decorator";
import { JwtAuthGuard } from "src/user/guards/jwt-auth.guard";
import { User } from "src/user/model/user.model";
import { FollowService } from "./follow.service";

@Resolver()
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async follow(
    @Args("_id", { type: () => String }) _id: string,
    @CurrentUser() userRequest: User
  ) {
    return await this.followService.follow(_id, userRequest);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async unFollow(
    @Args("_id", { type: () => String }) _id: string,
    @CurrentUser() userRequest: User
  ) {
    return await this.followService.unFollow(_id, userRequest);
  }

  @Query(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async isfollow(
    @Args("_id", { type: () => String }) _id: string,
    @CurrentUser() userRequest: User
  ) {
    const isFollow = await this.followService.isFollow(_id, userRequest._id);
    return !!isFollow;
  }
}
