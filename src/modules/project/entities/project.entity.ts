import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Project {
  @Field(() => String, { description: 'Project id' })
  userId: string;

  @Field(() => String, { description: 'Project id' })
  projectId: string;

  @Field(() => String, { description: 'Project code' })
  projectName: string;

  @Field(() => String, { description: 'Project code' })
  projectCode: string;
}
