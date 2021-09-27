import { Field, ObjectType } from "@nestjs/graphql";
import { Follower } from "./followers-type";

@ObjectType()
export class FollowersPaginate {
  @Field(() => [Follower])
  data: [Follower];

  @Field({ nullable: true })
  nextCursor?: string;
}
