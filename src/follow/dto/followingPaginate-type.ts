import { Field, ObjectType } from "@nestjs/graphql";
import { Following } from "./following-type";

@ObjectType()
export class FollowingPaginate {
  @Field(() => [Following])
  data: [Following];

  @Field({ nullable: true })
  nextCursor?: string;
}
