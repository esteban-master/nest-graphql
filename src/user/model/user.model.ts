/* eslint-disable prettier/prettier */
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@ObjectType()
export class User {
  @Field()
  @IsNotEmpty()
  id: string;

  @Field()
  @IsNotEmpty()
  username: string;

  @Field()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  avatar?: string;

  @Field({ nullable: true })
  @IsOptional()
  siteWeb?: string;

  @Field()
  desc: string;

  @Field()
  @IsNotEmpty()
  password: string;

  @Field()
  createdAt: string;
}
