import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserDocument } from './model/user.model';
import { CreateUserInput } from './dto/input/create-user.input';
import { GetUserArgs } from './dto/args/user.args';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoErrors } from 'src/types';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  public async createUser(createUserData: CreateUserInput): Promise<User> {
    createUserData.username.toLowerCase();
    try {
      const newUser = new this.userModel(createUserData);
      return await newUser.save();
    } catch (error: any) {
      if (error.code === MongoErrors.DUPLICATE_KEY) {
        const errorField = Object.keys(error.keyValue)[0];
        throw new BadRequestException(
          `${errorField}: '${error.keyValue[errorField]}' ya existe`,
        );
      }
    }
  }

  public getUser({ userId }: GetUserArgs): Promise<User> {
    return this.userModel.findById({ _id: userId }).exec();
  }
  public getUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  public deleteUser({ id }: DeleteUserInput): Promise<User> {
    return this.userModel.findByIdAndRemove({ _id: id }).exec();
  }
}
