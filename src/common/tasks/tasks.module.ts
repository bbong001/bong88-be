import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ConfigModule } from '@/config/config.module';
import { GSModule } from '../services/gs/gs.module';

@Module({
  imports: [ConfigModule, GSModule],
  providers: [TasksService],
})
export class TasksModule {}
