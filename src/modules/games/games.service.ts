import { GSService } from '@/common/services/gs/gs.service';
import { ConfigService } from '@/config/config.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { LaunchGamesDto } from './dto/launch-games.dto';
import { UsersService } from '../users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { base64Encoded, hashMD5 } from '@/shared/utils/hash.util';
import { GSErrorCodes } from '@/shared/constants/gs-error.constants';

@Injectable()
export class GamesService {
  private readonly gsOperatorCode: string;
  private readonly gsSecretKey: string;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly gsService: GSService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    this.gsOperatorCode = configService.getGSOperatorCode();
    this.gsSecretKey = configService.getGSSecretKey();
  }

  async launchGames(currentUser: any, launchGamesDto: LaunchGamesDto): Promise<any> {
    try {
      const { id } = currentUser;
      const { providerCode, type, gameId, lang, html5, bLimit } = launchGamesDto;
      const { username, password } = await this.usersService.findById(currentUser, id);

      const resGS = await this.gsService.launchGames({
        operatorcode: this.gsOperatorCode,
        providercode: providerCode,
        username: username.toLowerCase(),
        password: base64Encoded(password),
        type: type,
        gameid: gameId,
        lang: lang || 'vi-VN',
        html5: html5,
        signature: hashMD5(
          `${this.gsOperatorCode}${base64Encoded(password)}${providerCode}${type}${username.toLowerCase()}${this.gsSecretKey}`,
        ).toUpperCase(),
        blimit: bLimit,
      });

      if (resGS.errCode !== GSErrorCodes.SUCCESS.code) throw new BadRequestException(resGS.errMsg);

      return resGS;
    } catch (error) {
      throw error;
    }
  }
}
