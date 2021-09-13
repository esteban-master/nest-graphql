/* eslint-disable prettier/prettier */
import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty()
  @IsEmail({}, { message: 'El email debe ser valido' })
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(5, { message: 'El nombre debe ser mayor a 5 caracteres' })
  name: string;

  @Field()
  @IsNotEmpty()
  @MinLength(5, { message: 'El password debe ser mayor a 5 caracteres' })
  password: string;

  @Field()
  @IsNotEmpty()
  @MinLength(5, { message: 'El username debe tener al menos 5 caracteres' })
  @Matches(/^[a-zA-Z0-9-]*$/)
  username: string;
}
