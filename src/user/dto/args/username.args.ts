import { ArgsType, Field } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@ArgsType()
export class GetUsernameArg {
  @Field()
  @IsNotEmpty()
  username: string;

  @Field({ nullable: true })
  userReq: string;
}
