import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '@/modules/users/users.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/passport/jwt-auth.guard';
import { GSModule } from './common/services/gs/gs.module';
import { RedisModule } from './common/services/redis/redis.module';
import { RolesGuard } from './common/guards/roles.guard';
import { GamesModule } from './modules/games/games.module';
import { WalletsModule } from './modules/wallets/wallets.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './common/tasks/tasks.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getMongoDbUrl(),
      }),
    }),
    ScheduleModule.forRoot(),
    TasksModule,
    RedisModule,
    UsersModule,
    AuthModule,
    GSModule,
    GamesModule,
    WalletsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
