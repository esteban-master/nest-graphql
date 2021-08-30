import { Injectable } from '@nestjs/common';
import { User } from './model/user.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserInput } from './dto/input/create-user.input';
import { GetUserArgs } from './dto/args/user.args';
import { DeleteUserInput } from './dto/input/delete-user.input';

@Injectable()
export class UserService {
  private users: User[] = [];

  public createUser(createUserData: CreateUserInput): User {
    const user: User = {
      id: uuidv4(),
      siteWeb: '',
      avatar: '',
      createdAt: Date.now().toString(),
      desc: '',
      ...createUserData,
    };

    this.users.push(user);
    return user;
  }
  // public updateUser(): User {}
  public getUser({ userId }: GetUserArgs): User {
    return this.users.find((user) => user.id === userId);
  }
  public getUsers(): User[] {
    return this.users;
  }
  public deleteUser({ id }: DeleteUserInput): User {
    const userIndex = this.users.findIndex((user) => user.id === id);
    const user = this.users[userIndex];
    this.users.splice(userIndex);
    return user;
  }
}
