/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User, UserDocument } from './model/user.model';
import { CreateUserInput } from './dto/input/create-user.input';
import { GetUserArgs } from './dto/args/user.args';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { compare } from 'bcrypt';
import { MongoErrors } from 'src/types';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
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

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const jwt = this.jwtService.sign({ email: user.email, _id: user._id });
    return {
      user,
      token: jwt,
    };
  }

  private async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);
    const passwordMatch = await this.comparePassword(password, user.password);

    if (!passwordMatch) throw new UnauthorizedException('Password incorrecto');

    user.password = undefined;
    return user;
  }

  public getUserById({ userId }: GetUserArgs): Promise<User> {
    return this.userModel.findById({ _id: userId }).exec();
  }

  public getUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  public async findByEmail(email: string): Promise<User> {
    const usuario = await this.userModel.findOne({ email });
    if (!usuario) throw new NotFoundException(`${email} no encontrado`);
    return usuario;
  }

  public deleteUser(
    userRequest: User,
    { _id }: DeleteUserInput,
  ): Promise<User> {
    if (userRequest._id.toString() !== _id.toString())
      throw new UnauthorizedException(`No eres propietario de la cuenta`);
    return this.userModel.findByIdAndRemove({ _id: _id }).exec();
  }

  private async comparePassword(password: string, encryptedPassword: string) {
    return await compare(password, encryptedPassword);
  }
}
