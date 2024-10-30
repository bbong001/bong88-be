import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashMD5, hashPassword } from '@/shared/utils/hash.util';
import { GSService } from '@/common/services/gs/gs.service';
import { ConfigService } from '@/config/config.service';
import { GSErrorCodes } from '@/shared/constants/gs-error.constants';
import { ROLES } from '@/shared/constants/role.constant';
import { PaginationResult } from '@/common/interfaces/pagination-result.interface';
import { Wallet } from '../wallets/schemas/wallets.schema';

@Injectable()
export class UsersService {
  private readonly gsOperatorCode: string;
  private readonly gsSecretKey: string;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Wallet.name) private walletsModel: Model<Wallet>,

    private readonly gsService: GSService,
    private readonly configService: ConfigService,
  ) {
    this.gsOperatorCode = configService.getGSOperatorCode();
    this.gsSecretKey = configService.getGSSecretKey();
  }

  async createUser(user: any, createUserDto: CreateUserDto): Promise<User> {
    try {
      const { fullName, username, email, password, mobile, walletBalance, role } = createUserDto;

      if (role < user.role) throw new ConflictException('Không thể tạo tài khoản có quyền lớn hơn tài khoản của bạn');

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

      if (!_role) throw new ConflictException('Vai trò người dùng không hợp lệ');

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
      const savedUser = await newUser.save();

      // Tạo ví cho người dùng mới
      const newWallet = new this.walletsModel({
        userId: savedUser._id,
        username: savedUser.username,
        money: walletBalance || 0, // Đặt số dư ví ban đầu
        status: false, // Trạng thái mặc định
      });
  
      await newWallet.save(); // Lưu ví
  
      return savedUser; 

    } catch (error) {
      throw error;
    }
  }
  async findAll(userId: string, paginationOptions: { page: number; limit: number }): Promise<PaginationResult<User>> {
    try {
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
    } catch (error) {
      throw error;
    }
  }

  async findById(user: any, id: string): Promise<User> {
    if (!mongoose.isValidObjectId(id)) throw new BadRequestException(`${id} không đúng định dạng Mongodb`);

    const _user = await this.userModel.findById(id).exec();
    if (!_user) throw new NotFoundException(`User with id ${id} not found`);

    if (user.role < _user.role) throw new ForbiddenException(`User with role ${user.role} not permissions`);

    return _user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto, currentUser: any): Promise<User> {
    try {
      if (!mongoose.isValidObjectId(id)) throw new BadRequestException(`${id} không đúng định dạng Mongodb`);

      const { fullName, email, password, mobile, walletBalance, accountStatus, role } = updateUserDto;
      const updateData: UpdateUserDto = { fullName, email, password, mobile, walletBalance, accountStatus, role };

      const isCurrentUserCanAction = await this.checkCurrentUserCanAction(id, currentUser.id);
      if (!isCurrentUserCanAction) throw new ForbiddenException(`Không thể sửa người dùng không thuộc phạm vi quản lý`);

      if (password) {
        // Nếu có password, hash nó và thêm vào đối tượng cập nhật
        const hashedPassword = await hashPassword(password);
        if (hashedPassword) updateData.password = hashedPassword;
      }

      if (role && role <= currentUser.role)
        throw new ConflictException('Role không thể cao hơn hoặc bằng người chỉ định');

      // Cập nhật user
      const user = await this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();

      if (!user) throw new NotFoundException(`User with id ${id} not found`);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new NotFoundException(`User with email ${email} not found`);

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) throw new NotFoundException(`User with email ${username} not found`);

    return user;
  }

  async checkCurrentUserCanAction(userId: string, currentUserId: Types.ObjectId): Promise<boolean> {
    const userUpdate = await this.userModel.findById(userId).exec();
    if (!userUpdate) throw new NotFoundException(`User with id ${userId} not found`);
    if (userUpdate.parentId !== currentUserId) return false;
    return true;
  }
}
