import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword } from '@/shared/utils/hash.util';
import { GSService } from '@/common/services/gs/gs.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly gsService: GSService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { fullName, username, email, password, role, phoneNumber } = createUserDto;

      const resGS = await this.gsService.createPlayer({ operatorcode: '', username: username, signature: '' });

      const existingUserNameUser = await this.userModel.exists({ username });
      if (existingUserNameUser) {
        throw new ConflictException('Username already exists');
      }

      const existingPassWordUser = await this.userModel.exists({ email });
      if (existingPassWordUser) {
        throw new ConflictException('Email already exists');
      }

      const hashedPassword = await hashPassword(password);
      const newUser = new this.userModel({ username, fullName, email, password: hashedPassword, role, phoneNumber });

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
}
