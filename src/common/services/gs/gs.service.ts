import { Injectable } from '@nestjs/common';
import { HttpService } from '../http/http.service';
import { ConfigService } from '@/config/config.service';
import qs from 'qs';
import { CreatePlayer } from './interfaces/create-player.interface';
import { GetBalance } from './interfaces/get-balance.interface';
import { LaunchGames } from './interfaces/launch-games.interface';

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
    const endpoint = `${this.gsApiUrl}/createMember.aspx`;
    const queryString = qs.stringify(_createPlayer);
    const url = `${endpoint}?${queryString}`;

    try {
      const response = await this.httpService.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getBalance(_getBalance: GetBalance): Promise<any> {
    const endpoint = `${this.gsApiUrl}/getBalance.aspx`;
    const queryString = qs.stringify(_getBalance);
    const url = `${endpoint}?${queryString}`;

    try {
      const response = await this.httpService.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async launchGames(_launchGames: LaunchGames): Promise<any> {
    const endpoint = `${this.gsApiUrl}/launchGames.aspx`;
    const queryString = qs.stringify(_launchGames);
    const url = `${endpoint}?${queryString}`;

    try {
      const response = await this.httpService.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
