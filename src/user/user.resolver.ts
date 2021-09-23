import { NotFoundException, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CurrentUser } from "src/user/decorators/user.decorator";
import { JwtAuthGuard } from "src/user/guards/jwt-auth.guard";
import { SearchArg } from "./dto/args/search.args";
import { GetUserArgs } from "./dto/args/user.args";
import { GetUsernameArg } from "./dto/args/username.args";
import { CreateUserInput } from "./dto/input/create-user.input";
import { DeleteUserInput } from "./dto/input/delete-user.input";
import { LoginUserInput } from "./dto/input/login-user.input";
import { Login } from "./dto/types/login-type";
import { User } from "./model/user.model";
import { UserService } from "./user.service";

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, { name: "userById" })
  async getUserById(@Args() getUserArgs: GetUserArgs) {
    const user = await this.userService.getUserById(getUserArgs);
    if (!user) throw new NotFoundException("Usuario no encontrado");
    return user;
  }

  @Query(() => User, { name: "userByUsername" })
  async getUserByUsername(@Args() getUsernameArgs: GetUsernameArg) {
    return await this.userService.getUserByUsername(getUsernameArgs);
  }

  @Query(() => [User], {
    name: "searchUsers",
    nullable: "items",
    description: "Obtiene busqueda de los usuario por nombre",
  })
  searchUsers(@Args() searchArgs: SearchArg) {
    return this.userService.searchUsers(searchArgs);
  }

  @Mutation(() => User)
  createUser(@Args("createUserData") createUserData: CreateUserInput) {
    return this.userService.createUser(createUserData);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  deleteUser(
    @Args("deleteUserData") deleteUserData: DeleteUserInput,
    @CurrentUser() userRequest: User
  ) {
    return this.userService.deleteUser(userRequest, deleteUserData);
  }

  @Mutation(() => Login)
  async login(@Args("loginUserData") { email, password }: LoginUserInput) {
    return await this.userService.login(email, password);
  }
}
