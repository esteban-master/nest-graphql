import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types } from 'mongoose';
import { User } from 'src/user/model/user.model';
import { UserService } from 'src/user/user.service';

import { Follow, FollowDocument } from './model/follow.model';
@Injectable()
export class FollowService {
  constructor(
    @InjectModel(Follow.name)
    private readonly followModel: Model<FollowDocument>,
    private readonly userService: UserService,
    @InjectConnection() private connection: Connection,
  ) {}

  public async follow(_idFollow: string, userRequest: User) {
    const session = await this.connection.startSession();
    try {
      const transactionResults = await session.withTransaction(
        async () => {
          try {
            const isFollow = await this.isFollow(_idFollow, userRequest._id);
            if (!!isFollow) {
              await session.abortTransaction();
              console.log('Sesion abortada por que ya sigue al usuario');
              return;
            }

            const userRequestUpdate = await this.userService.updateUser(
              { username: userRequest.username },
              { $inc: { following: 1 } },
              { session },
            );
            console.log(
              `User Request: ${userRequestUpdate.modifiedCount} document(s) was/were updated to follow.`,
            );

            const userFollowUpdate = await this.userService.updateUser(
              { _id: _idFollow },
              { $inc: { followers: 1 } },
              { session },
            );

            console.log(
              `User Follow: ${userFollowUpdate.modifiedCount} document(s) was/were updated to follow.`,
            );
            const newFollow = new this.followModel({
              userId: userRequest._id,
              follow: _idFollow,
            });
            return await newFollow.save({ session });
          } catch (error) {
            await session.abortTransaction();
          }
        },
        {
          readPreference: 'primary',
          readConcern: { level: 'local' },
          writeConcern: { w: 'majority' },
        } as any,
      );

      if (transactionResults) {
        console.log('The FOLLOW was successfully created.');
        return true;
      } else {
        console.log('The transaction was intentionally ABORTED.');
        return false;
      }
    } catch (error) {
      console.log('Sesion abortada por un error');
    } finally {
      console.log('Session finalizada');
      await session.endSession();
    }
  }

  public async isFollow(idFollow: string, userIdRequest: string) {
    const found = await this.followModel.findOne({
      userId: userIdRequest,
      follow: idFollow,
    });
    return found;
  }
}
