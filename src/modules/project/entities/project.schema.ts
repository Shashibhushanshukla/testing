import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema()
export class Project {
  @Prop()
  userId: string;

  @Prop()
  projectName: string;

  @Prop()
  projectCode: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
