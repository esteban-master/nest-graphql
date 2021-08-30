import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetUserArgs } from './dto/args/user.args';
import { CreateUserInput } from './dto/input/create-user.input';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { User } from './model/user.model';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, { name: 'user' })
  async getUser(@Args() getUserArgs: GetUserArgs) {
    const user = await this.userService.getUser(getUserArgs);
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
  deleteUser(@Args('deleteUserData') deleteUserData: DeleteUserInput) {
    return this.userService.deleteUser(deleteUserData);
  }
}
