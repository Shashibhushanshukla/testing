import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserContactDocument = UserContact & Document;

@Schema()
export class UserContact {
  length(length: any) {
    throw new Error('Method not implemented.');
  }
  @Prop()
  name: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop()
  userEmail: string;

  @Prop()
  status: string;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;
}

export const UserContactSchema = SchemaFactory.createForClass(UserContact);
