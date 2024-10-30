import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { Wallet, WalletSchema } from './schemas/wallets.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@/config/config.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]), ConfigModule],
  controllers: [WalletsController],
  providers: [WalletsService],
  exports: [WalletsService, MongooseModule],
})
export class WalletsModule {}
