import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { GamesService } from './games.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ROLES } from '@/shared/constants/role.constant';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorators';
import { LaunchGamesDto } from './dto/launch-games.dto';

@ApiTags('Games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get('lg')
  @ApiOperation({ summary: 'Launch games' })
  @ApiResponse({ status: 200, description: 'Thành công' })
  @Roles(ROLES.PLAYER)
  @ApiQuery({
    name: 'providerCode',
    required: true,
    type: String,
    description:
      'Please refer to \n1. Game Type Code for the categories \nFor example: SL = slot \n and \n2. SUPPORTED GAME TYPE CODE in Provider Code table 各自供应商所支持的游戏类型 \nFor example: GS only support SL games',
  })
  @ApiQuery({
    name: 'type',
    required: true,
    type: String,
    description:
      'Please refer to \n1. Game Type Code for the categories \nFor example: SL = slot \n and \n2. SUPPORTED GAME TYPE CODE in Provider Code table 各自供应商所支持的游戏类型 \nFor example: GS only support SL games',
  })
  @ApiQuery({ name: 'gameId', required: false, type: String, description: 'Game ID' })
  @ApiQuery({
    name: 'lang',
    required: false,
    type: String,
    description: 'ISO 639-1 and ISO 3166-1 alpha-2 code , default language en-US',
  })
  @ApiQuery({
    name: 'html5',
    required: false,
    type: String,
    description: 'html5=0, for flash(not mobile friendly) \nhtml5=1, for html5(mobile friendly)',
  })
  @ApiQuery({
    name: 'bLimit',
    required: false,
    type: String,
    description: 'Bet limit id/group (currently only support product/provider code GA,AG,GE)',
  })
  async launchGames(
    @CurrentUser() currentUser: any,
    @Query(new ValidationPipe({ transform: true })) launchGamesDto: LaunchGamesDto,
  ): Promise<any> {
    return this.gamesService.launchGames(currentUser, launchGamesDto);
  }
}
