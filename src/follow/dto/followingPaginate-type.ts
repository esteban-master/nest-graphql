import { Field, ObjectType } from "@nestjs/graphql";
import { Following } from "./following-type";

@ObjectType()
export class FollowingPaginate {
  @Field(() => [Following])
  data: string;

  @Field({ nullable: true })
  nextCursor?: string;
}
