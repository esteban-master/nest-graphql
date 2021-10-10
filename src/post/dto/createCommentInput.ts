import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CreateCommentInput {
  @Field()
  @IsNotEmpty()
  idPost: string;

  @Field()
  @IsNotEmpty()
  text: string;
}
