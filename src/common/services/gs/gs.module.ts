import { Module } from '@nestjs/common';
import { GSService } from './gs.service';
import { HttpModule } from '../http/http.module';
import { ConfigModule } from '@/config/config.module';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [GSService],
  exports: [GSService],
})
export class GSModule {}
