import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/user/model/user.model";

@ObjectType()
export class Following {
  @Field()
  _id: string;

  @Field(() => User)
  follow: User;

  @Field()
  createdAt: Date;

  @Field()
  isFollow: boolean;
}
