import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CreatePostInput {
  @Field({ nullable: true })
  text?: string;

  @Field()
  @IsNotEmpty()
  photo: string;

  @Field()
  @IsNotEmpty()
  postedBy: string;
}
