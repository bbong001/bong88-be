import { WALLET_STATUS, WALLET_TYPE } from '@/shared/constants/wallet.constant';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Wallet extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId; // Liên kết với người dùng sở hữu ví

  @Prop({ required: true, index: true })
  username: string; // Tên người dùng để tiện truy vấn và hiển thị

  @Prop({ required: true, enum: Object.values(WALLET_TYPE), default: WALLET_TYPE.MAIN })
  wallet: string; // Loại ví, chẳng hạn ví chính, ví khuyến mãi

  @Prop({ required: true, default: 0 })
  balance: number; // Số dư ví

  @Prop({ type: Types.ObjectId, ref: 'Wallet', default: null, index: true })
  parentWalletId?: Types.ObjectId; // Liên kết với ví của cấp trên

  @Prop({ required: true, enum: Object.values(WALLET_STATUS), default: WALLET_STATUS.ACTIVE })
  status: string; // Trạng thái ví, chẳng hạn: hoạt động, bị khóa
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
