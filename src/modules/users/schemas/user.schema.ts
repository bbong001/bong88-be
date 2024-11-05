import { ACCOUNT_STATUS } from '@/shared/constants/account-status.contant';
import { ROLES } from '@/shared/constants/role.constant';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true, index: true })
  username: string;

  @Prop({ required: true })
  password: string;
  
  @Prop({ default: null })
  ip: string;
  @Prop({ default: null })
  userCode: string;

  @Prop({ required: true, index: true })
  fullName: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ default: null })
  mobile?: string;

  @Prop({ default: ROLES.PLAYER, index: true })
  role: number;

  @Prop({ default: null })
  avt?: string;



  @Prop({ default: null })
  lastLoginAt: Date;

  @Prop({ default: ACCOUNT_STATUS.AVAILABLE })
  accountStatus?: number;

  @Prop({ required: false, index: true, type: Types.ObjectId, ref: 'User', default: null })
  parentId?: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Thêm phương thức để loại bỏ mật khẩu khi trả về
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password; // Loại bỏ password
  return obj;
};
