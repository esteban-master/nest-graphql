import { Field, ObjectType } from "@nestjs/graphql";
import { Post } from "../model/post.model";

@ObjectType()
export class Feed {
  @Field(() => [Post])
  data: [Post];

  @Field({ nullable: true })
  nextCursor?: string;
}
