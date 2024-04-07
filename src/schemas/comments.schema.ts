import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop({ required: true, type: String })
  body: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Article' })
  article: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string;

  @Prop({ default: Date.now })
  date: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
