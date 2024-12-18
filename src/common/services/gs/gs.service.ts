import { Injectable } from '@nestjs/common';
import { HttpService } from '../http/http.service';
import { ConfigService } from '@/config/config.service';
import qs from 'qs';
import { CreatePlayer } from './interfaces/create-player.interface';
import { LaunchGames } from './interfaces/launch-games.interface';
import { MakeTransfer } from './interfaces/make-transfer.interface';
import { GetBalance } from './interfaces/get-balance.interface';
import { LaunchDGames } from './interfaces/launch-dgames.interface';
import { ChangePassword } from './interfaces/change-password.interface';
import { CheckAgentCredit } from './interfaces/check-agent-credit.interface';
import { CheckMemberProductUsername } from './interfaces/check-member-product-username.interface';
import { CheckTransaction } from './interfaces/check-transaction.interface';
import { FetchByKey } from './interfaces/get-betting-history.interface';
import { GetDailyWager } from './interfaces/get-daily-wager.interface';
import { FetchArchieve } from './interfaces/get-betting-history-archieve.interface';
import { MarkByJson } from './interfaces/markbyjson.interface';
import { GetGameList } from './interfaces/get-game-list.interface';

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

  async makeTransfer(_makeTransfer: MakeTransfer): Promise<any> {
    const endpoint = `${this.gsApiUrl}/makeTransfer.aspx`;
    const queryString = qs.stringify(_makeTransfer);
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

  async launchDGames(_launchDGames: LaunchDGames): Promise<any> {
    const endpoint = `${this.gsApiUrl}/launchDGames.aspx`;
    const queryString = qs.stringify(_launchDGames);
    const url = `${endpoint}?${queryString}`;

    try {
      const response = await this.httpService.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(_changePassword: ChangePassword): Promise<any> {
    const endpoint = `${this.gsApiUrl}/changePassword.aspx`;
    const queryString = qs.stringify(_changePassword);
    const url = `${endpoint}?${queryString}`;

    try {
      const response = await this.httpService.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async checkAgentCredit(_checkAgentCredit: CheckAgentCredit): Promise<any> {
    const endpoint = `${this.gsApiUrl}/checkAgentCredit.aspx`;
    const queryString = qs.stringify(_checkAgentCredit);
    const url = `${endpoint}?${queryString}`;

    try {
      const response = await this.httpService.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async checkMemberProductUsername(_checkMemberProductUsername: CheckMemberProductUsername): Promise<any> {
    const endpoint = `${this.gsApiUrl}/checkMemberProductUsername.aspx`;
    const queryString = qs.stringify(_checkMemberProductUsername);
    const url = `${endpoint}?${queryString}`;

    try {
      const response = await this.httpService.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async checkTransaction(_checkTransaction: CheckTransaction): Promise<any> {
    const endpoint = `${this.gsApiUrl}/checkTransaction.aspx`;
    const queryString = qs.stringify(_checkTransaction);
    const url = `${endpoint}?${queryString}`;

    try {
      const response = await this.httpService.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getDailyWager(_getDailyWager: GetDailyWager): Promise<any> {
    const endpoint = `${this.gsApiUrl}/getDailyWager.aspx`;
    const queryString = qs.stringify(_getDailyWager);
    const url = `${endpoint}?${queryString}`;

    try {
      const response = await this.httpService.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async fetchArchieve(_fetchArchieve: FetchArchieve): Promise<any> {
    const endpoint = `${this.gsApiUrl}/fetchArchieve.aspx`;
    const queryString = qs.stringify(_fetchArchieve);
    const url = `${endpoint}?${queryString}`;

    try {
      const response = await this.httpService.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async markByJson(_markByJson: MarkByJson): Promise<any> {
    const endpoint = `${this.gsApiUrl}/markbyjson.ashx`;
    try {
      const response = await this.httpService.post(endpoint, _markByJson);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async markArchieve(_markArchieve: MarkByJson): Promise<any> {
    const endpoint = `${this.gsApiUrl}/markArchieve.ashx`;
    try {
      const response = await this.httpService.post(endpoint, _markArchieve);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getGameList(_getGameList: GetGameList): Promise<any> {
    const endpoint = `${this.gsApiUrl}/getGameList.ashx`;
    const queryString = qs.stringify(_getGameList);
    const url = `${endpoint}?${queryString}`;

    try {
      const response = await this.httpService.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
