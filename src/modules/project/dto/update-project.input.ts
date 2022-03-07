import { CreateProjectInput } from './create-project.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProjectInput extends PartialType(CreateProjectInput) {
  @Field(() => String)
  id: string;
}
