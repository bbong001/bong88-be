import { Controller, Get, Post, Body, Patch, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './schemas/wallets.schema';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ROLES } from '@/shared/constants/role.constant';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorators';

@ApiTags('Wallets')
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết ví' })
  @ApiResponse({ status: 200, description: 'Thành công' })
  async findOne(@Param('id') id: string): Promise<Wallet> {
    return await this.walletsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Sửa số dư hoặc trạng thái ví' })
  @Roles(ROLES.ADMIN, ROLES.SUPER, ROLES.MASTER, ROLES.AGENT)
  async update(
    @Param('id') id: string,
    @Body() updateWalletDto: UpdateWalletDto,
    @CurrentUser() currentUser: any,
  ): Promise<Wallet> {
    return await this.walletsService.update(id, updateWalletDto, currentUser);
  }
}
