import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Wallet extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  username: string;

  @Prop({ default: "Sai thông tin liên kết ví" })
  thongBao: string;

  @Prop({
    required: true,
    default: "error",
    enum: ["success", "warning", "error"],
  })
  type: string;

  @Prop({ default: 0 })
  money: number;

  @Prop({ default: 0 })
  totalFreeze: number;

  @Prop({ default: false })
  status: boolean;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
