import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './schemas/wallet.schema';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  // @Post()
  // async create(@Body() createWalletDto: CreateWalletDto): Promise<Wallet> {
  //   return await this.walletsService.create(createWalletDto);
  // }

  @Get()
  async findAll(): Promise<Wallet[]> {
    return await this.walletsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Wallet> {
    return await this.walletsService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto): Promise<Wallet> {
    return await this.walletsService.update(id, updateWalletDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Wallet> {
    return await this.walletsService.remove(id);
  }
}
