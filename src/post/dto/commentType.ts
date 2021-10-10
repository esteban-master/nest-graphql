import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/user/model/user.model";

@ObjectType()
export class Comment {
  @Field()
  _id?: string;

  @Field(() => User)
  postedBy: string;

  @Field()
  text: string;

  @Field()
  createdAt: Date;
}
