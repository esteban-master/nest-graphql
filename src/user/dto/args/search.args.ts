/* eslint-disable prettier/prettier */
import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class SearchArg {
  @Field()
  @IsNotEmpty()
  search: string;
}
