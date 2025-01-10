import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { CreateReplyDto } from './dto/create-reply.input.dto';
import { UpdateReplyDto } from './dto/update-reply.input.dto';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/libs/guards/jwt-auth.guard';
import { RolesGuard } from 'src/libs/guards/roles.guard';
import { Roles } from 'src/libs/guards/roles.decorator';
import { ReplyListResponseDto, ReplyResponseDto } from './dto/reply-response.dto';

@Controller('v1/reply')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @Get('all')
  @ApiResponse({
    status: 200,
    description: 'Return all reply',
    type: [ReplyListResponseDto],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return await this.replyService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Return a reply',
    type: ReplyResponseDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return await this.replyService.findOne(id);
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The reply has been successfully created.',
  })
  @ApiBody({
    type: CreateReplyDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(
    @Body() createReplyDto: CreateReplyDto,
    @Req() req: any,
  ) {
    const { reviewId, reply } = createReplyDto;
    const userId = req.user.sub;
    return await this.replyService.create(userId, reviewId, reply);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'The reply has been successfully updated.',
  })
  @ApiBody({
    type: UpdateReplyDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async update(
    @Param('id') id: string, 
    @Body() updateReplyDto: UpdateReplyDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    updateReplyDto = { ...updateReplyDto };
    return await this.replyService.update(id, updateReplyDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The reply has been successfully deleted.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return await this.replyService.remove(id);
  }
}
