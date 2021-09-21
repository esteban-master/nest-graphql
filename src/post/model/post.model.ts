import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNotEmpty, IsArray } from "class-validator";
import { Document, Schema as SchemaMongo } from "mongoose";
import { User } from "src/user/model/user.model";

export type PostDocument = Post & Document;

@Schema()
@ObjectType()
export class Post extends Document {
  @Field()
  @IsNotEmpty()
  _id: string;

  @Prop()
  @Field({ nullable: true })
  @IsNotEmpty()
  text?: string;

  @Prop({ required: true })
  @Field()
  @IsNotEmpty()
  photo: string;

  @Prop({
    type: [{ type: SchemaMongo.Types.ObjectId, ref: "User" }],
    default: [],
  })
  @Field(() => [User])
  @IsNotEmpty()
  @IsArray()
  likes: User[];

  @Prop({ type: SchemaMongo.Types.ObjectId, ref: "User", required: true })
  @Field(() => User)
  @IsNotEmpty()
  postedBy: string;

  @Prop({ type: Date, default: Date.now })
  @Field()
  @IsNotEmpty()
  createdAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
