import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public } from '@/common/decorators/public.decorator';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateAuthDto } from './dto/create-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập' })
  @ApiResponse({ status: 200, description: 'Thành công' })
  @ApiBody({
    type: CreateAuthDto,
  })
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({ status: 200, description: 'Thành công' })
  @ApiBody({
    type: RefreshTokenDto,
  })
  async refreshToken(@Body() body: RefreshTokenDto) {
    const { refreshToken } = body;
    const tokens = await this.authService.refreshToken(refreshToken);
    return tokens;
  }
}
