import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNotEmpty } from "class-validator";
import { Document, Schema as SchemaMongo } from "mongoose";
import { User } from "src/user/model/user.model";

export type FollowDocument = Follow & Document;

@Schema()
@ObjectType()
export class Follow extends Document {
  @Field()
  @IsNotEmpty()
  _id: string;

  @Prop({ type: SchemaMongo.Types.ObjectId, ref: "User" })
  @Field(() => User)
  @IsNotEmpty()
  userId: User | string;

  @Prop({ type: SchemaMongo.Types.ObjectId, ref: "User" })
  @Field(() => User)
  @IsNotEmpty()
  follow: User | string;

  @Prop({ type: Date, default: Date.now })
  @Field()
  createdAt: Date;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);
