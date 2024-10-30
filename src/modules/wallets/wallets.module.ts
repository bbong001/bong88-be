// wallets.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { Wallet, WalletSchema } from './schemas/wallet.schema';
import { UsersModule } from '../users/users.module';
import { HttpModule } from '@/common/services/http/http.module';
import { ConfigModule } from '@/config/config.module';

@Module({
    imports: [
        HttpModule,
        ConfigModule,
        MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
        forwardRef(() => UsersModule), // Sử dụng forwardRef để xử lý phụ thuộc vòng
    ],
    controllers: [WalletsController],
    providers: [WalletsService],
    exports: [WalletsService, MongooseModule],
})
export class WalletsModule { }
