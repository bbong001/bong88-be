import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashMD5, hashPassword } from '@/shared/utils/hash.util';
import { GSService } from '@/common/services/gs/gs.service';
import { ConfigService } from '@/config/config.service';
import { GSErrorCodes } from '@/shared/constants/gs-error.constants';
import { ROLES } from '@/shared/constants/role.constant';
import { PaginationResult } from '@/common/interfaces/pagination-result.interface';

@Injectable()
export class UsersService {
  private readonly gsOperatorCode: string;
  private readonly gsSecretKey: string;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly gsService: GSService,
    private readonly configService: ConfigService,
  ) {
    this.gsOperatorCode = configService.getGSOperatorCode();
    this.gsSecretKey = configService.getGSSecretKey();
  }

  async createUser(user: any, createUserDto: CreateUserDto): Promise<User> {
    try {
      const { fullName, username, email, password, mobile, walletBalance, role } = createUserDto;

      if (role < user.role) {
        throw new ConflictException('Không thể tạo tài khoản có quyền lớn hơn tài khoản của bạn');
      }

      // Tạo người chơi trên GS
      if (role === ROLES.PLAYER || user.role === ROLES.AGENT) {
        const resGS = await this.gsService.createPlayer({
          operatorcode: this.gsOperatorCode,
          username: username.toLowerCase(),
          signature: hashMD5(`${this.gsOperatorCode}${username.toLowerCase()}${this.gsSecretKey}`).toUpperCase(),
        });

        if (resGS.errCode !== GSErrorCodes.SUCCESS.code) throw new BadRequestException(resGS.errMsg);
      }

      // Kiểm tra sự tồn tại của username hoặc email trong cùng một truy vấn
      const existingUser = await this.userModel.findOne({
        $or: [{ username }, { email }],
      });

      if (existingUser) {
        if (existingUser.username === username) {
          throw new ConflictException('Tên đăng nhập đã tồn tại');
        }
      }

      // Hash password và tạo user mới
      const hashedPassword = await hashPassword(password);

      const _role = role ? role : Number(user.role) + 1;

      if (!_role) {
        throw new ConflictException('Vai trò người dùng không hợp lệ');
      }

      const newUser = new this.userModel({
        username,
        fullName,
        email,
        password: hashedPassword,
        mobile,
        walletBalance,
        role: _role,
        parentId: user.id,
      });

      return await newUser.save();
    } catch (error) {
      throw error;
    }
  }

  async findAll(userId: string, paginationOptions: { page: number; limit: number }): Promise<PaginationResult<User>> {
    const { page, limit } = paginationOptions;
    const skip = (page - 1) * limit;
    const [results, total] = await Promise.all([
      this.userModel.find({ parentId: userId }).skip(skip).limit(limit).exec(),
      this.userModel.countDocuments({ parentId: userId }).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      results,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findById(user: any, id: string): Promise<User> {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException(`${id} không đúng định dạng Mongodb`);
    }

    const _user = await this.userModel.findById(id).exec();
    if (!_user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (user.role < _user.role) {
      throw new ForbiddenException(`User with role ${user.role} not permissions`);
    }

    return _user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException(`${id} không đúng định dạng Mongodb`);
    }

    const { name, email, password } = updateUserDto;
    const updateData: UpdateUserDto = { name, email };

    // Nếu có password, hash nó và thêm vào đối tượng cập nhật
    if (password) {
      const hashedPassword = await hashPassword(password);
      if (hashedPassword) {
        updateData.password = hashedPassword;
      }
    }

    // Cập nhật user
    const user = await this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException(`User with email ${username} not found`);
    }

    return user;
  }
}
