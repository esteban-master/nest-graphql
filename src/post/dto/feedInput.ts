import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class FeedInput {
  @Field({ nullable: true })
  cursor?: string;
}
