import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { ROLES } from '@/shared/constants/role.constant';
import { ConfigService } from '@/config/config.service';
import { hashPassword } from '@/shared/utils/hash.util';

@Injectable()
export class AdminInitializerService implements OnApplicationBootstrap {
  private readonly logger = new Logger('DatabaseMongoDB');

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    // Kiểm tra xem có tài khoản ADMIN nào chưa
    const adminExists = await this.userModel.exists({ role: ROLES.ADMIN });

    if (!adminExists) {
      // Tạo mật khẩu mặc định hoặc lấy từ biến môi trường
      const defaultPassword = this.configService.getAdminDefaultPassword();

      // Mã hóa mật khẩu
      const hashedPassword = await hashPassword(defaultPassword, 10);

      // Tạo tài khoản ADMIN mới
      const adminUser = new this.userModel({
        username: 'admin',
        password: hashedPassword,
        fullName: 'Administrator',
        email: 'admin@example.com',
        role: ROLES.ADMIN,
        parentId: null, // ADMIN không có parent
      });

      await adminUser.save();
      this.logger.log('Default admin user created.');
    } else {
      this.logger.log('Admin user already exists.');
    }
  }
}
