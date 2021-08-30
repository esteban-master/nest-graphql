/* eslint-disable prettier/prettier */
import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
@ObjectType()
export class User extends Document {
  @Field()
  @IsNotEmpty()
  _id: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  @Field()
  @IsNotEmpty()
  username: string;

  @Prop({ required: true })
  @Field()
  @IsNotEmpty()
  name: string;

  @Prop({ unique: true, required: true })
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Prop()
  @Field({ nullable: true })
  @IsOptional()
  avatar?: string;

  @Prop()
  @Field({ nullable: true })
  @IsOptional()
  siteWeb?: string;

  @Prop()
  @Field({ nullable: true })
  @IsOptional()
  desc?: string;

  @Prop()
  @Field()
  @IsNotEmpty()
  password: string;

  @Prop({ default: Date.now })
  @Field()
  createdAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
