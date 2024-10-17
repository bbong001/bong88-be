import { Injectable } from '@nestjs/common';
import { HttpService } from '../http/http.service';
import { ConfigService } from '@/config/config.service';
import { CreatePlayer } from './interfaces/create-player.interface';

@Injectable()
export class GSService {
  private readonly gsApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.gsApiUrl = configService.getGSApiUrl();
  }

  async createPlayer(_createPlayer: CreatePlayer): Promise<any> {
    console.log('🚀 ~ GSService ~ createPlayer ~ _createPlayer:', _createPlayer);
    // console.log(`${this.gsApiUrl}/${stringify(_createPlayer)}`);
    return this.httpService.get(`${this.gsApiUrl}`);
  }
}
