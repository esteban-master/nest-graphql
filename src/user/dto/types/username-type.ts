import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/user/model/user.model";

@ObjectType()
export class Username {
  @Field(() => User)
  user: User;

  @Field({ nullable: true })
  isFollow: boolean;
}
