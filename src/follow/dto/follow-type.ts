import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/user/model/user.model";

@ObjectType()
export class Follow {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => User, { nullable: true })
  follow?: User;
}
