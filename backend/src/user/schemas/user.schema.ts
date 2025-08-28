import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class Repo extends Document {
  @Prop()
  owner: string;

  @Prop()
  name: string;

  @Prop()
  url?: string;

  @Prop()
  starsCount?: number;

  @Prop()
  forksCount?: number;

  @Prop()
  issuesCount?: number;

  @Prop()
  createdAt?: Date;
}

@Schema()
export class User {
  @Prop()
  id: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ type: [Repo], default: [] })
  repos: Repo[];
}

export const UserSchema = SchemaFactory.createForClass(User);
