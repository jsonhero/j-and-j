import { Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class NewTagInput {
  @Field()
  @MaxLength(30)
  name: string;
}
