import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateProjectInput {
  @Field(() => String, { description: 'Project code' })
  userId: string;

  @Field(() => String, { description: 'Project code' })
  projectName: string;

  @Field(() => String, { description: 'Project code' })
  projectCode: string;
}
