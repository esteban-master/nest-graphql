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
    idUserReq: string
  ): Promise<{
    _id: string;
    follow: string;
    createdAt: Date;
    isFollow: boolean;
  }>;
  public async isFollow(
    idFollow: string,
    userIdRequest: string
  ): Promise<boolean>;
  public async isFollow(arg1: unknown, arg2: unknown) {
    if (typeof arg1 === "object") {
      const followModel = arg1 as Follow;
      const isFollow = followModel.userId.toString() === arg2;
      return {
        _id: followModel._id,
        follow: followModel.follow,
        createdAt: followModel.createdAt,
        isFollow,
      };
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

  public async getFollowers(idUser: string) {
    return await this.followModel.find({ follow: idUser }).populate("userId");
  }

  public async getFollowing(idUser: string, idUserReq: string, cursor: string) {
    if (!cursor) {
      const users = await this.followModel
        .find({ userId: idUser })
        .limit(10)
        .populate("follow");

      // console.log(users.map((f) => this.isFollow(f, idUserReq)));
      // return users.map((f) => {
      //   const isFollow = f.userId.toString() === idUserReq;
      //   return {
      //     _id: f._id,
      //     follow: f.follow,
      //     createdAt: f.createdAt,
      //     isFollow,
      //   };
      // });
      return users.map(async (f) => await this.isFollow(f, idUserReq));
    }

    const users = await this.followModel
      .find({ userId: idUser, _id: { $gt: cursor } })
      .limit(10)
      .populate("follow");

    return users.map((f) => {
      const isFollow = f.userId.toString() === idUserReq;
      return {
        _id: f._id,
        follow: f.follow,
        createdAt: f.createdAt,
        isFollow,
      };
    });
  }
}
