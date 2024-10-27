import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Request,
  HttpStatus,
  HttpCode,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/common/decorators/roles.decorator';
import { ROLES } from '@/shared/constants/role.constant';
import { PaginationResult } from '@/common/interfaces/pagination-result.interface';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorators';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Tạo mới 1 người dùng' })
  @ApiResponse({ status: 200, description: 'Thành công' })
  @Post()
  @Roles(ROLES.ADMIN, ROLES.SUPER, ROLES.MASTER, ROLES.AGENT)
  async createUser(@CurrentUser() user: any, @Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(user, createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách người dùng theo bộ lọc' })
  @ApiResponse({ status: 200, description: 'Thành công' })
  @Roles(ROLES.ADMIN, ROLES.SUPER, ROLES.MASTER, ROLES.AGENT)
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Trang hiện tại' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Số lượng bản ghi trên mỗi trang' })
  async getAllUsers(
    @CurrentUser() user: any,
    @Query(new ValidationPipe({ transform: true })) paginationQuery: PaginationQueryDto,
  ): Promise<PaginationResult<User>> {
    const { page, limit } = paginationQuery;
    return this.usersService.findAll(user.id, { page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết một người dùng' })
  @ApiResponse({ status: 200, description: 'Thành công' })
  @Roles(ROLES.ADMIN, ROLES.SUPER, ROLES.MASTER, ROLES.AGENT)
  async getUserById(@CurrentUser() user: any, @Param('id') id: string): Promise<User> {
    return this.usersService.findById(user, id);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUser(id);
  }
}
