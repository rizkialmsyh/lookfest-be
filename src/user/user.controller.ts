import {
  Controller,
  Get,
  UseGuards,
  Body,
  Patch,
  Request,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/libs/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/changePassword.input.dto';
import { ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UserProfileResponseDto } from './dto/user.profile.response.dto';
import { UserListResponseDto } from './dto/user.response.dto';
import { Roles } from 'src/libs/guards/roles.decorator';
import { RolesGuard } from 'src/libs/guards/roles.guard';
import { UpdateRoleDto } from './dto/updateRole.input.dto';
import { ApiResponseDto } from 'src/transaction/dto/transaction.response.dto';

@Controller('v1/user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiQuery({
    name: 'page',
    required: false,
    schema: { default: 1 },
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    schema: { default: 10 },
  })
  @ApiQuery({
    name: 'name',
    required: false,
    schema: { default: '' },
  })
  @ApiQuery({
    name: 'email',
    required: false,
    schema: { default: '' },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all users',
    type: [UserListResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getAllUser(
    @Query('page') page: number | 1, 
    @Query('limit') limit: number | 10,
    @Query('name') name: string | '',
    @Query('email') email: string | '',
  ) {
    return this.userService.getAllUser(page, limit, name, email);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user profile',
    type: UserProfileResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getUserProfile(@Request() req) {
    const userId = req.user.sub;
    return this.userService.getUserProfileByToken(userId);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Password successfully changed',
    schema: {
      example: { message: 'Password successfully changed' },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, invalid data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized or incorrect old password',
  })
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userId = req.user.sub;
    return this.userService.changePassword(userId, changePasswordDto);
  }

  @Patch('update-role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully',
    schema: {
      example: { message: 'Role updated successfully' },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized or invalid role',
  })
  async updateRole(@Body() updateRoleDto: UpdateRoleDto) {
    const { userId, role } = updateRoleDto;
    return this.userService.updateRole(userId, role);
  }

  @Get('user-transaction')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({
    name: 'limit',
    required: false,
    schema: { default: 10 },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    schema: { default: 1 },
  })
  @ApiResponse({
    status: 200,
    description: 'List of all transactions',
    type: ApiResponseDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user transactions',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getTransactionsByUser(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const userId = req.user.sub;
    const result = await this.userService.getTransactionsByUser(
      userId,
      page,
      limit,
    );
    return {
      message: 'Successfully retrieved user transactions',
      ...result,
    };
  }
}
