import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { Document, SchemaTypes, Types } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ type: SchemaTypes.ObjectId })
  @Exclude()
  _id: Types.ObjectId;
  @Exclude()
  __v: number;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ required: true, type: String })
  type: string;

  @Prop({ required: true, type: Number, ref: 'users' })
  user: number;

  @Prop({ required: false, type: Number, ref: 'users' })
  userTo?: number;

  @Prop({ required: false, type: Number, ref: 'users' })
  userFrom?: number;

  @Prop({ required: false, type: String })
  product?: string;

  @Prop({ required: false, type: String })
  bill?: string;

  @Expose()
  get id(): string {
    return String(this._id);
  }
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
