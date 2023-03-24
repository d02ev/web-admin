import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true, collection: 'transactions' })
export class Transaction {
  @Prop({ required: true })
  log: string;

  @Prop({ required: true })
  user: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
