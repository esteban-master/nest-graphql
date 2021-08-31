/* eslint-disable prettier/prettier */
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/model/user.model';

@ObjectType()
export class Login {
  @Field((type) => User)
  user: User;

  @Field()
  token: string;
}
