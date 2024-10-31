import { forwardRef, Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { Wallet, WalletSchema } from './schemas/wallets.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@/config/config.module';
import { UsersModule } from '../users/users.module';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Wallet.name, schema: WalletSchema },
      { name: User.name, schema: UserSchema },
    ]),
    ConfigModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [WalletsController],
  providers: [WalletsService],
  exports: [WalletsService, MongooseModule],
})
export class WalletsModule {}
