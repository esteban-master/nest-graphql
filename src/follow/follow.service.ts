import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from "@nestjs/common";
import { InjectModel, InjectConnection } from "@nestjs/mongoose";
import { Model, Connection } from "mongoose";
import { User } from "src/user/model/user.model";
import { UserService } from "src/user/user.service";
import { Follow, FollowDocument } from "./model/follow.model";

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(Follow.name)
    private readonly followModel: Model<FollowDocument>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @InjectConnection() private connection: Connection
  ) {}

  public async follow(_idFollow: string, userRequest: User) {
    if (_idFollow.toString() === userRequest._id.toString()) {
      throw new BadRequestException("Operacion no permitida");
    }

    let followReturn = {
      user: null,
      follow: null,
    };

    const session = await this.connection.startSession();
    try {
      const transactionResults = await session.withTransaction(
        async () => {
          try {
            const isFollow = await this.isFollow(_idFollow, userRequest._id);
            if (!!isFollow) {
              await session.abortTransaction();
              return;
            }

            const userReqUpdate = await this.userService.updateUser(
              { username: userRequest.username },
              { $inc: { following: 1 } },
              { session, new: true }
            );
            const userFollowUpdate = await this.userService.updateUser(
              { _id: _idFollow },
              { $inc: { followers: 1 } },
              { session, new: true }
            );

            const newFollow = new this.followModel({
              userId: userRequest._id,
              follow: _idFollow,
            });

            followReturn = {
              user: userReqUpdate,
              follow: userFollowUpdate,
            };
            return await newFollow.save({ session });
          } catch (error) {
            followReturn = {
              user: null,
              follow: null,
            };
            await session.abortTransaction();
          }
        },
        {
          readPreference: "primary",
          readConcern: { level: "local" },
          writeConcern: { w: "majority" },
        } as any
      );

      if (transactionResults) {
        console.log("The FOLLOW was successfully created.");
        return followReturn;
      } else {
        console.log("The transaction was intentionally ABORTED.");
        return followReturn;
      }
    } catch (error) {
      console.log("Sesion abortada por un error");
    } finally {
      console.log("Session finalizada");
      await session.endSession();
    }
  }

  public async isFollow(
    followModel: Follow,
    idUserReq: string,
    populate?: "userId" | "follow"
  );
  public async isFollow(
    idFollow: string,
    userIdRequest: string,
    populate?: "userId" | "follow"
  );
  public async isFollow(arg1: unknown, arg2: unknown, arg3?: unknown) {
    if (typeof arg1 === "object") {
      const followModel = arg1 as Follow;
      switch (arg3) {
        case "follow":
          if (typeof followModel.follow === "object") {
            const isFollow = await this.followModel.findOne({
              follow: followModel.follow._id.toString(),
              userId: arg2,
            });
            return {
              _id: followModel._id,
              follow: followModel.follow,
              createdAt: followModel.createdAt,
              isFollow: !!isFollow,
            };
          }
        case "userId":
          if (typeof followModel.userId === "object") {
            const isFollow = await this.followModel.findOne({
              follow: followModel.userId._id.toString(),
              userId: arg2,
            });
            return {
              _id: followModel._id,
              userId: followModel.userId,
              createdAt: followModel.createdAt,
              isFollow: !!isFollow,
            };
          }

        default:
          break;
      }
    } else {
      const found = await this.followModel.findOne({
        follow: arg1,
        userId: arg2,
      });
      return !!found;
    }
  }

  public async unFollow(_idFollow: string, userRequest: User) {
    const session = await this.connection.startSession();
    let unfollowReturn = {
      user: null,
      unFollow: null,
    };
    try {
      const transactionResults = await session.withTransaction(
        async () => {
          try {
            const followFound = await this.followModel.findOne({
              userId: userRequest.id,
              follow: _idFollow,
            });
            if (!followFound) {
              await session.abortTransaction();
              return;
            }

            const userReqUpdate = await this.userService.updateUser(
              { username: userRequest.username },
              { $inc: { following: -1 } },
              { session, new: true }
            );
            const userUnFollowUpdate = await this.userService.updateUser(
              { _id: _idFollow },
              { $inc: { followers: -1 } },
              { session, new: true }
            );

            unfollowReturn = {
              user: userReqUpdate,
              unFollow: userUnFollowUpdate,
            };
            return await followFound.remove({ session });
          } catch (error) {
            unfollowReturn = {
              user: null,
              unFollow: null,
            };
            await session.abortTransaction();
          }
        },
        {
          readPreference: "primary",
          readConcern: { level: "local" },
          writeConcern: { w: "majority" },
        } as any
      );

      if (transactionResults) {
        console.log("The UN_FOLLOW was successfully created.");
        return unfollowReturn;
      } else {
        console.log("The transaction was intentionally ABORTED.");
        return unfollowReturn;
      }
    } catch (error) {
      console.log("Sesion abortada por un error");
    } finally {
      console.log("Session finalizada");
      await session.endSession();
    }
  }

  public async getFollowers(idUser: string, idUserReq: string, cursor: string) {
    if (!cursor) {
      const users = await this.followModel
        .find({ follow: idUser })
        .limit(10)
        .populate("userId");
      return users.map(
        async (f) => await this.isFollow(f, idUserReq, "userId")
      );
    }

    const users = await this.followModel
      .find({ follow: idUser, _id: { $gt: cursor } })
      .limit(10)
      .populate("userId");

    return users.map(async (f) => await this.isFollow(f, idUserReq, "userId"));
  }

  public async getFollowing(idUser: string, idUserReq: string, cursor: string) {
    if (!cursor) {
      const users = await this.followModel
        .find({ userId: idUser })
        .limit(10)
        .populate("follow");
      return users.map(
        async (f) => await this.isFollow(f, idUserReq, "follow")
      );
    }

    const users = await this.followModel
      .find({ userId: idUser, _id: { $gt: cursor } })
      .limit(10)
      .populate("follow");

    return users.map(async (f) => await this.isFollow(f, idUserReq, "follow"));
  }
}
