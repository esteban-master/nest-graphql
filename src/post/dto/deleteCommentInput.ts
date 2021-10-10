import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class DeleteCommentInput {
  @Field()
  @IsNotEmpty()
  idPost: string;
  @Field()
  @IsNotEmpty()
  idPostedBy: string;

  @Field()
  @IsNotEmpty()
  idComment: string;
}
