import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Connection, Model, Types } from 'mongoose';
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
import { WalletsService } from '../wallets/wallets.service';
import { WALLET_TYPE } from '@/shared/constants/wallet.constant';

@Injectable()
export class UsersService {
  private readonly gsOperatorCode: string;
  private readonly gsSecretKey: string;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectConnection() private readonly connection: Connection,

    private readonly configService: ConfigService,
    private readonly gsService: GSService,
    private readonly walletsService: WalletsService,
  ) {
    this.gsOperatorCode = configService.getGSOperatorCode();
    this.gsSecretKey = configService.getGSSecretKey();
  }

  async createUser(currentUser: any, createUserDto: CreateUserDto): Promise<any> {
    try {
      const { fullName, username, email, password, mobile, walletBalance, role } = createUserDto;

      // Kiểm tra vai trò người dùng hợp lệ
      if (1 > role || role > 5) {
        throw new ConflictException('Role không hợp lệ');
      }
      if (role < currentUser.role) {
        throw new ConflictException('Không thể tạo tài khoản có quyền lớn hơn tài khoản của bạn');
      }

      // Kiểm tra sự tồn tại của username hoặc email
      await this.checkUserExistence(username, email);

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Xác định vai trò người dùng mới
      const _role = role || currentUser.role + 1;
      if (!_role) throw new ConflictException('Vai trò người dùng không hợp lệ');

      // Tạo người chơi trên GS (nếu cần)
      if (role === ROLES.PLAYER || currentUser.role === ROLES.AGENT) {
        await this.createGSPlayer(username);
      }
      const walletCurrentUser = await this.walletsService.findByUsername(currentUser.username);
      //kiểm tra ví cha còn đủ tiền không 
      if (walletCurrentUser.balance < walletBalance) {
        throw new ConflictException('Tài khoản không đủ để tạo tài khoản con');
      }

      // Tạo user mới và lưu vào database
      const newUser = new this.userModel({
        username,
        fullName,
        email,
        password: hashedPassword,
        mobile,
        role: _role,
        parentId: currentUser.id,
      });
      const savedUser = await newUser.save();

      // Tạo wallet cho user mới

      const newWallet = await this.walletsService.createWallet({
        userId: savedUser._id as Types.ObjectId,
        username: username,
        wallet: WALLET_TYPE.MAIN,
        balance: walletBalance,
        parentWalletId: walletCurrentUser._id as Types.ObjectId,
      });
      return {
        user: savedUser,
        wallet: newWallet,
      };
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

      const { fullName, email, password, mobile, accountStatus, role } = updateUserDto;
      const updateData: UpdateUserDto = { fullName, email, password, mobile, accountStatus, role };

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

  async findByUserId(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new NotFoundException(`User with email ${email} not found`);

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username: username }).exec();
    console.log("user", user);
    if (!user) throw new NotFoundException(`User with username ${username} not found`);

    return user;
  }
  async findAndUpdateIp(username: string, ip: string): Promise<User> {
    const user = await this.userModel.findOneAndUpdate({ username: username }, { ip: ip }).exec();
    console.log("user", user);
    if (!user) throw new NotFoundException(`User with username ${username} not found`);

    return user;
  }

  async checkCurrentUserCanAction(userId: string, currentUserId: Types.ObjectId): Promise<boolean> {
    const userUpdate = await this.userModel.findById(userId).exec();
    if (!userUpdate) throw new NotFoundException(`User with id ${userId} not found`);
    if (userUpdate.parentId !== currentUserId) return false;
    return true;
  }

  // Hàm kiểm tra sự tồn tại của user
  private async checkUserExistence(username: string, email: string): Promise<void> {
    const existingUser = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      if (existingUser.username === username) {
        throw new ConflictException('Tên đăng nhập đã tồn tại');
      } else if (existingUser.email === email) {
        throw new ConflictException('Email đã tồn tại');
      }
    }
  }

  async findByIdAndDelete(id: string) {
    await this.userModel.findByIdAndDelete(id);
  }

  // Hàm tạo người chơi trên hệ thống GS
  private async createGSPlayer(username: string): Promise<void> {
    const resGS = await this.gsService.createPlayer({
      operatorcode: this.gsOperatorCode,
      username: username.toLowerCase(),
      signature: hashMD5(`${this.gsOperatorCode}${username.toLowerCase()}${this.gsSecretKey}`).toUpperCase(),
    });
    if (resGS.errCode !== GSErrorCodes.SUCCESS.code) {
      throw new BadRequestException(resGS.errMsg);
    }
  }
}
