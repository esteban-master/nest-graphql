/* eslint-disable prettier/prettier */
import { NotFoundException, Post, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { GetUserArgs } from './dto/args/user.args';
import { CreateUserInput } from './dto/input/create-user.input';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { LoginUserInput } from './dto/input/login-user.input';
import { Login } from './dto/types/login-type';
import { User } from './model/user.model';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, { name: 'user' })
  async getUser(@Args() getUserArgs: GetUserArgs) {
    const user = await this.userService.getUserById(getUserArgs);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  @Query(() => [User], {
    name: 'users',
    nullable: 'items',
    description: 'Obtiene todos los usuarios',
  })
  getUsers() {
    return this.userService.getUsers();
  }

  @Mutation(() => User)
  createUser(@Args('createUserData') createUserData: CreateUserInput) {
    return this.userService.createUser(createUserData);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  deleteUser(
    @Args('deleteUserData') deleteUserData: DeleteUserInput,
    @CurrentUser() userRequest: User,
  ) {
    return this.userService.deleteUser(userRequest, deleteUserData);
  }

  @Mutation(() => Login)
  async login(@Args('loginUserData') { email, password }: LoginUserInput) {
    return await this.userService.login(email, password);
  }
}
