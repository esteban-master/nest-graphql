import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { IsValidId } from "src/common/pipes/isValidId.pipe";
import { CurrentUser } from "src/user/decorators/user.decorator";
import { JwtAuthGuard } from "src/user/guards/jwt-auth.guard";
import { User } from "src/user/model/user.model";
import { Follow } from "./dto/follow-type";
import { UnFollow } from "./dto/unFollow-type";
import { Follower } from "./dto/followers-type";
import { Following } from "./dto/following-type";
import { FollowService } from "./follow.service";
import { FollowingPaginate } from "./dto/followingPaginate-type";
import { FollowersPaginate } from "./dto/followerPaginate-type";

@Resolver()
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}

  @Mutation(() => Follow)
  @UseGuards(JwtAuthGuard)
  async follow(
    @Args("_id", { type: () => String }, IsValidId) _id: string,
    @CurrentUser() userRequest: User
  ) {
    return await this.followService.follow(_id, userRequest);
  }

  @Mutation(() => UnFollow)
  @UseGuards(JwtAuthGuard)
  async unFollow(
    @Args("_id", { type: () => String }, IsValidId) _id: string,
    @CurrentUser() userRequest: User
  ) {
    return await this.followService.unFollow(_id, userRequest);
  }

  @Query(() => FollowersPaginate)
  async followers(
    @Args("idUser", { type: () => String }, IsValidId) idUser: string,
    @Args("idUserReq", { type: () => String }, IsValidId) idUserReq: string,
    @Args("cursor", { type: () => String, nullable: true }) cursor?: string
  ) {
    const followers = await Promise.all(
      await this.followService.getFollowers(idUser, idUserReq, cursor)
    );
    return {
      data: followers,
      nextCursor: followers[9] ? followers[9]._id : null,
    };
  }

  @Query(() => FollowingPaginate)
  async following(
    @Args("idUser", { type: () => String }, IsValidId) idUser: string,
    @Args("idUserReq", { type: () => String }, IsValidId) idUserReq: string,
    @Args("cursor", { type: () => String, nullable: true }) cursor?: string
  ) {
    const following = await Promise.all(
      await this.followService.getFollowing(idUser, idUserReq, cursor)
    );
    return {
      data: following,
      nextCursor: following[9] ? following[9]._id : null,
    };
  }
}
