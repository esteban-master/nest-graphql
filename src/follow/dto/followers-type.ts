import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/user/model/user.model";

@ObjectType()
export class Follower {
  @Field()
  _id: string;

  @Field(() => User)
  userId: User;

  @Field()
  createdAt: Date;

  @Field()
  isFollow: boolean;
}
