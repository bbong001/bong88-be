import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wallet } from './schemas/wallets.schema';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class WalletsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Wallet.name) private walletModel: Model<Wallet>,
  ) {}

  async createWallet(createWalletDto: CreateWalletDto): Promise<Wallet> {
    const { userId, username, wallet, balance, parentWalletId } = createWalletDto;
    try {
      const existingUser = await this.userModel.findOne({ username: createWalletDto.username });
      if (!existingUser) {
        throw new NotFoundException('Không tồn tại người dùng này');
      }
      const existingWallet = await this.walletModel.findOne({ userId: existingUser._id });
      if (existingWallet && existingWallet.wallet === wallet) {
        throw new ConflictException(`Loại ví ${wallet} đã tồn tại cho người dùng này`);
      }

      const walletParent = await this.walletModel.findById(parentWalletId).exec();
      if (!walletParent) {
        throw new NotFoundException('Không tồn tại ví cha');
      }
      if (walletParent.balance < balance) {
        throw new BadRequestException(`Số dư của ${walletParent.username} không đủ`);
      }
      // Tạo ví mới
      const newWallet = new this.walletModel({ userId, username, wallet, balance, parentWalletId });
      const _newWallet = await newWallet.save();

      if (_newWallet) {
        // Cập nhật balance của ví parent
        walletParent.balance -= balance;
        await walletParent.save(); // Lưu cập nhật balance mới của ví parent
      }

      return _newWallet;
    } catch (error) {
      await this.userModel.findByIdAndDelete(userId);
      throw error;
    }
  }

  async findById(id: string): Promise<Wallet> {
    try {
      const wallet = await this.walletModel.findById(id).exec();
      if (!wallet) throw new NotFoundException(`Ví với id ${id} không tồn tại`);
      return wallet;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateWalletDto: UpdateWalletDto, currentUser: any): Promise<Wallet> {
    try {
      const { balance, status } = updateWalletDto;
      const wallet = await this.walletModel.findById(id).exec();
      if (!wallet) throw new NotFoundException(`Ví với id ${id} không tồn tại`);

      const user = await this.userModel.findOne({ username: wallet.username });
      if (user.parentId !== currentUser.id)
        throw new ForbiddenException(`Không thể tác động tới người dùng không thuộc phạm vi quản lý`);

      const walletParent = await this.walletModel.findById(wallet.parentWalletId).exec();
      if (!walletParent) {
        throw new NotFoundException('Không tồn tại ví cha');
      }

      if (walletParent.balance < balance) {
        throw new BadRequestException(`Số dư của ${walletParent.username} không đủ`);
      }

      const updateWallet = await this.walletModel.findByIdAndUpdate(id, { balance, status }, { new: true }).exec();

      return updateWallet;
    } catch (error) {
      throw error;
    }
  }

  async findByUsername(username: string): Promise<Wallet> {
    try {
      const wallet = await this.walletModel.findOne({ username }).exec();
      if (!wallet) throw new NotFoundException(`Ví của ${username} không tồn tại`);
      return wallet;
    } catch (error) {
      throw error;
    }
  }

  async calculateTotalBalanceByParent(parentWalletId: Types.ObjectId): Promise<number> {
    const result = await this.walletModel.aggregate([
      { $match: { parentWalletId } }, // Lọc các ví có cùng parentWalletId
      { $group: { _id: null, totalBalance: { $sum: '$balance' } } }, // Tính tổng balance
    ]);

    // Nếu không có ví nào thỏa mãn điều kiện, trả về 0
    return result.length > 0 ? result[0].totalBalance : 0;
  }
}
