import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { GSService } from '@/common/services/gs/gs.service';
import { HttpModule } from '@/common/services/http/http.module';
import { ConfigModule } from '@/config/config.module';

@Module({
  imports: [HttpModule, ConfigModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService, GSService],
  exports: [UsersService],
})
export class UsersModule {}
