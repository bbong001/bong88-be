import { Role } from '@/shared/constants/role.constant';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true, index: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ default: null })
  phoneNumber?: string;

  @Prop({ default: null })
  address?: string;

  @Prop({ default: Role.USER })
  role: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: null })
  avatar?: string;

  @Prop({ default: null })
  lastLogin: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Thêm phương thức để loại bỏ mật khẩu khi trả về
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password; // Loại bỏ password
  return obj;
};
