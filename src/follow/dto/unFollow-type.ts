import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/user/model/user.model";

@ObjectType()
export class UnFollow {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => User, { nullable: true })
  unFollow?: User;
}
