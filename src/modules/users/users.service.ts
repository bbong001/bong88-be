import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

  async createUser(req, createUserDto: CreateUserDto): Promise<User> {
    try {
      const { fullName, username, email, password, mobile, walletBalance, role } = createUserDto;
      const { user } = req;

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
      });

      return await newUser.save();
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
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
