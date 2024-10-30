import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { GSService } from '@/common/services/gs/gs.service';
import { ConfigModule } from '@/config/config.module';
import { HttpModule } from '@/common/services/http/http.module';
import { UsersService } from '../users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [HttpModule, ConfigModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [GamesController],
  providers: [GamesService, UsersService, GSService],
  exports: [GamesService],
})
export class GamesModule {}
