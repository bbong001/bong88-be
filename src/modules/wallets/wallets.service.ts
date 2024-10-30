import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wallet } from './schemas/wallet.schema';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { User } from '../users/schemas/user.schema'; 

@Injectable()
export class WalletsService {
  constructor(
    @InjectModel(User.name) private  userModel: Model<User>, // Inject UserModel
    @InjectModel(Wallet.name) private  walletModel: Model<Wallet>,
  ) {}

  async create(createWalletDto: CreateWalletDto): Promise<Wallet> {
    const existingUser = await this.userModel.findOne({username:createWalletDto.username});
    if (!existingUser) {
      throw new ConflictException('Không tồn tại người dùng này');
    }
    const existingWallet = await this.walletModel.findOne({ userId: existingUser._id });
    if (existingWallet) {
      throw new ConflictException('Ví đã tồn tại cho người dùng này');
    }

    const newWallet = new this.walletModel(createWalletDto);
    return await newWallet.save();
  }

  async findAll(): Promise<Wallet[]> {
    return await this.walletModel.find().exec();
  }

  async findById(id: string): Promise<Wallet> {
    const wallet = await this.walletModel.findById(id).exec();
    if (!wallet) throw new NotFoundException(`Ví với id ${id} không tồn tại`);
    return wallet;
  }

  async update(id: string, updateWalletDto: UpdateWalletDto): Promise<Wallet> {
    const wallet = await this.walletModel.findByIdAndUpdate(id, updateWalletDto, { new: true }).exec();
    if (!wallet) throw new NotFoundException(`Ví với id ${id} không tồn tại`);
    return wallet;
  }

  async remove(id: string): Promise<Wallet> {
    const wallet = await this.walletModel.findByIdAndDelete(id).exec();
    if (!wallet) throw new NotFoundException(`Ví với id ${id} không tồn tại`);
    return wallet;
  }
}
