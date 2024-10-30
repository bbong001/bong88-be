import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { GSService } from '@/common/services/gs/gs.service';
import { HttpModule } from '@/common/services/http/http.module';
import { ConfigModule } from '@/config/config.module';
import { AdminInitializerService } from './admin-initializer.service';
import { WalletsModule } from '../wallets/wallets.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    HttpModule,
    ConfigModule,
    WalletsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, GSService, AdminInitializerService],
  exports: [UsersService],
})
export class UsersModule {}
