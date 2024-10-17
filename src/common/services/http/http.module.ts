import { Module } from '@nestjs/common';
import { HttpModule as AxiosHttpModule } from '@nestjs/axios';
import { HttpService } from './http.service';

@Module({
  imports: [AxiosHttpModule], // Sử dụng HttpModule từ @nestjs/axios
  providers: [HttpService],
  exports: [HttpService], // Xuất ra để các module khác có thể sử dụng
})
export class HttpModule {}
