import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: Number })
  @Exclude()
  _id: number;
  @Exclude()
  __v: number;

  @Expose()
  get id(): string {
    return String(this._id);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
